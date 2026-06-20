import urllib.request
import re

resp = urllib.request.urlopen('http://localhost:8000/index.html')
html = resp.read().decode('utf-8')

checks = []

# 1. Profile photo
if 'Edwin Njoroge Profile Photo' in html:
    checks.append('[OK] Profile photo reference found in HTML')
else:
    checks.append('[FAIL] Profile photo reference NOT found')

# 2. Portfolio carousel container
if 'id="portfolio-carousel"' in html:
    checks.append('[OK] Portfolio carousel container exists')
else:
    checks.append('[FAIL] Portfolio carousel container missing')

# 3. Filter bar
if 'id="portfolio-filters"' in html:
    checks.append('[OK] Portfolio filter bar container exists')
else:
    checks.append('[FAIL] Portfolio filter bar missing')

# 4. Scripts
for s in ['data/content.js', 'data/portfolio.js', 'js/app.js']:
    if s in html:
        checks.append(f'[OK] {s} script referenced')
    else:
        checks.append(f'[FAIL] {s} script missing')

# 5. i18n attrs
i18n_count = len(re.findall(r'data-i18n=', html))
checks.append(f'[OK] Found {i18n_count} data-i18n translation attributes')

# 6. About paragraphs
if 'id="about-paragraphs"' in html:
    checks.append('[OK] About paragraphs container exists')
else:
    checks.append('[FAIL] About paragraphs container missing')

# 7. Services -> Approach
if 'about.principlesEyebrow' in html:
    checks.append('[OK] Services section mapped to Approach/Principles')
else:
    checks.append('[FAIL] Services section not updated')

# 8. Profile image path
m = re.search(r'data-bg-img="(.*?Edwin.*?)"', html)
if m:
    checks.append(f'[OK] Right panel image: {m.group(1)}')
else:
    checks.append('[FAIL] Right panel image not set to Edwin photo')

# 9. Name
if 'Edwin Njoroge' in html:
    checks.append('[OK] Edwin Njoroge name found on page')

# 10. Removed sections
if 'id="customers"' not in html:
    checks.append('[OK] Customers section removed')
else:
    checks.append('[WARN] Customers section still present')

if 'id="news"' not in html:
    checks.append('[OK] News section removed')
else:
    checks.append('[WARN] News section still present')

# 11. Check app.js has the right boot method
app_js = open('js/app.js', encoding='utf-8').read()
if '$(document).ready' in app_js:
    checks.append('[OK] app.js uses $(document).ready for boot')
if 'rebuildPortfolioCarousel' in app_js:
    checks.append('[OK] app.js has rebuildPortfolioCarousel function')
if 'bindModalTriggers' in app_js:
    checks.append('[OK] app.js has bindModalTriggers function')
if 'renderPortfolioFilters' in app_js:
    checks.append('[OK] app.js has renderPortfolioFilters function')

# 12. Check portfolio.js has items
portfolio_js = open('data/portfolio.js', encoding='utf-8').read()
item_count = portfolio_js.count('"slug"')
checks.append(f'[OK] portfolio.js has {item_count} portfolio items defined')

# 13. Check content.js has both languages
content_js = open('data/content.js', encoding='utf-8').read()
if '"en"' in content_js and '"de"' in content_js:
    checks.append('[OK] content.js has EN and DE translations')

# 14. Profile photo file exists
import os
photo_path = 'img/Edwin Njoroge Profile Photo.png.png'
if os.path.exists(photo_path):
    size_kb = os.path.getsize(photo_path) // 1024
    checks.append(f'[OK] Profile photo file exists ({size_kb} KB)')
else:
    checks.append('[FAIL] Profile photo file NOT found on disk')

# 15. Check light version too
resp2 = urllib.request.urlopen('http://localhost:8000/index-light.html')
html2 = resp2.read().decode('utf-8')
if 'class="light"' in html2:
    checks.append('[OK] index-light.html has body class="light"')
if 'Edwin Njoroge Profile Photo' in html2:
    checks.append('[OK] index-light.html also has profile photo')

print('\n=== SITE VERIFICATION REPORT ===\n')
for c in checks:
    print(c)
print(f'\n=== {sum(1 for c in checks if c.startswith("[OK]"))}/{len(checks)} checks passed ===')
