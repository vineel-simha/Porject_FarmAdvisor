document.addEventListener('DOMContentLoaded', () => {

    // --- Mock Data: 8 Core Schemes ---
    const SCHEMES = [
        {
            id: 'pm-kisan',
            name: 'PM-KISAN',
            category: 'Subsidy',
            tagClass: 'tag-subsidy',
            desc: 'Pradhan Mantri Kisan Samman Nidhi provides income support to all landholding farmers\' families in the country to supplement their financial needs.',
            eligibility: 'All landholding farmers (marginal & small preferred)',
            benefit: '₹6,000 per year in 3 equal installments',
            link: 'https://pmkisan.gov.in/',
            matchLogic: (land, cat) => true // everyone is eligible essentially for the mock
        },
        {
            id: 'pmfby',
            name: 'PM Fasal Bima Yojana',
            category: 'Insurance',
            tagClass: 'tag-insurance',
            desc: 'Provides comprehensive insurance cover against failure of the crop helping in stabilizing the income of the farmers.',
            eligibility: 'All farmers growing notified crops',
            benefit: 'Maximum premium of 2% for Kharif, 1.5% for Rabi',
            link: 'https://pmfby.gov.in/',
            matchLogic: (land, cat) => true
        },
        {
            id: 'kcc',
            name: 'Kisan Credit Card (KCC)',
            category: 'Loans',
            tagClass: 'tag-loans',
            desc: 'Aims to provide adequate and timely credit support from the banking system via a single window for agricultural needs.',
            eligibility: 'Individual / Joint borrowers who are owner cultivators',
            benefit: 'Short term credit limits up to ₹3 Lakhs at 4% interest',
            link: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card',
            matchLogic: (land, cat) => true
        },
        {
            id: 'shc',
            name: 'Soil Health Card Scheme',
            category: 'Subsidy',
            tagClass: 'tag-subsidy',
            desc: 'Promotes soil testing services, issuance of Soil Health Cards, and development of nutrient management practices.',
            eligibility: 'All farmers across India',
            benefit: 'Free soil testing and balanced fertilization advice',
            link: 'https://soilhealth.dac.gov.in/',
            matchLogic: (land, cat) => true
        },
        {
            id: 'enam',
            name: 'National Agriculture Market (e-NAM)',
            category: 'Equipment', // Grouping into equipment/market access
            tagClass: 'tag-equipment',
            desc: 'Pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.',
            eligibility: 'Farmers, Traders, and FPOs',
            benefit: 'Better price discovery and transparent auction',
            link: 'https://www.enam.gov.in/',
            matchLogic: (land, cat) => true
        },
        {
            id: 'pmksy',
            name: 'PM Krishi Sinchai Yojana',
            category: 'Subsidy',
            tagClass: 'tag-subsidy',
            desc: 'Focuses on improving water use efficiency at farm level through Micro Irrigation (Drip & Sprinkler).',
            eligibility: 'Farmers with cultivable land and water source',
            benefit: 'Up to 55% subsidy for small/marginal farmers',
            link: 'https://pmksy.gov.in/',
            matchLogic: (land, cat) => cat === 'Marginal' || cat === 'Small' || land <= 5 // Specifically targets small/marginal
        },
        {
            id: 'rkvy',
            name: 'Rashtriya Krishi Vikas Yojana',
            category: 'Loans',
            tagClass: 'tag-loans',
            desc: 'Incentivizes States to increase public investment in Agriculture and allied sectors to maximize local yield potential.',
            eligibility: 'Varies by state-specific projects',
            benefit: 'Infrastructure and agri-entrepreneurship funding',
            link: 'https://rkvy.nic.in/',
            matchLogic: (land, cat) => true
        },
        {
            id: 'paramparagat',
            name: 'Paramparagat Krishi Vikas Yojana',
            category: 'Subsidy',
            tagClass: 'tag-subsidy',
            desc: 'Elaborate scheme to promote organic farming through a cluster approach and PGS certification.',
            eligibility: 'Cluster of farmers with minimum 20 hectares',
            benefit: '₹50,000 per hectare for 3 years',
            link: 'https://pgsindia-ncof.gov.in/pkvy/index.aspx',
            matchLogic: (land, cat) => land > 2 || cat === 'Large' // favors slightly larger clusters/groups
        }
    ];

    const grid = document.getElementById('scheme-grid');
    const filterChips = document.querySelectorAll('#scheme-filters .filter-chip');
    
    // --- Render Cards ---
    function renderSchemes(filter = 'All', matchedIds = null) {
        grid.innerHTML = '';
        
        let displayData = SCHEMES;
        if(filter !== 'All') {
            displayData = SCHEMES.filter(s => s.category === filter);
        }

        displayData.forEach(scheme => {
            const isMatched = matchedIds ? matchedIds.includes(scheme.id) : false;
            const isUnmatched = matchedIds ? !matchedIds.includes(scheme.id) : false;
            
            const cardClass = `scheme-card ${isMatched ? 'matched' : ''} ${isUnmatched ? 'unmatched' : ''}`;
            
            const card = document.createElement('div');
            card.className = cardClass;
            card.innerHTML = `
                <span class="matched-badge">✨ Eligible Match</span>
                <span class="scheme-tag ${scheme.tagClass}">${scheme.category}</span>
                <h4>${scheme.name}</h4>
                <p class="scheme-desc">${scheme.desc}</p>
                <div class="scheme-details">
                    <div><strong>Eligibility:</strong> ${scheme.eligibility}</div>
                    <div><strong>Benefit:</strong> <span style="color: var(--primary-green); font-weight: 500;">${scheme.benefit}</span></div>
                </div>
                <a href="${scheme.link}" target="_blank" class="btn btn-outline" style="align-self: flex-start; margin-top: auto;">Apply Now &rarr;</a>
            `;
            grid.appendChild(card);
        });
    }

    renderSchemes();

    // --- Filter Logic ---
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            // If eligibility check is active, applying filter overrides it visually, we will re-render
            document.getElementById('reset-eligibility').click(); // reset eligibility if manual filter clicked
            renderSchemes(chip.getAttribute('data-category'));
        });
    });

    // --- Eligibility Checker Logic ---
    const form = document.getElementById('eligibility-form');
    const resultDiv = document.getElementById('eligibility-result');
    const matchCountEl = document.getElementById('match-count');
    const resetBtn = document.getElementById('reset-eligibility');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const land = parseFloat(document.getElementById('land-size').value);
        const cat = document.getElementById('farm-income').value;
        
        // Reset manual filters to 'All'
        filterChips.forEach(c => c.classList.remove('active'));
        document.querySelector('[data-category="All"]').classList.add('active');

        // Match Logic
        const matched = [];
        SCHEMES.forEach(s => {
            if(s.matchLogic(land, cat)) {
                matched.push(s.id);
            }
        });

        matchCountEl.textContent = matched.length;
        resultDiv.style.display = 'block';
        
        renderSchemes('All', matched);
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        resultDiv.style.display = 'none';
        
        filterChips.forEach(c => c.classList.remove('active'));
        document.querySelector('[data-category="All"]').classList.add('active');
        
        renderSchemes(); // renders all without match badges
    });
});
