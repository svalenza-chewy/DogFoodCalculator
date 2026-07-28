# 18-Month Roadmap: Chewy Dog Food Finder CX + SEO

Prepared for the product manager starting Thursday, October 1, 2026.

Roadmap window: October 1, 2026 through March 31, 2028.

## Roadmap At A Glance

| Phase | Timing | Primary CX outcome | Primary SEO outcome |
| --- | --- | --- | --- |
| 1. Foundation and alpha | Oct 1-Dec 31, 2026 | Approved MVP requirements and usable internal alpha. | Indexability, IA, analytics, and technical SEO guardrails. |
| 2. MVP build and beta | Jan 1-Mar 31, 2027 | Beta-quality finder connected to shopping and support paths. | First crawlable content surfaces and structured data QA. |
| 3. Public MVP and learning loop | Apr 1-Jun 30, 2027 | Measured launch with feedback, transition, and Autoship signals. | First durable SEO cluster with Search Console measurement. |
| 4. Scale personalization and coverage | Jul 1-Sep 30, 2027 | Pet Profile and lifecycle-triggered recalculation. | Expanded content clusters without thin programmatic pages. |
| 5. Optimization and integration | Oct 1-Dec 31, 2027 | Recommendations surface across PDP, PLP, account, and CRM. | Metadata, linking, Merchant Center, and content refresh optimization. |
| 6. Maturity and new growth | Jan 1-Mar 31, 2028 | Durable dog nutrition decision-support platform. | Defensible organic growth model and adjacent expansion plan. |

## Product Vision

Make Chewy the most trusted place for a pet parent to choose dog food by combining a warm guided experience, transparent recommendation logic, veterinary safeguards, and search-visible educational pathways that help customers before, during, and after purchase.

The product should not become a diagnosis engine. It should become a confidence engine: help customers understand their dog's needs, narrow the overwhelming dog food aisle, know when veterinary review is needed, and move into purchase, Autoship, Pet Profile, or vet support with less uncertainty.

## PM Charter

The PM owns the bridge between customer experience and organic discovery.

Key responsibilities:

- Convert the prototype into a governed production product strategy.
- Define the search entry points that deserve indexable experiences.
- Protect medical and veterinary claims with Legal, Veterinary, UX, SEO, Merchandising, and CX partners.
- Make product recommendations explainable enough for pet parents and auditable enough for internal teams.
- Tie recommendation outcomes to commerce, retention, Pet Profile, and content performance.

## SEO Principles Used

These are the external guardrails checked on July 27, 2026:

- Google frames SEO as helping search engines understand content and helping users decide whether to visit, while emphasizing useful, people-first content and realistic expectations for impact timing: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- Core Web Vitals should be treated as both UX and Search quality work, with target thresholds of LCP under 2.5s, INP under 200ms, and CLS under 0.1: [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals).
- Product structured data can help search results show price, availability, ratings, shipping, and related product information; merchant listings are relevant when customers can buy from the page: [Google Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product).
- Ecommerce navigation should expose crawlable links from categories to subcategories to product pages; Googlebot generally will not submit internal search forms to discover products: [Google ecommerce site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure).
- Faceted navigation needs explicit crawl control because filter combinations can create crawl waste and slow discovery of important pages: [Google faceted navigation guidance](https://developers.google.com/crawling/docs/faceted-navigation).
- AI-assisted content must remain original, helpful, reliable, people-first, and not created primarily to manipulate rankings: [Google AI-generated content guidance](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content).

## Strategic Bets

1. **Guided recommendation flow**
   Build a production-grade questionnaire that explains nutritional fit, preference fit, tradeoffs, and veterinary safeguards without overwhelming customers.

2. **Indexable education ecosystem**
   Create search-visible experiences for durable needs such as puppy food, senior dog food, sensitive stomach, large breed puppy food, weight management, limited ingredient, grain-inclusive vs grain-free, transition plans, and feeding calculators.

3. **Recommendation transparency**
   Treat scoring as a product feature: expose reasons, tradeoffs, confidence, hard filters, veterinary authorization, and data freshness.

4. **Commerce and retention integration**
   Connect results to PDP, PLP, Pet Profile, Autoship, post-purchase feedback, reorder behavior, and food transition tracking.

5. **Governed veterinary trust**
   Use precise labels only: veterinarian-informed, reviewed by veterinary experts, veterinarian-recommended claim, or recommended by your veterinarian.

## North Star And KPI Tree

North Star:

- Percentage of dog food finder users who confidently select an appropriate next step: product view, add to cart, start Autoship, save profile, ask a vet, or share with a veterinarian.

Customer experience KPIs:

- Questionnaire start rate and completion rate
- Drop-off by step
- Recommendation confidence score
- Result-card expansion rate
- Compare usage
- Ask-a-vet handoff rate
- Add-to-cart rate from recommendations
- Autoship start rate
- Saved Pet Profile rate
- Transition-plan engagement
- Post-purchase food feedback completion
- Return, cancellation, and Autoship skip signals

SEO KPIs:

- Organic entrances to dog food finder and supporting pages
- Non-brand dog food query impressions and clicks
- Search Console CTR for priority page templates
- Indexed canonical page count by template
- Product structured data valid item rate
- Merchant listing and product snippet impressions
- Crawl stats for finder, education, PLP, PDP, and faceted URLs
- Core Web Vitals pass rate on mobile and desktop
- Assisted revenue from organic finder sessions
- Internal-link depth from education pages to PLP/PDP/finder

Quality and safety KPIs:

- Veterinary/Legal claim approval rate
- Number of recommendation explanations with complete reasons and tradeoffs
- Product data freshness SLA adherence
- Therapeutic diet authorization handoff completion
- Incidents from unsupported health or treatment claims

## Architecture Positioning

Indexable:

- Dog food finder landing page
- Educational hubs and guides
- Search-intent pages with stable editorial value
- Selected category-style landing pages where inventory and content warrant a canonical URL
- PDPs and PLPs with governed structured data

Usually noindex or non-indexed:

- Personalized calculator result pages using private pet data
- Arbitrary generated result combinations
- Thin filter combinations
- Internal saved profile views
- Any experience that exposes health details or is not useful outside the current customer context

The PM should require a clear policy for which recommendation outputs become public SEO pages. Most personalized outputs should power the customer journey, not become indexable pages.

## First Week: October 1-7, 2026

Goal: give the new PM enough context to make good calls without drowning them.

Day 1:

- Walk the PM through the prototype flow, recommendation logic, data model, veterinary safeguards, and README assumptions.
- Review the Chewy design guidance in `DESIGN.md`.
- Align on the difference between prototype trust signals and production-approved claims.

Day 2:

- Review business goals with Product, SEO, Merchandising, Veterinary, Legal, Retention, and Analytics.
- Confirm target customer segments: new dog parents, puppy parents, sensitive-stomach shoppers, allergy/sensitivity shoppers, weight-management shoppers, senior dog parents, and Autoship switchers.

Day 3:

- Map search demand and page types: informational guides, calculators, product/category pages, comparison pages, and shopping-intent landing pages.
- Identify pages that must be crawlable links rather than app-only states.

Day 4:

- Define MVP data dependencies: catalog, nutrition, ingredients, price, availability, reviews, package sizes, Autoship, veterinary authorization, product restrictions, and Pet Profile.
- Draft the recommendation explainability spec.

Day 5:

- Publish a 30/60/90-day working plan.
- Schedule claim governance review.
- Confirm analytics event taxonomy and SEO measurement baseline.

## 30/60/90-Day Plan

### First 30 Days: October 1-October 31, 2026

Primary outcome: establish foundations and decision rights.

Customer experience:

- Validate the prototype with 8-12 pet parents across at least four segments.
- Identify step-level comprehension issues, especially health concerns, allergies, dietary preferences, and vet guidance.
- Define the production questionnaire MVP and what can be deferred.
- Draft result-card requirements: score, reasons, tradeoffs, cost/day, rating, availability, trust signal, and next actions.
- Define fallback experiences for no match, out of stock, prescription required, and conflicting preferences.

SEO:

- Build keyword and intent map for dog food finder, dog food calculator, puppy food calculator, sensitive stomach dog food, senior dog food, limited ingredient dog food, grain-free questions, feeding amount, and transition plan.
- Decide indexability rules for finder landing, guide pages, result pages, PLP/PDP integration, and generated pages.
- Define URL patterns, canonical strategy, metadata patterns, and internal linking model.
- Establish Core Web Vitals targets and testing plan.

Governance:

- Create veterinary claim taxonomy and approval workflow.
- Define source-of-truth requirements for product nutrition and veterinary diet flags.
- Create a content review calendar for medically adjacent pages.

Deliverables:

- MVP PRD outline
- SEO information architecture map
- Recommendation scoring requirements v1
- Veterinary claim standards v1
- Analytics event taxonomy v1
- Prototype usability readout

### First 60 Days: November 1-November 30, 2026

Primary outcome: move from prototype to buildable MVP.

Customer experience:

- Complete production UX flows for questionnaire, results, comparison, Ask a Vet, therapeutic diet notice, and saved profile.
- Define what "confidence" means in the UI and how to measure it.
- Specify post-purchase feedback loop and transition tracking.
- Run moderated tests on the results page and score breakdown.

SEO:

- Draft content briefs for the first 20 indexable education pages.
- Define structured data requirements for PDP and product-led surfaces.
- Create internal-linking rules from guide pages to finder, PLP, PDP, and vet support.
- Confirm faceted navigation handling for ingredient, protein, life stage, size, format, health-support, and price filters.

Governance:

- Set up review workflows for Veterinary, Legal, SEO, UX Writing, and Merchandising.
- Define data-quality checks for ingredients, calories, claims, authorization, availability, and product status.

Deliverables:

- MVP product requirements complete
- Content model and page-template requirements
- SEO technical requirements
- Experiment backlog
- Data contract draft

### First 90 Days: December 1-December 31, 2026

Primary outcome: build alpha and prove the joint CX/SEO model.

Customer experience:

- Launch internal alpha with governed mock or sandbox catalog data.
- Validate questionnaire completion, recommendation explanations, and therapeutic diet safeguards.
- Instrument all major events.
- Begin Pet Profile and Autoship integration design.

SEO:

- Build alpha page templates for finder landing, education hub, guide article, comparison page, and calculator support page.
- Validate crawlability, metadata, canonical tags, and structured data in test environments.
- Build Search Console and analytics dashboard plan.

Governance:

- Run first claim review cycle.
- Finalize source freshness SLAs and content approval states.

Deliverables:

- Alpha release
- Search-intent content brief set v1
- Technical SEO QA checklist
- Measurement dashboard v1
- Go/no-go criteria for beta

## 18-Month Roadmap

### Phase 1: Foundation And Alpha

Timing: October 1-December 31, 2026.

Customer experience goals:

- Convert prototype into approved MVP requirements.
- Prove that pet parents understand the flow and trust the result page.
- Keep health and allergy language careful, useful, and non-diagnostic.

SEO goals:

- Define the indexable ecosystem before engineering builds the wrong page model.
- Map informational, commercial, and support intent.
- Establish the technical SEO guardrails for crawlability, performance, structured data, canonicalization, and noindex rules.

Major initiatives:

- Production questionnaire spec
- Recommendation transparency spec
- Veterinary claim and therapeutic diet policy
- SEO IA and content model
- Analytics and Search Console measurement plan
- Alpha build with governed data assumptions

Exit criteria:

- PM can explain what is indexable, what is not, and why.
- Veterinary/Legal have approved claim taxonomy.
- Engineering has buildable data contracts.
- SEO has approved page-template and internal-linking strategy.

### Phase 2: MVP Build And Beta

Timing: January 1-March 31, 2027.

Customer experience goals:

- Ship beta-quality finder experience behind controlled traffic.
- Connect recommendations to PDP, PLP, cart, Autoship, Ask a Vet, and Pet Profile save points.
- Create usable fallback flows for hard cases.

SEO goals:

- Launch the first crawlable content surfaces in staging or limited production.
- Implement structured data requirements where product purchase is possible.
- Ensure app experience does not hide important content from crawlers.

Major initiatives:

- MVP questionnaire and results build
- Catalog and nutrition data integration
- Recommendation scoring service or client/server hybrid
- Result-card explainability and score breakdown
- Ask-a-vet summary handoff
- Product comparison experience
- Finder landing page and education hub
- First 20 SEO support pages
- Structured data QA for product surfaces
- Core Web Vitals budget in CI

Exit criteria:

- Beta customers can complete the finder and reach an appropriate next step.
- Organic landing pages have crawlable links, metadata, content, and approved claims.
- PDP/PLP handoff is tracked.
- Product data freshness checks catch stale price, availability, or authorization status.

### Phase 3: Public MVP And Learning Loop

Timing: April 1-June 30, 2027.

Customer experience goals:

- Launch public MVP to a measured segment.
- Learn which customer needs produce confidence, conversion, and repeat purchase.
- Close the loop from recommendations to post-purchase feedback.

SEO goals:

- Publish the first durable SEO page cluster and measure query coverage.
- Build internal links from education content to finder and product pathways.
- Monitor indexation, crawl behavior, rich result eligibility, and page experience.

Major initiatives:

- Public MVP release
- Finder entry points from PLP, PDP, Pet Profile, and account
- Feedback loop: appetite, stool quality, skin/coat, energy, vet approval, repurchase
- Saved recommendation and food start date
- Autoship cadence recommendation
- First 40-60 SEO pages across priority clusters
- Schema validation workflow
- Search Console and analytics dashboard launch
- Faceted URL crawl-control implementation

Exit criteria:

- MVP meets minimum completion and confidence thresholds.
- Organic page cluster is indexed and reporting query/impression data.
- SEO and CX dashboards are reviewed weekly.
- Post-purchase feedback is connected to future recommendation improvements without implying medical effectiveness.

### Phase 4: Scale Personalization And Organic Coverage

Timing: July 1-September 30, 2027.

Customer experience goals:

- Expand personalization using Pet Profile, purchase history, product availability, and customer feedback.
- Improve repeat-use reasons: puppy growth, weight changes, senior transition, skipped Autoship, unavailable products.

SEO goals:

- Expand high-quality content clusters and improve internal linking.
- Build templates that support both customer education and shopping decisions without creating thin or duplicate pages.

Major initiatives:

- Pet Profile saved preferences
- Recalculation triggers for age, weight, health concern, inventory, and Autoship behavior
- Multi-dog household exploration
- Similar-to-current-food and completely-different-food modes
- Production content governance workflow
- Second wave of SEO pages: ingredient philosophy, breed-size needs, format comparisons, life-stage calculators
- Product image and alt-text standards
- Core Web Vitals remediation on heavy templates
- Query-to-page gap analysis

Exit criteria:

- Customers can save and revisit the finder as their dog's needs change.
- Organic traffic begins contributing assisted revenue and product discovery.
- SEO templates maintain quality and avoid programmatic thin content.

### Phase 5: Optimization And Cross-Surface Integration

Timing: October 1-December 31, 2027.

Customer experience goals:

- Make recommendations show up where customers naturally shop: search, PLP, PDP, Pet Profile, account, Autoship, CRM, and service workflows.
- Improve result trust and actionability based on customer and vet-support signals.

SEO goals:

- Use Search Console and internal search data to tune page clusters, titles, descriptions, linking, and content refresh.
- Expand structured data and Merchant Center alignment where applicable.

Major initiatives:

- Finder modules on PDP and PLP
- Personalized recommendations inside Pet Profile
- Autoship save and recovery flows
- Ask-a-vet handoff improvements
- Content refresh and pruning process
- Organic CTR testing for metadata and titles
- Merchant listing and product structured data monitoring
- Review and rating data governance
- Internal-link automation rules with SEO review

Exit criteria:

- Cross-surface recommendation modules lift confidence or conversion without increasing support risk.
- SEO reporting can distinguish guide traffic, finder traffic, PDP assists, and revenue contribution.
- Content refresh process is operating on a scheduled cadence.

### Phase 6: Maturity, Defensibility, And New Growth

Timing: January 1-March 31, 2028.

Customer experience goals:

- Mature the finder into a durable product platform for dog nutrition decision support.
- Use longitudinal feedback and lifecycle triggers to improve recommendations responsibly.

SEO goals:

- Defend and grow organic visibility through quality, freshness, technical performance, and better page intent matching.
- Decide whether to expand into adjacent experiences such as cat food finder, prescription diet education, breed-specific hubs, or condition-aware vet-support journeys.

Major initiatives:

- Recommendation model governance review
- Vet-reviewed education library expansion
- Lifecycle recommendation triggers
- Incrementality testing for SEO content and finder entry points
- Advanced dashboards combining Search Console, conversion, retention, and support outcomes
- Roadmap for adjacent pet nutrition finders
- Content consolidation, redirects, and canonical cleanup
- Annual veterinary and legal claim audit

Exit criteria:

- Roadmap is ready for year-two expansion.
- Product has a defensible measurement system across CX, SEO, commerce, retention, and safety.
- Stakeholders agree on scale paths and what should not be automated.

## Workstream Backlog

### Customer Experience

- Shorten questionnaire without losing high-signal inputs.
- Add "I do not know" paths for breed, current food, adult weight, feeding amount, and vet guidance.
- Add confidence nudges when customers choose conflicting preferences.
- Improve recommendation explanations with customer language, not nutrition jargon.
- Allow customers to compare up to three products and preserve comparison state.
- Add transition plan customization for sensitive stomachs.
- Add feeding amount override when customer has product-label or veterinarian guidance.
- Add multi-dog household logic.
- Add current-food similarity and complete-switch modes.
- Connect saved recommendations to Pet Profile.

### SEO And Content

- Finder landing page
- Dog food calculator hub
- Puppy food calculator page
- Senior dog food guide
- Large breed puppy food guide
- Sensitive stomach dog food guide
- Food allergy vs food sensitivity explainer
- Grain-inclusive vs grain-free explainer
- Limited ingredient dog food guide
- Dog food transition plan page
- Cost per day and feeding amount calculator support page
- Breed-size nutrition hub
- Food format comparison pages
- Vet-reviewed educational glossary
- Internal linking from guide pages to finder, PLP, PDP, and Ask a Vet

### Technical SEO

- Server-render or pre-render indexable pages.
- Use crawlable `<a href>` links for indexable navigation.
- Keep personalized results out of index unless explicitly approved.
- Define canonical rules for any generated pages.
- Use sitemap coverage for approved indexable pages.
- Apply Product structured data on product-purchase pages where data is complete and compliant.
- Monitor schema errors and warnings.
- Control faceted URLs to avoid crawl waste.
- Maintain Core Web Vitals budgets.

### Data And Recommendation Governance

- Product nutrition source of truth
- Ingredient normalization and allergen/sensitivity mapping
- Life-stage and breed-size suitability rules
- Therapeutic diet and authorization flags
- Veterinary review status taxonomy
- Product availability and replacement rules
- Price, package duration, and cost-per-day calculations
- Model versioning and score audit logs
- Human review workflow for scoring changes

## Decision Log To Create

The PM should start a decision log in week one and track:

- Which pages are indexable
- Which result pages are noindex
- Which claims require Veterinary/Legal approval
- Which product attributes are hard filters vs soft preferences
- Which metrics define recommendation success
- Which data source owns each product attribute
- Which content templates can scale and which require manual editorial review
- Which SEO pages should be consolidated, redirected, or pruned

## Key Risks

- Overpromising veterinary authority or implying treatment.
- Creating thin programmatic SEO pages from every result combination.
- Letting price, rating, or Autoship factors override health and nutritional suitability.
- Allowing faceted URLs to create crawl waste.
- Relying on client-only rendering for content intended to rank.
- Publishing AI-assisted content without expert review, source clarity, or customer value.
- Measuring only conversion while ignoring confidence, safety, retention, and support outcomes.

## Next 10 PM Actions

1. Schedule stakeholder kickoff for the first onboarding week starting October 1, 2026.
2. Open claim taxonomy review with Veterinary and Legal.
3. Approve SEO indexability policy for landing, guide, result, PLP, and PDP pages.
4. Convert prototype into PRD and analytics requirements.
5. Request catalog/nutrition/data-source inventory.
6. Build first keyword and intent map.
7. Define MVP page templates and internal-linking rules.
8. Run pet-parent usability sessions.
9. Stand up weekly CX/SEO dashboard review.
10. Publish first 90-day plan by Wednesday, October 7, 2026.
