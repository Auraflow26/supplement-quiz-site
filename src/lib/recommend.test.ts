import { describe, expect, it } from "vitest";
import { recommend } from "./recommend";
import { isComplete, type Answers } from "./quiz";
import { priceCents } from "./pricing";

const jchest: Answers = {
  goals: ["recovery", "energy"],
  lifeStage: "none",
  ageRange: "25-34",
  workouts: "5+",
  energy: "sometimes",
  stress: "medium",
  sleep: "7-8",
  stomach: "often",
  routine: "coffee",
  currentSupplements: ["protein", "creatine"],
  form: "creamer",
  flavor: "vanilla",
};

const bobby: Answers = {
  goals: ["calm", "energy"],
  lifeStage: "none",
  ageRange: "25-34",
  workouts: "0",
  energy: "crash",
  stress: "high",
  sleep: "<6",
  stomach: "never",
  routine: "coffee",
  currentSupplements: ["none"],
  form: "recommend",
  flavor: "hazelnut",
};

const anna: Answers = {
  goals: ["postnatal", "energy"],
  lifeStage: "breastfeeding",
  ageRange: "25-34",
  workouts: "1-2",
  energy: "crash",
  stress: "medium",
  sleep: "<6",
  stomach: "sometimes",
  routine: "tea",
  currentSupplements: ["none"],
  form: "recommend",
  flavor: "caramel",
};

const ids = (a: Answers) => recommend(a).packs.map((p) => p.id);

describe("recommend", () => {
  it("fixtures are complete answer sets", () => {
    for (const a of [jchest, bobby, anna]) expect(isComplete(a)).toBe(true);
  });

  it("JChest: gut first (stomach issues), then recovery and energy; skips creatine he already takes", () => {
    const blend = recommend(jchest);
    expect(blend.product).toBe("creamer");
    expect(ids(jchest)).toEqual(["gut", "recovery", "energy"]);
    const recovery = blend.packs.find((p) => p.id === "recovery")!;
    expect(recovery.skipped).toEqual(["Creatine monohydrate"]);
    expect(recovery.ingredients.map((i) => i.name)).not.toContain("Creatine monohydrate");
  });

  it("Bobby: coffee drinker gets creamer; poor sleep folds into Calm", () => {
    const blend = recommend(bobby);
    expect(blend.product).toBe("creamer");
    expect(ids(bobby)).toEqual(["calm", "energy"]);
    expect(blend.packs[0].reasons.some((r) => r.includes("sleep"))).toBe(true);
  });

  it("Anna: postnatal first, only pregnancy-safe packs, gentle iron, doctor note", () => {
    const blend = recommend(anna);
    expect(ids(anna)).toEqual(["postnatal", "energy"]);
    expect(ids(anna)).not.toContain("calm");
    const iron = blend.packs[0].ingredients[0];
    expect(iron.name).toContain("gentle");
    expect(blend.notes.some((n) => n.includes("doctor"))).toBe(true);
  });

  it("never returns more than 3 packs", () => {
    const busy: Answers = { ...bobby, goals: ["calm", "energy", "recovery"], workouts: "5+", stomach: "often" };
    expect(recommend(busy).packs.length).toBeLessThanOrEqual(3);
  });

  it("non coffee/tea drinker who asks us to pick gets drops, and sleep stays available", () => {
    const a: Answers = { ...bobby, routine: "neither", flavor: "vanilla" };
    const blend = recommend(a);
    expect(blend.product).toBe("drops");
    expect(blend.flavor).toBe("citrus");
    expect(ids(a)).toContain("sleep");
  });

  it("a single goal with no other signals still produces that pack", () => {
    const a: Answers = {
      ...bobby,
      goals: ["gut"],
      stomach: "never",
      energy: "steady",
      stress: "low",
      sleep: "8+",
    };
    expect(ids(a)).toEqual(["gut"]);
  });

  it("is deterministic", () => {
    expect(recommend(anna)).toEqual(recommend(anna));
  });
});

describe("pricing", () => {
  it("subscription is 15% off", () => {
    expect(priceCents("creamer", "one-time")).toBe(5900);
    expect(priceCents("creamer", "subscription")).toBe(5015);
    expect(priceCents("drops", "subscription")).toBe(3825);
  });
});
