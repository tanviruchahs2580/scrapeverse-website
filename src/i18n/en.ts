/**
 * English is the single source of truth for all site copy.
 * `bd.ts` is typed as `typeof en`, so any key added here and forgotten there
 * becomes a compile error. That is the guard against the copy-drift that broke
 * the previous hand-forked index.html / local.html pair.
 */

export const en = {
  meta: {
    siteName: 'ScrapeVerse',
    tagline: 'Web scraping & data extraction',
    defaultDescription:
      'Production-grade web scraping and data extraction. Anti-bot resilient crawlers, validated JSON/CSV delivery, and API access. First 1,000 rows free.',
  },

  nav: {
    home: 'Home',
    services: 'Services',
    process: 'Process',
    pricing: 'Pricing',
    compliance: 'Compliance',
    faq: 'FAQ',
    blog: 'Blog',
    sampleCta: 'Get a free sample',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
    switchToBd: 'বাংলা',
    switchToEn: 'English',
    switchLabel: 'Language',
  },

  announcement: {
    text: 'First 1,000 rows free — no card required.',
    cta: 'Request sample',
    dismiss: 'Dismiss announcement',
  },

  hero: {
    eyebrow: 'Data extraction infrastructure',
    titleTop: 'Live structured data.',
    titleBottom: 'Delivered on a schedule.',
    titleBottomEm: 'schedule',
    lead: 'We turn the public web into clean, validated JSON and CSV your team can actually use — lead lists, price monitoring, market intel, and training data for your models.',
    primaryCta: 'Get a free sample',
    secondaryCta: 'See how it works',
    note: 'Average first delivery: 12 hours. Human review on every dataset.',
    stats: [
      { value: '2.4M', label: 'Rows delivered monthly' },
      { value: '99.9%', label: 'Pipeline uptime' },
      { value: '12h', label: 'Median first delivery' },
      { value: '380+', label: 'Sites under contract' },
    ],
  },

  logos: {
    label: 'Data pipelines built for teams at',
    items: ['NEXUS LABS', 'ORBIT', 'HELIOSTAT', 'DATAVAULT', 'MERIDIAN', 'CASCADE'],
    disclaimer: 'Representative logos shown for layout demonstration.',
  },

  process: {
    eyebrow: 'How it works',
    title: 'Four steps from URL to verified dataset',
    lead: 'A managed pipeline, not a script you have to babysit. You define the outcome; we handle extraction, validation, and delivery.',
    steps: [
      {
        title: 'Tell us the target',
        body: 'Share the URLs and the fields you need. We reply with a feasibility read — anti-bot posture, pagination depth, and a fixed quote.',
      },
      {
        title: 'We map and extract',
        body: 'Our crawlers resolve the DOM, handle pagination and infinite scroll, and render JavaScript when the data only exists client-side.',
      },
      {
        title: 'Validate and deduplicate',
        body: 'Every row passes schema checks, type normalisation, and dedup against your existing dataset before it reaches you.',
      },
      {
        title: 'Deliver where you work',
        body: 'Push to your S3 or warehouse over API, deliver scheduled CSV, or trigger webhooks the moment new rows land.',
      },
    ],
  },

  capabilities: {
    eyebrow: 'Capabilities',
    title: 'Everything between a URL and a usable record',
    lead: 'Most scraping projects fail in the boring parts. Those are the parts we have already solved.',
    items: [
      {
        icon: 'globe',
        title: 'Structured web scraping',
        body: 'Product catalogues, reviews, job boards, directories, tenders and listings — parsed into typed schemas, not raw HTML dumps.',
      },
      {
        icon: 'code',
        title: 'JavaScript-rendered sites',
        body: 'SPAs and infinite-scroll feeds rendered in a real browser context so client-hydrated data is captured, not missed.',
      },
      {
        icon: 'shield',
        title: 'Anti-bot resilience',
        body: 'Residential proxy rotation, request fingerprinting, backoff and retry logic tuned per target instead of one global setting.',
      },
      {
        icon: 'filter',
        title: 'Cleaning and enrichment',
        body: 'Type normalisation, address standardisation, deduplication, currency conversion and geocoding before delivery.',
      },
      {
        icon: 'layers',
        title: 'API and webhooks',
        body: 'REST endpoints, signed webhooks and warehouse connectors so scraped data lands in your systems without a manual export.',
      },
      {
        icon: 'clock',
        title: 'Scheduled monitoring',
        body: 'Change detection on price, stock and content. You get the delta, not a full re-crawl, which keeps costs down.',
      },
    ],
  },

  sample: {
    eyebrow: 'Sample output',
    title: 'This is what delivery actually looks like',
    lead: 'A real extract from a retail target. Deduplicated, type-normalised, and schema-validated before delivery.',
    cta: 'Download full sample CSV',
    ctaNote: '2,400 rows · 11 columns · generated this week',
    chips: ['product', 'price', 'stock', 'rating', 'timestamp'],
    tableLabel: 'Sample extracted product records',
    columns: ['source', 'title', 'price', 'stock', 'rating', 'scraped_at'],
    rows: [
      [
        'aurelia-shop.com',
        'Merino Base Layer Hoodie',
        '84.00',
        'in_stock',
        '4.6',
        '2026-09-28T09:14Z',
      ],
      [
        'northpeak-outfitters.com',
        'Trail Runner GTX',
        '149.50',
        'in_stock',
        '4.8',
        '2026-09-28T09:14Z',
      ],
      [
        'lumen-goods.com',
        'Merino Base Layer Hoodie',
        '82.75',
        'low_stock',
        '4.4',
        '2026-09-28T09:15Z',
      ],
      [
        'cartwright-supply.co',
        'Canvas Work Jacket',
        '118.00',
        'in_stock',
        '4.9',
        '2026-09-28T09:15Z',
      ],
      [
        'meridian-supply.io',
        'Trail Runner GTX',
        '151.00',
        'out_of_stock',
        '4.5',
        '2026-09-28T09:16Z',
      ],
    ],
  },

  proof: {
    eyebrow: 'Proof',
    title: 'What changes after the pipeline is live',
    lead: 'Composite results from engagements in the last 18 months. Reference calls available under NDA.',
    metrics: [
      { value: '94%', label: 'Fewer manual data entry hours' },
      { value: '3.2x', label: 'Faster competitive pricing cycles' },
      { value: '0', label: 'Duplicate records since Q1' },
    ],
    testimonials: [
      {
        quote:
          'We had two contractors maintaining a brittle scraper for a competitor catalogue. ScrapeVerse moved it to a scheduled pipeline in eleven days. It has not broken since.',
        name: 'Head of Growth',
        company: 'Retail group, 400 staff',
        initials: 'HG',
      },
      {
        quote:
          'The validation layer is the reason we renewed. Rows arrive schema-valid, deduplicated, and reconciled against our warehouse. That used to be a full day of analyst work every week.',
        name: 'Director of Data',
        company: 'Logistics platform',
        initials: 'DD',
      },
      {
        quote:
          'Their feasibility read told us what a scrape would cost before we paid anything. Nobody else in this category was that transparent, and it set the tone for the whole engagement.',
        name: 'Founder',
        company: 'Market research agency',
        initials: 'FR',
      },
    ],
    testimonialPlaceholderNote: 'Names withheld under NDA. Illustrative composite accounts.',
  },

  pricing: {
    eyebrow: 'Pricing',
    title: 'Priced by delivery, not by surprise',
    lead: 'Quotes are fixed after the feasibility read. If the scope does not change, the price does not change.',
    monthly: 'Monthly',
    oneTime: 'One-time',
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        tagline: 'For pilots, MVPs and a single source.',
        monthlyPrice: '$99',
        oneTimePrice: '$290',
        priceSuffix: '/ month',
        oneTimeSuffix: 'one-off',
        featured: false,
        badge: '',
        customPrice: false,
        features: [
          'Up to 50,000 rows / month',
          '2 target websites',
          'JSON & CSV delivery',
          'Weekly refresh schedule',
          'Email support, 1 business day',
        ],
        cta: 'Start with Starter',
      },
      {
        id: 'growth',
        name: 'Growth',
        tagline: 'For teams scaling lead gen and pricing.',
        monthlyPrice: '$299',
        oneTimePrice: '$790',
        priceSuffix: '/ month',
        oneTimeSuffix: 'one-off',
        featured: true,
        badge: 'Most chosen',
        customPrice: false,
        features: [
          'Up to 500,000 rows / month',
          '10 target websites',
          'API access & signed webhooks',
          'Daily refresh schedule',
          'Anti-bot & proxy rotation included',
          'Priority Slack support, 4 hours',
        ],
        cta: 'Get Growth',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: 'For high volume, compliance and SLAs.',
        monthlyPrice: '$999',
        oneTimePrice: null,
        priceSuffix: '+ / month',
        oneTimeSuffix: '',
        featured: false,
        badge: '',
        customPrice: true,
        features: [
          'Unlimited rows (fair use)',
          'Unlimited target websites',
          'Dedicated account manager',
          'Real-time and custom schedules',
          '99.9% uptime SLA',
          'Custom schemas & compliance review',
        ],
        cta: 'Talk to sales',
      },
    ],
    comparison: {
      label: 'Full feature comparison',
      rows: [
        { feature: 'Rows per month', starter: '50K', growth: '500K', enterprise: 'Unlimited' },
        { feature: 'Target websites', starter: '2', growth: '10', enterprise: 'Unlimited' },
        { feature: 'JS-rendered sites', starter: true, growth: true, enterprise: true },
        { feature: 'Proxy rotation', starter: false, growth: true, enterprise: true },
        { feature: 'API & webhooks', starter: false, growth: true, enterprise: true },
        { feature: 'Custom schedules', starter: false, growth: true, enterprise: true },
        { feature: 'Uptime SLA', starter: false, growth: '99.5%', enterprise: '99.9%' },
        { feature: 'Dedicated manager', starter: false, growth: false, enterprise: true },
      ],
    },
    footnote:
      'Every plan includes schema validation, deduplication and a 7-day money-back guarantee on the first month. Annual billing saves 15%.',
  },

  compliance: {
    eyebrow: 'Compliance',
    title: 'Legal by design, documented by default',
    lead: 'Unstructured scraping creates legal exposure for the buyer, not just the seller. We build the controls in so the risk does not land on your desk.',
    points: [
      {
        icon: 'lock',
        title: 'Public sources only',
        body: 'We collect only data behind a publicly reachable URL. No credentialed areas, no paywalled content, no personal accounts.',
      },
      {
        icon: 'scale',
        title: 'robots.txt and ToS review',
        body: 'Each target is reviewed for crawl directives and terms before we touch it, and we will decline work that conflicts with either.',
      },
      {
        icon: 'shield',
        title: 'GDPR and CCPA aligned',
        body: 'PII minimisation, lawful-basis documentation, and data processing agreements available on request for EU and California data subjects.',
      },
      {
        icon: 'layers',
        title: 'Provenance ledger',
        body: 'Every delivered row carries its source URL and collection timestamp, so your team can evidence where each record came from.',
      },
      {
        icon: 'lock',
        title: 'Secure transit and storage',
        body: 'TLS in transit, encrypted at rest, access limited to the two engineers assigned to your pipeline. Access is logged.',
      },
      {
        icon: 'check',
        title: 'Right-to-erasure support',
        body: 'We honour deletion requests end to end, including removing records from historical deliveries within the agreed window.',
      },
    ],
    cta: 'Request the full compliance brief',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions enterprise buyers actually ask',
    lead: 'If your question is not here, ask it directly — we answer within one business day.',
    items: [
      {
        q: 'Is web scraping legal?',
        a: 'Scraping publicly available data is legal in most jurisdictions, including under the hiQ v. LinkedIn ruling in the US. What creates exposure is ignoring robots.txt directives, circumventing authentication, or harvesting personal data without a lawful basis. We screen every target against those three criteria before starting and decline work that fails them.',
      },
      {
        q: 'How do you handle GDPR requests?',
        a: 'We operate as a processor under a data processing agreement. That means documented lawful basis, PII minimisation at collection time, retention limits, and full support for access and erasure requests. If you need zero PII retention we can configure the pipeline that way.',
      },
      {
        q: 'What is the turnaround for a first delivery?',
        a: 'Median is 12 hours for a standard single-source extraction. Complex multi-source or JavaScript-rendered projects typically land in three to five days. You get a fixed date at the feasibility stage, and we report against it.',
      },
      {
        q: 'What do you deliver?',
        a: 'JSON, CSV, Parquet, or a direct push into your S3, BigQuery, Snowflake or Postgres. Delivery can be scheduled, event-driven via webhook, or both. Schema is agreed in writing before extraction begins.',
      },
      {
        q: 'How do you get past rate limits and bot detection?',
        a: 'Rotating residential proxies, per-target request pacing, fingerprint variation, and retry with exponential backoff. We tune per target rather than applying one global setting, because what works on one site triggers blocks on another.',
      },
      {
        q: 'What if the target site changes its layout?',
        a: 'Every pipeline runs a canary check against known-good output on a schedule. A layout change that breaks parsing raises an alert before you notice missing rows, and we ship a fix — typically the same day, inside the scope of the plan.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Seven days, no questions, on the first month. If the delivered data does not match the agreed schema or accuracy target, you get a full refund rather than a credit.',
      },
      {
        q: 'Do you sign NDAs and DPAs?',
        a: 'Yes. NDA before discovery, DPA before any personal data is processed. We can route both through your legal team with turnaround inside two business days.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Get started',
    title: 'Send us one URL. We will tell you what it costs.',
    lead: 'Most projects start with a feasibility read that costs you nothing. You get a fixed price, a delivery date, and an honest answer about whether scraping is the right solution at all.',
    primaryCta: 'Request a free sample',
    secondaryCta: 'Email us directly',
    note: 'No card required. No sales sequence. One email, one reply.',
  },

  form: {
    title: 'Tell us about your data',
    subtitle: 'Three short steps. We reply within one business day.',
    stepLabels: ['Your needs', 'Target sources', 'Contact'],
    step1: {
      heading: 'What do you need extracted?',
      help: 'Select everything that applies.',
      dataTypeLabel: 'Data type',
      dataTypes: [
        { id: 'products', label: 'Product catalogues' },
        { id: 'leads', label: 'Business leads' },
        { id: 'prices', label: 'Price monitoring' },
        { id: 'jobs', label: 'Job postings' },
        { id: 'reviews', label: 'Reviews & ratings' },
        { id: 'other', label: 'Something else' },
      ],
      volumeLabel: 'Rough volume per run',
      volumes: [
        'Up to 1,000 rows',
        '1,000 – 50,000',
        '50,000 – 500,000',
        '500,000+',
        'Not sure yet',
      ],
      frequencyLabel: 'How often',
      frequencies: ['One-time', 'Weekly', 'Daily', 'Hourly or realtime'],
      notesLabel: 'Anything we should know? (optional)',
      notesPlaceholder: 'Fields you need, formats, deadline…',
    },
    step2: {
      heading: 'Where should we pull it from?',
      help: 'One URL is enough to start.',
      urlLabel: 'Target URL',
      urlPlaceholder: 'https://example.com/catalogue',
      urlHint: 'If you have several, add them one per line.',
      urlExtraLabel: 'Additional URLs (optional)',
      antiBotLabel: 'Does the site block scrapers?',
      antiBotOptions: [
        { id: 'unknown', label: 'Not sure' },
        { id: 'yes', label: 'Yes, it blocks us' },
        { id: 'no', label: 'No, it is open' },
      ],
    },
    step3: {
      heading: 'How do we reach you?',
      nameLabel: 'Full name',
      namePlaceholder: 'Jane Cooper',
      emailLabel: 'Work email',
      emailPlaceholder: 'jane@company.com',
      companyLabel: 'Company',
      companyPlaceholder: 'Company name',
      budgetLabel: 'Budget range',
      budgets: ['Under $500', '$500 – $2,000', '$2,000 – $10,000', '$10,000+', 'Need a quote'],
      consentText:
        'I agree that ScrapeVerse may store this enquiry in order to respond. Read the privacy notice.',
      consentLink: 'Privacy notice',
    },
    errors: {
      dataType: 'Choose at least one data type.',
      volume: 'Choose an estimated volume so we can quote accurately.',
      frequency: 'Tell us how often you need this data.',
      antiBot: 'Choose an option so we know whether to run a block test.',
      url: 'Enter a valid URL, including https://.',
      email: 'Enter a valid work email address.',
      name: 'Enter your name.',
      consent: 'Please accept the privacy notice to continue.',
      generic: 'Something went wrong sending your request. Please try again.',
    },
    back: 'Back',
    next: 'Continue',
    submit: 'Send request',
    submitting: 'Sending…',
    successTitle: 'Request received.',
    successBody:
      'You will have a reply from an engineer — not a sales rep — within one business day. If it is urgent, email us directly.',
    successMeta: 'What happens next',
    successSteps: [
      'We review your targets and reply with a feasibility read.',
      'You get a fixed price and delivery date.',
      'If you approve, the first 1,000 rows are free.',
    ],
    startOver: 'Send another request',
  },

  stickyCta: {
    label: 'Get a free sample',
    hide: 'Hide',
  },

  footer: {
    blurb: 'Managed web scraping and data extraction for teams that need the data to be right.',
    servicesTitle: 'Services',
    services: [
      'Structured scraping',
      'JS-rendered sites',
      'Anti-bot resilience',
      'Data cleaning',
      'Scheduled monitoring',
    ],
    companyTitle: 'Company',
    company: ['How it works', 'Pricing', 'Compliance', 'FAQ', 'Blog'],
    legalTitle: 'Legal',
    legal: ['Privacy notice', 'Terms of service', 'Data processing', 'Cookie policy'],
    contactTitle: 'Contact',
    emailLabel: 'Email',
    responseLabel: 'Response time',
    responseValue: 'Within 1 business day',
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },

  legal: {
    lastUpdated: 'Last updated',
  },

  blog: {
    title: 'Insights',
    lead: 'Practical notes on scraping, data quality and compliance from the team running pipelines in production.',
    empty: 'No posts published yet.',
    readMore: 'Read article',
    readingTime: 'min read',
    published: 'Published',
    backToBlog: 'All insights',
  },

  notFound: {
    code: '404',
    title: 'This page returned no records',
    lead: 'The URL you followed does not exist, or it moved during a rebuild. The links below should get you back on track.',
    cta: 'Back to home',
    secondary: 'Read our insights',
  },
};

/**
 * Inferred from the object above, which is deliberately NOT declared
 * `as const`. A const assertion turns every array into a readonly tuple, and
 * TypeScript cannot strip readonly from a tuple through a mapped type — so any
 * attempt to derive a "widened" type from it fails on the first nested array.
 * Inferring normally gives mutable arrays and plain `string` fields, which is
 * exactly the contract `bd.ts` must satisfy.
 */
export type Dictionary = typeof en;
