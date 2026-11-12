$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$htmlFiles = Get-ChildItem -Filter *.html

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $changed = $false

    if (-not $content.Contains('id="langSwitcher"')) {
        $replacement = '<div class="nav-actions">
            <div class="lang-switcher" id="langSwitcher">
                <button class="lang-btn" onclick="toggleLangMenu()">
                    🌐 <span id="currentLangLabel">EN</span> ▼
                </button>
                <div class="lang-dropdown" id="langDropdown">
                    <div class="lang-option active" onclick="setLanguage(''en'')">English (EN)</div>
                    <div class="lang-option" onclick="setLanguage(''hi'')">हिन्दी (HI)</div>
                    <div class="lang-option" onclick="setLanguage(''kn'')">ಕನ್ನಡ (KN)</div>
                    <div class="lang-option" onclick="setLanguage(''te'')">తెలుగు (TE)</div>
                    <div class="lang-option" onclick="setLanguage(''ta'')">தமிழ் (TA)</div>
                    <div class="lang-option" onclick="setLanguage(''mr'')">मराठी (MR)</div>
                    <div class="lang-option" onclick="setLanguage(''pa'')">ਪੰਜਾਬੀ (PA)</div>
                    <div class="lang-option" onclick="setLanguage(''bn'')">বাংলা (BN)</div>
                </div>
            </div>'
        $content = $content.Replace('<div class="nav-actions">', $replacement)
        $changed = $true
    }
    
    if ($content.Contains('nav_kisan_pool')) {
        if (-not $content.Contains('nav_renting')) {
            $content = $content.Replace('<li><a href="kisan-pool.html" data-lang="nav_kisan_pool">🚛 Kisan-Pool</a></li>', '<li><a href="kisan-pool.html" data-lang="nav_kisan_pool">🚛 Kisan-Pool</a></li>
            <li><a href="renting.html" data-lang="nav_renting">🚜 Rentals</a></li>')
            $changed = $true
        }
    }

    if (-not $content.Contains('translations.js')) {
        if ($content.Contains('<script src="js/main.js"></script>')) {
            $content = $content.Replace('<script src="js/main.js"></script>', '<script src="translations.js"></script>
    <script src="js/main.js"></script>')
        } else {
            $content = $content.Replace('</body>', '    <script src="translations.js"></script>
</body>')
        }
        $changed = $true
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
    }
}
Write-Output "Done updating HTML files"
