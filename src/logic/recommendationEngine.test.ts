import { describe, expect, it } from "vitest";
import { defaultAnswers } from "../data/defaultAnswers";
import { products } from "../data/products";
import { calculateFeedingEstimate, getRecommendations, scoreProduct } from "./recommendationEngine";

describe("recommendation engine", () => {
  it("prioritizes therapeutic options when a veterinarian-diagnosed kidney condition is selected", () => {
    const result = getRecommendations({
      ...defaultAnswers,
      health: {
        observed: [],
        diagnosed: ["kidney"],
        preferences: []
      },
      ingredients: {
        ...defaultAnswers.ingredients,
        avoidIngredients: []
      }
    });

    expect(result.requiresTherapeuticDiet).toBe(true);
    expect(result.therapeuticConcerns).toContain("kidney");
    expect(result.recommendations[0].product.vetAuthorizationRequired).toBe(true);
    expect(result.recommendations[0].product.therapeuticCategories).toContain("kidney");
  });

  it("treats selected avoided ingredients as hard filters for suspected allergy scenarios", () => {
    const result = getRecommendations({
      ...defaultAnswers,
      health: {
        observed: ["suspected-allergy"],
        diagnosed: [],
        preferences: []
      },
      ingredients: {
        ...defaultAnswers.ingredients,
        avoidIngredients: ["Chicken"]
      }
    });

    expect(result.recommendations.every((recommendation) => !recommendation.product.ingredientsToFlag.includes("Chicken"))).toBe(true);
  });

  it("boosts products that align with veterinarian-entered protein guidance", () => {
    const salmonProduct = products.find((product) => product.id === "pp-sensitive-salmon");
    const chickenProduct = products.find((product) => product.id === "blue-life-chicken");

    expect(salmonProduct).toBeDefined();
    expect(chickenProduct).toBeDefined();

    const salmonScore = scoreProduct(salmonProduct!, defaultAnswers);
    const chickenScore = scoreProduct(chickenProduct!, defaultAnswers);

    expect(salmonScore.score.veterinaryGuidance).toBeGreaterThan(chickenScore.score.veterinaryGuidance);
  });

  it("calculates a positive feeding and cost estimate", () => {
    const product = products.find((item) => item.id === "american-journey-salmon");

    expect(product).toBeDefined();

    const estimate = calculateFeedingEstimate(product!, defaultAnswers);

    expect(estimate.dailyCalories).toBeGreaterThan(0);
    expect(estimate.dailyAmount).toBeGreaterThan(0);
    expect(estimate.monthlyCost).toBeGreaterThan(0);
    expect(estimate.autoshipCadenceWeeks).toBeGreaterThan(0);
  });
});
