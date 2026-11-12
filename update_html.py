import os, glob

html_files = glob.glob('*.html')
lang_switcher_html = '''
            <div class="lang-switcher" id="langSwitcher">
                <button class="lang-btn" onclick="toggleLangMenu()">
                    🌐 <span id="currentLangLabel">EN</span> ▼
                </button>
                <div class="lang-dropdown" id="langDropdown">
                    <div class="lang-option active" onclick="setLanguage('en')">English (EN)</div>
                    <div class="lang-option" onclick="setLanguage('hi')">हिन्दी (HI)</div>
                    <div class="lang-option" onclick="setLanguage('kn')">ಕನ್ನಡ (KN)</div>
                    <div class="lang-option" onclick="setLanguage('te')">తెలుగు (TE)</div>
                    <div class="lang-option" onclick="setLanguage('ta')">தமிழ் (TA)</div>
                    <div class="lang-option" onclick="setLanguage('mr')">मराठी (MR)</div>
                    <div class="lang-option" onclick="setLanguage('pa')">ਪੰਜਾਬੀ (PA)</div>
                    <div class="lang-option" onclick="setLanguage('bn')">বাংলা (BN)</div>
                </div>
            </div>
'''

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add lang switcher
    if 'id="langSwitcher"' not in content:
        content = content.replace('<div class="nav-actions">', '<div class="nav-actions">' + lang_switcher_html)
    
    # Add translations.js script
    if 'translations.js' not in content:
        if '<script src="js/main.js"></script>' in content:
            content = content.replace('<script src="js/main.js"></script>', '<script src="translations.js"></script>\n    <script src="js/main.js"></script>')
        else:
            content = content.replace('</body>', '    <script src="translations.js"></script>\n</body>')
            
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print('Updated HTML files')
