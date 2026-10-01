import { expect, test } from "@playwright/test";

// Bobby McBob persona: stressed, coffee drinker, lets us pick the form.
const BOBBY: [question: RegExp, answers: string[]][] = [
  [/feel more of/, ["Calm & focus", "Energy"]],
  [/true for you right now/, ["None of these"]],
  [/How old/, ["25–34"]],
  [/work out/, ["Rarely"]],
  [/energy in the afternoon/, ["I crash almost every day"]],
  [/stressed/, ["Very stressed"]],
  [/sleep/, ["Less than 6 hours"]],
  [/upset your stomach/, ["Never"]],
  [/in your mug/, ["Coffee"]],
  [/Already taking/, ["None"]],
  [/How do you want to take it/, ["Pick for me"]],
  [/flavor/, ["Toasted hazelnut"]],
];

test("sign up → quiz → blend → demo checkout → order → staff", async ({ page }) => {
  const email = `e2e+${Date.now()}@example.com`;

  await page.goto("/");
  await page.getByRole("link", { name: /Take the 2-min quiz/ }).first().click();
  await expect(page).toHaveURL(/\/signup\?next=%2Fquiz/);

  // Validation: empty form and weak password.
  await page.getByRole("button", { name: /Create account/ }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await page.getByLabel("Name").fill("Bobby");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("short");
  await page.getByRole("button", { name: /Create account/ }).click();
  await expect(page.getByText("Use at least 10 characters.")).toBeVisible();
  await page.getByLabel("Password").fill("Supplemeant2026");
  await page.getByRole("button", { name: /Create account/ }).click();

  await expect(page).toHaveURL(/\/quiz$/);
  for (const [title, answers] of BOBBY) {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    const multi = await page.getByRole("group", { name: title }).isVisible();
    for (const a of answers) await page.getByRole(multi ? "checkbox" : "radio", { name: new RegExp(`^${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) }).click();
    // Single-choice questions auto-advance; multi-choice and the last question need a button.
    const last = title.source === "flavor";
    if (multi) await page.getByRole("button", { name: "Next →" }).click();
    if (last) await page.getByRole("button", { name: "See my blend →" }).click();
  }

  await expect(page).toHaveURL(/\/blend$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Custom Coffee Creamer");
  await expect(page.getByText("Calm pack")).toBeVisible();
  await expect(page.getByText("Energy pack")).toBeVisible();
  await expect(page.getByText("Your energy crashes most afternoons.")).toBeVisible();

  await page.getByRole("radio", { name: /One-time/ }).click();
  await page.getByRole("link", { name: "Continue to checkout" }).click();
  await expect(page).toHaveURL(/\/checkout\?plan=one-time/);
  await expect(page.getByText("Demo store: no payment is taken.")).toBeVisible();

  // Missing address fields show errors.
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page.getByText("Enter your street address.")).toBeVisible();

  await page.getByLabel("Street address").fill("1 Wall St");
  await page.getByLabel("City").fill("New York");
  await page.getByLabel("State").fill("NY");
  await page.getByLabel("ZIP").fill("10005");
  await page.getByRole("button", { name: "Place demo order" }).click();

  await expect(page).toHaveURL(/\/order\/[0-9a-f-]{36}$/);
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  await expect(page.getByText("$59.00")).toBeVisible();

  await page.goto("/account");
  await expect(page.getByText(/Hi, Bobby/)).toBeVisible();
  await expect(page.getByText("One-time")).toBeVisible();

  await page.goto("/staff");
  await expect(page.getByRole("heading", { name: "Mixing queue" })).toBeVisible();
  await expect(page.getByText("Bobby").first()).toBeVisible();
});

test("quiz resumes where you left off", async ({ page }) => {
  const email = `e2e+resume${Date.now()}@example.com`;
  await page.goto("/signup?next=/quiz");
  await page.getByLabel("Name").fill("Anna");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Supplemeant2026");
  await page.getByRole("button", { name: /Create account/ }).click();

  await page.getByRole("checkbox", { name: /Postpartum recovery/ }).click();
  await page.getByRole("button", { name: "Next →" }).click();
  await page.getByRole("radio", { name: "Breastfeeding", exact: true }).click();
  await expect(page.getByText("Question 3 of 12")).toBeVisible();
  await page.waitForTimeout(1000); // let autosave finish

  await page.goto("/");
  await page.goto("/quiz");
  await expect(page.getByText("Question 3 of 12")).toBeVisible();
});
