const fs = require('fs');
const glob = require('glob');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const langSwitcherHTML = `
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
            </div>`;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (!content.includes('id="langSwitcher"')) {
        content = content.replace('<div class="nav-actions">', '<div class="nav-actions">' + langSwitcherHTML);
        changed = true;
    }
    
    if (!content.includes('translations.js')) {
        if (content.includes('<script src="js/main.js"></script>')) {
            content = content.replace('<script src="js/main.js"></script>', '<script src="translations.js"></script>\n    <script src="js/main.js"></script>');
        } else {
            content = content.replace('</body>', '    <script src="translations.js"></script>\n</body>');
        }
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
    }
}
console.log('Done updating HTML files');
