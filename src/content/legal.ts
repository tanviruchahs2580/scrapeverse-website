import type { Locale } from '~/i18n';

/**
 * Legal copy lives here rather than in Markdown files because it must exist in
 * both locales and must not be editable without touching the dictionary. Every
 * section carries `placeholder: true` until a qualified lawyer has signed it
 * off — the renderer prints a visible banner for those sections so an
 * unreviewed document can never be mistaken for final.
 */

export interface LegalSection {
  heading: string;
  body: string[];
  placeholder?: boolean;
}

export interface LegalDoc {
  slug: 'privacy' | 'terms' | 'data-processing' | 'cookies';
  title: string;
  description: string;
  sections: LegalSection[];
}

const updated = '2026-02-01';

export const LEGAL_DOCS: Record<Locale, Record<LegalDoc['slug'], LegalDoc>> = {
  en: {
    privacy: {
      slug: 'privacy',
      title: 'Privacy notice',
      description:
        'How ScrapeVerse collects, uses, stores and deletes personal data submitted through this website.',
      sections: [
        {
          heading: 'Who we are',
          body: [
            'ScrapeVerse ("we", "us") operates scrapeverse.com. We act as a data controller for the information you send us through the enquiry form, and as a data processor for the data our clients ask us to collect on their behalf.',
            'For any question about this notice, or to exercise a right described below, email privacy@scrapeverse.com.',
          ],
        },
        {
          heading: 'What we collect from you',
          body: [
            'When you submit the request form we collect the data you type in: your name, work email address, company name, budget range, the URLs you want scraped, the categories and volume of data you need, and anything you write in the free-text fields.',
            'We also record technical data needed to operate and protect the site: IP address, browser user agent, and the time the form was opened and submitted.',
          ],
        },
        {
          heading: 'Why we collect it',
          body: [
            'To answer your enquiry, prepare a feasibility assessment, and issue a quotation. That is our legitimate interest under GDPR Article 6(1)(f) and, where you opt in, consent under Article 6(1)(a).',
            'We do not sell personal data, and we do not use it for advertising.',
          ],
        },
        {
          heading: 'How long we keep it',
          body: [
            'Enquiries that do not become projects are deleted after 24 months. Enquiries that become projects are retained for the duration of the engagement and the following 7 years, because tax and accounting law requires us to keep business records.',
            'Server logs are deleted after 30 days.',
          ],
        },
        {
          heading: 'Who we share it with',
          body: [
            'Our email and hosting providers, who process it on our instructions under written agreements, and our professional advisers where the law requires disclosure.',
            'We do not sell or rent personal data to anyone.',
          ],
        },
        {
          heading: 'Your rights',
          body: [
            'Under the GDPR and CCPA you may ask us to give you a copy of your data, correct it, delete it, restrict how we use it, or object to our processing it. You can also ask for it in a portable format.',
            'Write to privacy@scrapeverse.com. We respond within 30 days. If you are not satisfied you can complain to your data protection authority.',
          ],
          placeholder: true,
        },
        {
          heading: 'Security',
          body: [
            'Data in transit is encrypted with TLS 1.3. Data at rest is encrypted with AES-256. Access is limited to the engineers working on your enquiry and every access is logged.',
          ],
          placeholder: true,
        },
        {
          heading: 'Changes',
          body: [
            `This notice was last updated on ${updated}. If we change it in a way that affects your rights we will email you before the change takes effect.`,
          ],
        },
      ],
    },

    terms: {
      slug: 'terms',
      title: 'Terms of service',
      description:
        'The terms that govern use of the ScrapeVerse website and the services we deliver.',
      sections: [
        {
          heading: 'Agreement to terms',
          body: [
            'By using this website you accept these terms. If you do not accept them, do not use the site.',
          ],
        },
        {
          heading: 'The service',
          body: [
            'We deliver managed web scraping and data extraction. The specific scope, volume, schema, schedule, and delivery method of any engagement are set out in a separate written statement of work signed by both parties.',
            'If a statement of work conflicts with these terms, the statement of work wins for that engagement.',
          ],
        },
        {
          heading: 'Acceptable use',
          body: [
            'We only collect data from publicly reachable pages. We will not work on anything that requires bypassing authentication, defeating a paywall, breaching a technical access control, or harvesting special-category personal data.',
            'We review every target against the crawl directives and terms of the site owner before starting, and we decline work that conflicts with them.',
          ],
        },
        {
          heading: 'Client responsibilities',
          body: [
            'You confirm you have the right to use the data we deliver for your stated purpose. We rely on that confirmation and cannot verify it for you.',
          ],
        },
        {
          heading: 'Fees and payment',
          body: [
            'Fees are as set out in the statement of work. Invoices are payable within 14 days unless agreed otherwise. Recurring plans are billed in advance.',
            'If a scope changes mid-engagement we quote the change before doing the work.',
          ],
        },
        {
          heading: 'Refunds',
          body: [
            'The first month of a recurring plan is refundable if the delivered data does not match the agreed schema. Tell us within 7 days of delivery.',
          ],
        },
        {
          heading: 'Liability',
          body: [
            'We provide the service with reasonable skill and care. We do not warrant that a target site will keep its current structure, and we do not warrant that any particular record exists.',
            'Our total liability in any 12-month period is limited to the fees you paid us in that period. Nothing in these terms limits liability for death or personal injury caused by negligence, or for fraud.',
          ],
          placeholder: true,
        },
        {
          heading: 'Termination',
          body: [
            'Either party may terminate an engagement for material breach that is not fixed within 30 days of written notice. On termination you pay for work completed to that date.',
          ],
          placeholder: true,
        },
        {
          heading: 'Governing law',
          body: [
            'These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction.',
          ],
          placeholder: true,
        },
      ],
    },

    'data-processing': {
      slug: 'data-processing',
      title: 'Data processing',
      description:
        'How ScrapeVerse processes personal data on behalf of clients, including sub-processors and cross-border transfers.',
      sections: [
        {
          heading: 'Role of the parties',
          body: [
            'Where we collect personal data for a client, the client is the controller and ScrapeVerse is the processor. The processing is governed by a data processing agreement executed before any collection begins.',
          ],
        },
        {
          heading: 'Scope of processing',
          body: [
            'Subject matter: collection of publicly available personal data for the fields set out in the statement of work. Duration: the term of the engagement. Purpose: to deliver the dataset the client ordered.',
          ],
        },
        {
          heading: 'Our obligations',
          body: [
            'Process only on documented instructions. Ensure every engineer is bound by confidentiality. Apply appropriate technical and organisational measures. Assist with data subject requests within 30 days. Make available the information needed to demonstrate compliance.',
          ],
        },
        {
          heading: 'Sub-processors',
          body: [
            'We use a small number of infrastructure providers: cloud hosting for compute, and an email provider for client communication. The current list is available on request and we give 30 days notice before adding a new one.',
          ],
          placeholder: true,
        },
        {
          heading: 'International transfers',
          body: [
            'Where personal data leaves the UK or EEA we rely on the UK International Data Transfer Addendum to the European Commission standard contractual clauses.',
          ],
          placeholder: true,
        },
        {
          heading: 'Deletion',
          body: [
            'On termination, or on your written request, we delete client data from production systems within 30 days and from backups within 90 days, and we confirm deletion in writing.',
          ],
        },
      ],
    },

    cookies: {
      slug: 'cookies',
      title: 'Cookie policy',
      description: 'Which cookies and local storage this website uses, and why.',
      sections: [
        {
          heading: 'What we use',
          body: [
            'This site sets no advertising or tracking cookies and runs no third-party analytics by default. It uses two things in your browser:',
            '1. A session-storage entry recording that you dismissed the announcement bar, so it does not reappear on every page during your visit.',
            '2. Aggregate page-view counts recorded on our own servers, with no cookie identifier attached, so we know which pages are read.',
          ],
        },
        {
          heading: 'What we do not use',
          body: [
            'No cross-site advertising cookies. No third-party marketing pixels. No cookie-based fingerprinting. No consent banner is needed because there is nothing to consent to.',
          ],
        },
        {
          heading: 'Managing storage',
          body: [
            'You can clear site data for this domain in your browser settings at any time. Doing so only resets the two items above.',
          ],
        },
        {
          heading: 'If this changes',
          body: [
            'If we introduce analytics that requires consent we will add a banner and update this page before it takes effect.',
          ],
        },
      ],
    },
  },

  bd: {
    privacy: {
      slug: 'privacy',
      title: 'গোপনীয়তা নীতি',
      description:
        'এই ওয়েবসাইটের মাধ্যমে জমা দেওয়া ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার, সংরক্ষণ ও মুছে ফেলা হয়।',
      sections: [
        {
          heading: 'আমরা কারা',
          body: [
            'ScrapeVerse ("আমরা") scrapeverse.com পরিচালনা করি। অনুরোধ ফর্মের মাধ্যমে আপনার যে তথ্য আসে তার ক্ষেত্রে আমরা ডেটা কন্ট্রোলার, আর ক্লায়েন্টের হয়ে সংগ্রহ করা ডেটার ক্ষেত্রে আমরা প্রসেসর।',
            'এই নীতি সম্পর্কে যেকোনো প্রশ্ন বা নীতিতে বর্ণিত অধিকার প্রয়োগ করতে privacy@scrapeverse.com ঠিকানায় লিখুন।',
          ],
        },
        {
          heading: 'আপনার কাছ থেকে আমরা যা সংগ্রহ করি',
          body: [
            'অনুরোধ ফর্ম জমা দিলে আপনার লেখা তথ্যই সংগ্রহ করি: নাম, ওয়ার্ক ইমেইল, কোম্পানির নাম, বাজেটের ধরন, স্ক্র্যাপ করা URL, প্রয়োজনীয় ডেটার ধরন ও আয়তন, এবং ফ্রি-টেক্সটে লেখা যা কিছু।',
            'সাইট চালানো ও সুরক্ষার জন্য প্রয়োজনীয় প্রযুক্তিগত তথ্যও নিই: IP ঠিকানা, ব্রাউজার ইউজার এজেন্ট, ফর্ম খোলা ও জমা দেওয়ার সময়।',
          ],
        },
        {
          heading: 'কেন সংগ্রহ করি',
          body: [
            'আপনার অনুরোধের উত্তর দিতে, সম্ভাব্যতা যাচাই করতে এবং দাম প্রস্তাব দিতে। এটি GDPR অনুচ্ছেদ 6(1)(f)-এর বৈধ স্বার্থ এবং আপনার সম্মতি দেওয়া হলে অনুচ্ছেদ 6(1)(a)।',
            'আমরা ব্যক্তিগত তথ্য বিক্রি করি না এবং বিজ্ঞাপনের জন্য ব্যবহার করি না।',
          ],
        },
        {
          heading: 'কতদিন রাখি',
          body: [
            'যেসব অনুরোধ প্রকল্পে পরিণত হয় না, সেগুলো ২৪ মাস পর মুছে ফেলা হয়। যেসব প্রকল্পে পরিণত হয়, সেগুলো চুক্তির সময়সীমা এবং তার পরের ৭ বছর রাখা হয়, কারণ কর ও হিসাবের আইনে ব্যবসায়িক রেকর্ড রাখতে হয়।',
            'সার্ভার লগ ৩০ দিন পর মুছে ফেলা হয়।',
          ],
        },
        {
          heading: 'যাদের সঙ্গে ভাগ করি',
          body: [
            'আমাদের ইমেইল ও হোস্টিং প্রদানকারী, যারা লিখিত চুক্তির অধীনে আমাদের নির্দেশে তথ্য প্রক্রিয়া করে, এবং আইনে প্রকাশ বাধ্যতামূলক হলে আমাদের পেশাদার পরামর্শক।',
            'আমরা কারও কাছে ব্যক্তিগত তথ্য বিক্রি বা ভাড়া দিই না।',
          ],
        },
        {
          heading: 'আপনার অধিকার',
          body: [
            'GDPR ও CCPA-র অধীনে আপনি আমাদের কাছে তথ্যের অনুলিপি চাইতে, সংশোধন, মুছে ফেলা, ব্যবহার সীমিত করা বা প্রক্রিয়াকরণে আপত্তি জানাতে পারেন। পোর্টেবল ফরম্যাটেও চাইতে পারেন।',
            'privacy@scrapeverse.com-এ লিখুন। আমরা ৩০ দিনের মধ্যে উত্তর দিই। সন্তুষ্ট না হলে আপনার তথ্য সুরক্ষা কর্তৃপক্ষের কাছে অভিযোগ জানাতে পারেন।',
          ],
          placeholder: true,
        },
        {
          heading: 'নিরাপত্তা',
          body: [
            'ট্রানজিটে TLS 1.3 দিয়ে এনক্রিপশন। স্টোরেজে AES-256 দিয়ে এনক্রিপশন। অ্যাক্সেস শুধু আপনার অনুরোধে কাজ করা প্রকৌশলীদের মধ্যে সীমাবদ্ধ এবং প্রতিটি অ্যাক্সেস লগ করা হয়।',
          ],
          placeholder: true,
        },
        {
          heading: 'পরিবর্তন',
          body: [
            `এই নীতি সর্বশেষ হালনাগাদ হয়েছে ${updated}। আপনার অধিকারকে প্রভাবিত করে এমন পরিবর্তন করলে কার্যকর হওয়ার আগেই আমরা ইমেইল করব।`,
          ],
        },
      ],
    },

    terms: {
      slug: 'terms',
      title: 'পরিষেবার শর্তাবলি',
      description: 'ScrapeVerse ওয়েবসাইট ব্যবহার এবং আমাদের দেওয়া পরিষেবার শর্তাবলি।',
      sections: [
        {
          heading: 'শর্তাবলিতে সম্মতি',
          body: [
            'এই ওয়েবসাইট ব্যবহার করলে আপনি এই শর্তাবলি মেনে নিচ্ছেন। মেনে না নিলে সাইটটি ব্যবহার করবেন না।',
          ],
        },
        {
          heading: 'পরিষেবা',
          body: [
            'আমরা পরিচালিত ওয়েব স্ক্র্যাপিং ও ডেটা এক্সট্রাকশন পরিষেবা দিই। নির্দিষ্ট কাজের পরিধি, আয়তন, স্কিমা, সময়সূচি ও ডেলিভারি পদ্ধতি দুই পক্ষের স্বাক্ষরিত আলাদা কাজের বিবরণীতে লেখা থাকে।',
            'কোনো কার্যকারিতার বিবরণী এই শর্তাবলির সঙ্গে সংঘর্ষ হলে সেই কাজের জন্য বিবরণী প্রাধান্য পাবে।',
          ],
        },
        {
          heading: 'গ্রহণযোগ্য ব্যবহার',
          body: [
            'আমরা কেবল সর্বজনীনভাবে উন্মুক্ত পাতা থেকে তথ্য সংগ্রহ করি। যেকোনো কাজ লগইন বাধা উত্তীর্ণ করা, পেমওয়াল ভাঙা, প্রযুক্তিগত অ্যাক্সেস নিয়ন্ত্রণ ভাঙা বা বিশেষ শ্রেণির ব্যক্তিগত তথ্য সংগ্রহের কাজ আমরা নেব না।',
            'শুরু করার আগে প্রতিটি লক্ষ্য ওয়েবসাইটের ক্রল নির্দেশনা ও শর্তাবলি আমরা যাচাই করি এবং তার সঙ্গে সংঘর্ষের কাজ প্রত্যাখ্যান করি।',
          ],
        },
        {
          heading: 'ক্লায়েন্টের দায়িত্ব',
          body: [
            'আপনি নিশ্চিত করছেন যে আমাদের দেওয়া ডেটা আপনার নির্ধারিত উদ্দেশ্যে ব্যবহারের অধিকার আপনার আছে। আমরা সেই নিশ্চয়তার ওপর নির্ভর করি এবং তা আপনার পক্ষে যাচাই করতে পারি না।',
          ],
        },
        {
          heading: 'মূল্য ও পরিশোধ',
          body: [
            'মূল্য কাজের বিবরণীতে উল্লেখিত। চুক্তি অন্যভাবে না হলে ইনভয়েস ১৪ দিনের মধ্যে পরিশোধযোগ্য। চলমান প্লানের ফি অগ্রিম পরিশোধে।',
            'কাজ চলাকালে পরিধি বদলালে কাজ করার আগেই পরিবর্তনের দাম জানানো হয়।',
          ],
        },
        {
          heading: 'ফেরত',
          body: [
            'ডেলিভারি করা ডেটা সম্মত স্কিমার সঙ্গে না মিললে চলমান প্লানের প্রথম মাসের ফি ফেরতযোগ্য। ডেলিভারির ৭ দিনের মধ্যে জানাতে হবে।',
          ],
        },
        {
          heading: 'দায়সীমা',
          body: [
            'আমরা যুক্তিসঙ্গত দক্ষতা ও যত্ন দিয়ে পরিষেবা দিই। লক্ষ্য সাইটের কাঠামো অপরিবর্তিত থাকবে বলে আমরা নিশ্চয়তা দিই না, এবং কোনো নির্দিষ্ট রেকর্ডের অস্তিত্ব নিশ্চিত করি না।',
            'যেকোনো ১২ মাসে আমাদের মোট দায়সীমা সেই সময়ে আপনার দেওয়া ফির সীমাবদ্ধ। মৃত্যু বা ব্যক্তিগত আঘাত, জালিয়াতি, বা আইনে দণ্ডনীয় কোনো কাজের ক্ষেত্রে এই সীমা প্রযোজ্য নয়।',
          ],
          placeholder: true,
        },
        {
          heading: 'বাতিল',
          body: [
            '৩০ দিনের লিখিত নোটিশের মধ্যে সারানো না হলে উপাদান লঙ্ঘনের ক্ষেত্রে যেকোনো পক্ষ কাজ বাতিল করতে পারে। বাতিলের সময় সেই তারিখ পর্যন্ত সম্পন্ন কাজের মূল্য দিতে হবে।',
          ],
          placeholder: true,
        },
        {
          heading: 'প্রযোজ্য আইন',
          body: [
            'এই শর্তাবলি ইংল্যান্ড ও ওয়েলসের আইনে পরিচালিত, এবং ইংল্যান্ড ও ওয়েলসের আদালতের একচেটিয়া এখতিয়ার আছে।',
          ],
          placeholder: true,
        },
      ],
    },

    'data-processing': {
      slug: 'data-processing',
      title: 'ডেটা প্রক্রিয়াকরণ',
      description:
        'ক্লায়েন্টের পক্ষে ব্যক্তিগত তথ্য প্রক্রিয়াকরণ, সাব-প্রসেসর ও আন্তর্জাতিক স্থানান্তরসহ।',
      sections: [
        {
          heading: 'পক্ষের ভূমিকা',
          body: [
            'ক্লায়েন্টের হয়ে ব্যক্তিগত তথ্য সংগ্রহের ক্ষেত্রে ক্লায়েন্ট কন্ট্রোলার এবং ScrapeVerse প্রসেসর। যেকোনো সংগ্রহ শুরুর আগে দুই পক্ষ কর্তৃক স্বাক্ষরিত ডেটা প্রক্রিয়াকরণ চুক্তি দ্বারা প্রক্রিয়া নিয়ন্ত্রিত হয়।',
          ],
        },
        {
          heading: 'প্রক্রিয়ার পরিধি',
          body: [
            'বিষয়বস্তু: কাজের বিবরণীতে উল্লেখিত ক্ষেত্রগুলোর জন্য সর্বজনীনভাবে উপলব্ধ ব্যক্তিগত তথ্য সংগ্রহ। সময়কাল: চুক্তির মেয়াদ। উদ্দেশ্য: ক্লায়েন্টের অর্ডার করা ডেটাসেট ডেলিভারি।',
          ],
        },
        {
          heading: 'আমাদের দায়িত্ব',
          body: [
            'শুধু লিখিত নির্দেশ অনুযায়ী প্রক্রিয়া করা। প্রতিটি প্রকৌশলীকে গোপনীয়তার বাধ্যবশতকে আবদ্ধ রাখা। যথাযথ প্রযুক্তিগত ও সাংগঠনিক ব্যবস্থা প্রয়োগ করা। ৩০ দিনের মধ্যে তথ্যব্যক্তির অনুরোধে সহায়তা করা।',
          ],
        },
        {
          heading: 'সাব-প্রসেসর',
          body: [
            'আমরা অল্প কিছু অবকাঠামো প্রদানকারী ব্যবহার করি: কম্পিউটের জন্য ক্লাউড হোস্টিং, এবং ক্লায়েন্ট যোগাযোগের জন্য ইমেইল প্রদানকারী। বর্তমান তালিকা অনুরোধে পাওয়া যায় এবং নতুন কোনো প্রদানকারী যোগ করার ৩০ দিন আগে নোটিশ দেওয়া হয়।',
          ],
          placeholder: true,
        },
        {
          heading: 'আন্তর্জাতিক স্থানান্তর',
          body: [
            'ব্যক্তিগত তথ্য যুক্তরাজ্য বা EEA ছাড়লে আমরা UK International Data Transfer Addendum-এর মাধ্যমে ইউরোপীয় কমিশনের আদর্শ শর্তাবলিতে সম্মতির ভিত্তিতে কাজ করি।',
          ],
          placeholder: true,
        },
        {
          heading: 'মুছে ফেলা',
          body: [
            'চুক্তির শেষে, অথবা আপনার লিখিত অনুরোধে, আমরা ৩০ দিনের মধ্যে প্রোডাকশন সিস্টেম থেকে ক্লায়েন্ট ডেটা এবং ৯০ দিনের মধ্যে ব্যাকআপ থেকে মুছে ফেলি এবং লিখিতভাবে মুছে ফেলার নিশ্চিত করি।',
          ],
        },
      ],
    },

    cookies: {
      slug: 'cookies',
      title: 'কুকি নীতি',
      description: 'এই ওয়েবসাইট কোন কুকি ও লোকাল স্টোরেজ ব্যবহার করে এবং কেন।',
      sections: [
        {
          heading: 'আমরা যা ব্যবহার করি',
          body: [
            'এই সাইট কোনো বিজ্ঞাপন বা ট্র্যাকিং কুকি সেট করে না এবং ডিফল্ট অবস্থায় কোনো তৃতীয় পক্ষের অ্যানালিটিক্স চালায় না। এটি আপনার ব্রাউজারে দুটি জিনিস ব্যবহার করে:',
            '১. একটি সেশন-স্টোরেজ এন্ট্রি, যা নোটিস করে আপনি ঘোষণা বার বন্ধ করেছেন, যাতে প্রতিটি পাতায় সেটি আবার না দেখায়।',
            '২. কোনো কুকি শনাক্তকারী ছাড়া আমাদের নিজস্ব সার্ভারে সংরক্ষিত সম্মিলিত পাতা দর্শনের সংখ্যা, যাতে আমরা জানতে পারি কোন পাতাগুলো পঠা হয়।',
          ],
        },
        {
          heading: 'আমরা যা ব্যবহার করি না',
          body: [
            'কোনো ক্রস-সাইট বিজ্ঞাপন কুকি নেই। কোনো তৃতীয় পক্ষের মার্কেটিং পিক্সেল নেই। কুকিভিত্তিক ফিঙ্গারপ্রিন্টিং নেই। সম্মতির ব্যানারের প্রয়োজন হয় না কারণ সম্মতির কিছু নেই।',
          ],
        },
        {
          heading: 'স্টোরেজ নিয়ন্ত্রণ',
          body: [
            'আপনি যেকোনো সময় ব্রাউজার সেটিংসে এই ডোমেইনের সাইট ডেটা মুছে দিতে পারেন। এতে উপরের দুটি বিষয়ই শুধু রিসেট হয়।',
          ],
        },
        {
          heading: 'এটি পরিবর্তিত হলে',
          body: [
            'আমরা যদি সম্মতির প্রয়োজন হয় এমন অ্যানালিটিক্স চালু করি, তাহলে কার্যকর হওয়ার আগেই একটি ব্যানার যোগ করব এবং এই পাতা হালনাগাদ করব।',
          ],
        },
      ],
    },
  },
};

export const LEGAL_UPDATED = updated;
