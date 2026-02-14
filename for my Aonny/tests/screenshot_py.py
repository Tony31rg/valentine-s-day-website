"""
Screenshot script using Playwright for Python.
Saves desktop/tablet/mobile screenshots to ./screenshots
"""
from playwright.sync_api import sync_playwright
import os

out_dir = os.path.join(os.path.dirname(__file__), '..', 'screenshots')
os.makedirs(out_dir, exist_ok=True)

url = os.environ.get('TARGET_URL', 'http://localhost:8000/')

with sync_playwright() as p:
    browser = p.chromium.launch()
    # desktop
    page = browser.new_page(viewport={'width':1280, 'height':800})
    page.goto(url)
    page.wait_for_load_state('networkidle')
    page.screenshot(path=os.path.join(out_dir, 'desktop.png'), full_page=True)
    print('desktop saved')

    # tablet
    page = browser.new_page(viewport={'width':768,'height':1024})
    page.goto(url)
    page.wait_for_load_state('networkidle')
    page.screenshot(path=os.path.join(out_dir, 'tablet.png'), full_page=True)
    print('tablet saved')

    # mobile
    page = browser.new_page(viewport={'width':375,'height':812}, is_mobile=True)
    page.goto(url)
    page.wait_for_load_state('networkidle')
    page.screenshot(path=os.path.join(out_dir, 'mobile.png'), full_page=True)
    print('mobile saved')

    browser.close()
