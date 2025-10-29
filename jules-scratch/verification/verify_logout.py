
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    try:
        # Go to the base URL and set the token
        page.goto("http://localhost:5173/")
        page.evaluate("() => localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNvbWV1c2VyaWQiLCJpYXQiOjE3NjE3MTk3NjcsImV4cCI6MTc2MTcyMzM2N30.PTOiREwZFi-4Cqde71wNdul5NsOGxxMp8RnaasFqha0')")

        # Go to dashboard and take a screenshot
        page.goto("http://localhost:5173/dashboard")
        page.screenshot(path="jules-scratch/verification/01_logged_in.png")

        # Log out
        page.locator("button.ml-2").click()
        page.get_by_role("menuitem", name="Logout").click()

        # Wait for navigation to the homepage and take a screenshot
        page.wait_for_url("http://localhost:5173/")
        page.screenshot(path="jules-scratch/verification/02_logged_out.png")

        # Verify the soft logout state
        is_soft_logged_out = page.evaluate("() => localStorage.getItem('isSoftLoggedOut')")
        token_exists = page.evaluate("() => localStorage.getItem('token')")

        assert is_soft_logged_out == 'true'
        assert token_exists is not None

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
