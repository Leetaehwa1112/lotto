import os
import re

RESULTS_DIR = 'results'
BASE_URL = 'https://leetaehwa1112.github.io/lotto'

def update_seo(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract Title content
    title_match = re.search(r'<title>(.*?)</title>', content)
    title_text = title_match.group(1) if title_match else '두쫀쿠 성격 테스트 결과'
    
    # Extract Description content
    desc_match = re.search(r'<meta name="description" content="(.*?)">', content)
    desc_text = desc_match.group(1) if desc_match else '나의 두쫀쿠 유형을 확인해보세요!'
    
    # Get filename for canonical URL
    filename = os.path.basename(file_path)
    canonical_url = f"{BASE_URL}/results/{filename}"
    
    # Define SEO block
    seo_block = f"""
    <link rel="canonical" href="{canonical_url}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="{canonical_url}">
    <meta property="og:title" content="{title_text}">
    <meta property="og:description" content="{desc_text}">
    <meta property="og:image" content="{BASE_URL}/assets/og-image.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{canonical_url}">
    <meta property="twitter:title" content="{title_text}">
    <meta property="twitter:description" content="{desc_text}">
    <meta property="twitter:image" content="{BASE_URL}/assets/og-image.png">

    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍪</text></svg>">

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "{title_text}",
      "description": "{desc_text}",
      "url": "{canonical_url}",
      "breadcrumb": {{
        "@type": "BreadcrumbList",
        "itemListElement": [
          {{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "{BASE_URL}/"
          }},
          {{
            "@type": "ListItem",
            "position": 2,
            "name": "Results",
            "item": "{BASE_URL}/results/"
          }},
          {{
            "@type": "ListItem",
            "position": 3,
            "name": "{title_text.split('|')[0].strip()}",
            "item": "{canonical_url}"
          }}
        ]
      }}
    }}
    </script>
    """

    # Check if we already have these tags to avoid duplication (simple check)
    if '<link rel="canonical"' in content:
        print(f"Skipping {filename}: Already has SEO tags.")
        return

    # Insert before <link rel="stylesheet" ...> which is a good anchor point in my template
    # My template:
    # <meta name="description" ...>
    # <link rel="stylesheet" ...>
    
    # I will replace the existing description line with description + seo_block
    # This ensures I keep the description but add everything else after it.
    
    if desc_match:
        # We replace the entire description line with itself + the new block
        # But wait, looking at my template, the structure is:
        # <title>...</title>
        # <meta name="description" ...>
        # <link rel="stylesheet" ...>
        
        # I'll just insert it before <link rel="stylesheet" href="../style.css">
        target = '<link rel="stylesheet" href="../style.css">'
        if target in content:
            new_content = content.replace(target, seo_block + '\n    ' + target)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
             print(f"Warning: Anchor not found in {filename}")
    else:
        print(f"Warning: Description not found in {filename}")

def main():
    if not os.path.exists(RESULTS_DIR):
        print("Results directory not found.")
        return

    files = [f for f in os.listdir(RESULTS_DIR) if f.endswith('.html')]
    print(f"Found {len(files)} HTML files.")

    for filename in files:
        update_seo(os.path.join(RESULTS_DIR, filename))

if __name__ == '__main__':
    main()
