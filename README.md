# Chewy Dog Food Finder Prototype

A polished React + TypeScript prototype for a Chewy Dog Food Finder and Recommendation Calculator. It guides a pet parent through a multi-step questionnaire, scores mocked dog food products, and presents ranked recommendations with veterinary safeguards, comparison, feeding estimates, Autoship signals, and transition guidance.

## Stable Prototype URL

After GitHub Actions finishes deploying Pages from `main`, the prototype is available at:

https://svalenza-chewy.github.io/DogFoodCalculator/

Confluence-ready roadmap copy page:

https://svalenza-chewy.github.io/DogFoodCalculator/confluence/chewy-dog-food-finder-18-month-cx-seo-roadmap.html

## Run Locally

```bash
pnpm install
pnpm dev
```

Then open the local URL printed by Vite.

## Verify

```bash
pnpm test
pnpm build
```

## What Is Included

- Multi-step dog profile, current diet, health, ingredient, priority, and veterinary guidance flow
- Local storage persistence for customer answers
- Mock data for 20 realistic dog food products across dry, wet, fresh, freeze-dried, puppy, adult, senior, sensitive, limited-ingredient, budget, premium, and veterinary diet options
- Recommendation engine with documented scoring assumptions, hard filters, soft preferences, and therapeutic diet safeguards
- Ranked recommendation cards with match scores, reasons, tradeoffs, score breakdowns, trust badges, price/value, rating, availability, product artwork placeholders, and commerce actions
- Side-by-side comparison for up to three products
- Feeding estimate, package duration, monthly/annual cost, and Autoship cadence
- Seven-day transition plan with sensitive-stomach extension
- Ask-a-vet summary modal and saved pet profile modules
- Unit tests for key recommendation rules
- An 18-month customer experience and SEO roadmap for the incoming product manager: [docs/18-month-cx-seo-roadmap.md](docs/18-month-cx-seo-roadmap.md)

## Assumptions And Limits

- All products, prices, availability, ratings, feeding guidance, veterinary labels, and veterinary claims are mocked prototype data.
- Match scores are recommendation aids, not medical ratings or guarantees.
- This tool does not diagnose conditions, treat disease, or replace advice from a veterinarian.
- Dogs with diagnosed medical conditions, suspected food allergies, ongoing symptoms, or prescription diet needs should have food selection reviewed by a veterinarian.
- "Veterinarian-informed" means the criteria are based on general nutritional principles and veterinary-reviewed suitability logic.
- "Reviewed by veterinary experts" is a mocked product-data signal for prototype purposes only.
- "Recommended by your veterinarian" is only represented when the customer enters guidance from their own veterinarian.

## Production Next Steps

- Replace mocked products with governed catalog, nutrition, price, inventory, and Autoship data.
- Define veterinary claim standards with Legal, Veterinary, Merchandising, SEO, Product, and UX.
- Validate formulas and feeding estimates with veterinary nutrition experts.
- Add authorization flows for therapeutic diets.
- Integrate Chewy Pet Profile, PDP, PLP, search, account, CRM, and Autoship experiences.
- Add analytics for funnel completion, recommendation confidence, comparison behavior, and post-purchase feedback.
