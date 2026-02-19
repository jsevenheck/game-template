// Example E2E test — replace with your game's flow.
// Playwright starts both servers automatically via playwright.config.ts.

import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  // TODO: update selector to match your actual UI
  await expect(page.locator('body')).toBeVisible();
});

// TODO: add tests for the full game flow, e.g.:
// test('two players can create and join a room', async ({ browser }) => {
//   const host = await browser.newPage();
//   const guest = await browser.newPage();
//   ...
// });
