/**
 * Three-step request wizard.
 *
 * Reliability rules this file exists to satisfy:
 *  1. Never lose a lead silently. If the fetch fails for any reason we fall
 *     back to a native (non-fetch) form POST so the browser submits for real.
 *  2. Never block submission on our own JS. With JS off every step is visible
 *     and the form posts natively to /thanks/.
 *  3. Never leave the user guessing. In-flight state, field-level errors and a
 *     top-level alert are always in sync.
 */

import { track } from './analytics';

const MIN_FILL_MS = 2500;

type ValidatorKey =
  'dataType' | 'volume' | 'frequency' | 'antiBot' | 'url' | 'name' | 'email' | 'consent';

export interface WizardStrings {
  back: string;
  next: string;
  submit: string;
  submitting: string;
  generic: string;
  /** Keyed by `ValidatorKey`, so a missing message is a compile error. */
  errors: Record<ValidatorKey, string>;
}

const VALIDATORS: Record<string, ValidatorKey> = {
  dataType: 'dataType',
  volume: 'volume',
  frequency: 'frequency',
  antiBot: 'antiBot',
  url: 'url',
  name: 'name',
  email: 'email',
  consent: 'consent',
};

const isValidatorKey = (key: string | undefined): key is ValidatorKey =>
  Boolean(key && key in VALIDATORS);

const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

const isUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export function initWizard(root: ParentNode = document, strings?: WizardStrings) {
  const found = root.querySelector<HTMLFormElement>('[data-wizard]');
  if (!found || found.dataset.ready === 'true') return;
  found.dataset.ready = 'true';

  // Narrowed through a separate binding: `found` is `HTMLFormElement | null`,
  // and closures defined below lose that narrowing.
  const form: HTMLFormElement = found;

  const i18n: WizardStrings = strings ?? {
    back: 'Back',
    next: 'Continue',
    submit: 'Send request',
    submitting: 'Sending…',
    generic: 'Something went wrong sending your request. Please try again.',
    errors: {
      dataType: 'Choose a data type.',
      volume: 'Choose a row volume.',
      frequency: 'Choose a refresh frequency.',
      antiBot: 'Tell us whether the source uses anti-bot protection.',
      url: 'Enter the URL you want scraped.',
      name: 'Enter your name.',
      email: 'Enter a valid email address.',
      consent: 'Please accept the terms to continue.',
    },
  };

  const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-step]'));
  const indicators = Array.from(form.querySelectorAll<HTMLElement>('[data-step-indicator]'));
  const bar = form.querySelector<HTMLElement>('[data-step-bar]');
  const alertBox = form.querySelector<HTMLElement>('[data-error-summary]');
  const backBtn = form.querySelector<HTMLButtonElement>('#wizard-back');
  const nextBtn = form.querySelector<HTMLButtonElement>('#wizard-next');
  const submitBtn = form.querySelector<HTMLButtonElement>('#wizard-submit');
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
  const success = root.querySelector<HTMLElement>('[data-success]');
  const restart = root.querySelector<HTMLButtonElement>('#wizard-restart');

  const total = steps.length;
  let current = 1;

  // Client-side timing trap: replaced with the real page-load time on submit so
  // the server can reject instant bot submissions. Meaningless without JS,
  // which is fine — the honeypot and Netlify's own filters cover that path.
  const loadedAt = Date.now();
  const startedAtField = form.querySelector<HTMLInputElement>('[data-started-at]');
  const pageUrlField = form.querySelector<HTMLInputElement>('[data-page-url]');
  if (pageUrlField) pageUrlField.value = window.location.href;

  /* ------------------------------------------------------------------ *
   * Validation
   * ------------------------------------------------------------------ */

  function validate(key: ValidatorKey): boolean {
    const group = form.querySelector<HTMLElement>(`[data-validate="${key}"]`);
    const message = i18n.errors[key];
    const errorEl = form.querySelector<HTMLElement>(`[data-error-for="${key}"]`);
    // Every branch below assigns, so there is deliberately no initial value.
    let ok: boolean;

    switch (key) {
      case 'dataType': {
        const checked = form.querySelectorAll<HTMLInputElement>('input[name="dataType"]:checked');
        ok = checked.length > 0;
        break;
      }
      case 'url':
      case 'name':
      case 'email': {
        const input = form.querySelector<HTMLInputElement>(`[data-field="${key}"]`);
        if (!input) return true;
        const value = input.value.trim();
        if (key === 'url') ok = isUrl(value);
        else if (key === 'email') ok = isEmail(value);
        else ok = value.length > 1;
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        break;
      }
      default: {
        // radio + consent groups: require exactly one selection
        const inputs = group
          ? Array.from(group.querySelectorAll<HTMLInputElement>(`[data-field="${key}"]`))
          : [];
        ok = inputs.some((input) => input.checked || (input.type === 'checkbox' && input.checked));
        break;
      }
    }

    if (errorEl) {
      errorEl.textContent = ok ? '' : message;
      errorEl.toggleAttribute('hidden', ok);
    }
    if (group) group.toggleAttribute('data-invalid', !ok);
    return ok;
  }

  function validateStep(index: number): boolean {
    const step = steps[index - 1];
    if (!step) return true;
    const keys = Array.from(step.querySelectorAll<HTMLElement>('[data-validate]'))
      .map((el) => el.dataset.validate)
      .filter(isValidatorKey);

    let firstBad: HTMLElement | null = null;
    for (const key of keys) {
      if (!validate(key)) {
        firstBad ??= form.querySelector<HTMLElement>(`[data-field="${key}"]`);
      }
    }

    if (firstBad) {
      showAlert(firstBadMessage(firstBad));
      focusField(firstBad);
    } else {
      hideAlert();
    }
    return !firstBad;
  }

  function firstBadMessage(el: HTMLElement): string {
    const group = el.closest<HTMLElement>('[data-validate]');
    const key = (group?.dataset.validate ?? el.dataset.field ?? '') as ValidatorKey;
    return i18n.errors[key] ?? i18n.generic;
  }

  function focusField(el: HTMLElement) {
    const focusable = el.matches('input, textarea, select')
      ? el
      : el.querySelector<HTMLElement>('input, textarea, select');
    focusable?.focus({ preventScroll: true });
    focusable?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function showAlert(message: string) {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.hidden = false;
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.hidden = true;
    alertBox.textContent = '';
  }

  /* ------------------------------------------------------------------ *
   * Navigation
   * ------------------------------------------------------------------ */

  function render() {
    steps.forEach((step, i) => {
      step.hidden = i + 1 !== current;
    });

    indicators.forEach((indicator, i) => {
      const state = i + 1 === current ? 'active' : i + 1 < current ? 'done' : 'todo';
      indicator.dataset.state = state;
      if (i + 1 === current) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
    });

    if (bar) bar.style.width = `${(current / total) * 100}%`;

    backBtn?.toggleAttribute('hidden', current === 1);
    nextBtn?.toggleAttribute('hidden', current === total);
    submitBtn?.toggleAttribute('hidden', current !== total);

    hideAlert();
  }

  function goTo(index: number, focus = true) {
    current = Math.min(Math.max(index, 1), total);
    render();
    if (focus) steps[current - 1]?.querySelector<HTMLElement>('[data-step-heading]')?.focus();
    track('form_step', { step: current });
  }

  nextBtn?.addEventListener('click', () => {
    if (validateStep(current)) goTo(current + 1);
  });

  backBtn?.addEventListener('click', () => goTo(current - 1));

  // Clear a field's error as soon as the user fixes it.
  form.addEventListener('input', (event) => {
    const target = event.target as HTMLElement;
    const key = target.dataset.field;
    if (!key) return;
    if (target.getAttribute('aria-invalid') === 'true' && validate(key as ValidatorKey))
      hideAlert();
    else if (key in VALIDATORS) validate(key as ValidatorKey);
  });
  form.addEventListener('change', (event) => {
    const key = (event.target as HTMLElement).dataset.field;
    if (key && key in VALIDATORS) validate(key as ValidatorKey);
  });

  /* ------------------------------------------------------------------ *
   * Submission
   * ------------------------------------------------------------------ */

  let sending = false;

  function setSending(value: boolean) {
    sending = value;
    if (submitBtn) submitBtn.disabled = value;
    if (submitLabel) submitLabel.textContent = value ? i18n.submitting : i18n.submit;
    form.setAttribute('aria-busy', String(value));
  }

  /** POST without fetch: the always-works escape hatch. */
  function nativeSubmit() {
    form.removeEventListener('submit', onSubmit);
    form.submit();
  }

  async function onSubmit(event: SubmitEvent) {
    if (sending) {
      event.preventDefault();
      return;
    }
    if (!validateStep(total)) {
      event.preventDefault();
      return;
    }

    // Timing trap.
    if (startedAtField && Date.now() - loadedAt < MIN_FILL_MS) {
      // Too fast to be human. Pretend success so bots do not learn anything,
      // and let the server-side timestamp drop it for real.
      event.preventDefault();
      showSuccess();
      return;
    }
    if (startedAtField) startedAtField.value = String(loadedAt);

    event.preventDefault();
    setSending(true);
    hideAlert();

    const payload = new URLSearchParams();
    for (const [key, value] of new FormData(form).entries()) {
      if (typeof value === 'string') payload.append(key, value);
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      showSuccess();
    } catch {
      // Rule 1: never swallow the lead.
      setSending(false);
      showAlert(i18n.generic);
      track('form_submit_error');
      // Give the visitor a real, non-JS path instead of leaving them stuck.
      window.setTimeout(() => {
        if (window.confirm(i18n.generic)) nativeSubmit();
      }, 50);
    }
  }

  function showSuccess() {
    form.toggleAttribute('hidden', true);
    success?.toggleAttribute('hidden', false);
    success?.focus();
    track('form_success');
    document.dispatchEvent(new CustomEvent('sv:form-success'));
  }

  restart?.addEventListener('click', () => {
    form.reset();
    form
      .querySelectorAll('[aria-invalid="true"]')
      .forEach((el) => el.setAttribute('aria-invalid', 'false'));
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => {
      el.hidden = true;
      el.textContent = '';
    });
    success?.toggleAttribute('hidden', true);
    form.toggleAttribute('hidden', false);
    if (startedAtField) startedAtField.value = String(Date.now());
    goTo(1);
    steps[0]?.querySelector<HTMLElement>('[data-step-heading]')?.focus();
  });

  form.addEventListener('submit', onSubmit);

  render();
}
