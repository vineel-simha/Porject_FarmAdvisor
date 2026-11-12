document.addEventListener('DOMContentLoaded', () => {

    // --- Mock Data for Mandi Prices ---
    const MARKET_DATA = [
        { crop: 'Wheat', category: 'Grains', state: 'Punjab', mandi: 'Ludhiana', min: 2100, max: 2250, modal: 2150, trend: '↑', date: 'Today' },
        { crop: 'Rice (Paddy)', category: 'Grains', state: 'Punjab', mandi: 'Amritsar', min: 1800, max: 2000, modal: 1950, trend: '→', date: 'Today' },
        { crop: 'Tomato', category: 'Vegetables', state: 'Karnataka', mandi: 'Kolar', min: 1500, max: 2200, modal: 1850, trend: '↑', date: 'Today' },
        { crop: 'Onion', category: 'Vegetables', state: 'Maharashtra', mandi: 'Lasalgaon', min: 900, max: 1400, modal: 1200, trend: '↓', date: 'Today' },
        { crop: 'Potato', category: 'Vegetables', state: 'Uttar Pradesh', mandi: 'Agra', min: 800, max: 1100, modal: 950, trend: '→', date: 'Yesterday' },
        { crop: 'Maize', category: 'Grains', state: 'Karnataka', mandi: 'Davangere', min: 1900, max: 2100, modal: 2050, trend: '↑', date: 'Today' },
        { crop: 'Cotton', category: 'Cash Crops', state: 'Maharashtra', mandi: 'Akola', min: 6500, max: 7200, modal: 7000, trend: '↑', date: 'Today' },
        { crop: 'Green Gram', category: 'Pulses', state: 'Madhya Pradesh', mandi: 'Indore', min: 7000, max: 7500, modal: 7200, trend: '↓', date: 'Yesterday' },
        { crop: 'Sugarcane', category: 'Cash Crops', state: 'Uttar Pradesh', mandi: 'Meerut', min: 300, max: 350, modal: 340, trend: '→', date: 'Today' },
        { crop: 'Apple', category: 'Fruits', state: 'Himachal', mandi: 'Shimla', min: 5000, max: 8000, modal: 6500, trend: '↑', date: 'Today' },
        { crop: 'Mango', category: 'Fruits', state: 'Maharashtra', mandi: 'Ratnagiri', min: 4000, max: 6000, modal: 5500, trend: '→', date: 'Yesterday' },
        { crop: 'Turmeric', category: 'Spices', state: 'Maharashtra', mandi: 'Sangli', min: 8000, max: 12000, modal: 10500, trend: '↑', date: 'Today' },
        { crop: 'Garlic', category: 'Spices', state: 'Madhya Pradesh', mandi: 'Mandsaur', min: 4000, max: 7000, modal: 6000, trend: '↓', date: 'Today' },
        { crop: 'Soybean', category: 'Grains', state: 'Maharashtra', mandi: 'Latur', min: 4500, max: 5000, modal: 4800, trend: '↓', date: 'Today' },
        { crop: 'Mustard', category: 'Grains', state: 'Rajasthan', mandi: 'Alwar', min: 4800, max: 5300, modal: 5100, trend: '→', date: 'Yesterday' }
    ];

    // --- Render Table ---
    const tbody = document.getElementById('price-table-body');
    
    function renderTable(dataToRender) {
        tbody.innerHTML = '';
        dataToRender.forEach(item => {
            let trendClass = 'trend-stable';
            if(item.trend === '↑') trendClass = 'trend-up'; // Note: up is visually red/bad for consumers, but good for farmers. Using green for up in farming context. Actually let's just color it based on standard - up=green, down=red from farmer perspective. Wait, in CSS I made trend-up red and trend-down green. I'll swap it here visually.
            
            // Re-evaluating CSS: trend-up { color: #d00000; } -> typically red in stock. 
            // We'll flip semantic meaning in JS class assignment for farmers.
            let farmerTrendClass = 'trend-stable';
            if(item.trend === '↑') farmerTrendClass = 'trend-down'; // Green
            if(item.trend === '↓') farmerTrendClass = 'trend-up'; // Red

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.crop}</strong></td>
                <td>${item.category}</td>
                <td>${item.state}</td>
                <td>${item.mandi}</td>
                <td>₹${item.min.toLocaleString('en-IN')}</td>
                <td>₹${item.max.toLocaleString('en-IN')}</td>
                <td><strong>₹${item.modal.toLocaleString('en-IN')}</strong></td>
                <td class="${farmerTrendClass}">${item.trend}</td>
                <td>${item.date}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderTable(MARKET_DATA);

    // --- Filters & Refresh Logic ---
    const stateFilter = document.getElementById('state-select');
    const categoryFilter = document.getElementById('category-select');
    const refreshBtn = document.getElementById('refresh-btn');
    const loaderBtnIcon = refreshBtn.querySelector('span');

    function filterData() {
        const s = stateFilter.value;
        const c = categoryFilter.value;
        let filtered = MARKET_DATA;

        if(s !== 'All') {
            filtered = filtered.filter(item => item.state === s);
        }
        if(c !== 'All') {
            filtered = filtered.filter(item => item.category === c);
        }
        renderTable(filtered);
    }

    stateFilter.addEventListener('change', filterData);
    categoryFilter.addEventListener('change', filterData);

    refreshBtn.addEventListener('click', () => {
        loaderBtnIcon.style.display = 'inline-block';
        loaderBtnIcon.style.animation = 'spin 1s linear infinite';
        // Mock network delay
        setTimeout(() => {
            loaderBtnIcon.style.animation = 'none';
            // Slight data jitter to simulate live update
            MARKET_DATA.forEach(d => {
                const jitter = Math.floor(Math.random() * 40) - 20; // -20 to +20
                d.modal += jitter;
                if(jitter > 0) d.trend = '↑';
                else if(jitter < 0) d.trend = '↓';
                else d.trend = '→';
            });
            filterData();
        }, 800);
    });

    // We can add a simple spin keyframe dynamically if not present
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(styleSheet);


    // --- Chart.js Integration ---
    const ctx = document.getElementById('trendChart').getContext('2d');
    let trendChart;

    const dummyChartData = {
        'Wheat': [2050, 2060, 2040, 2090, 2120, 2140, 2150],
        'Tomato': [1200, 1400, 1350, 1600, 1750, 1800, 1850],
        'Onion': [1600, 1500, 1550, 1400, 1300, 1250, 1200],
        'Rice': [1900, 1900, 1920, 1930, 1940, 1940, 1950]
    };

    function renderChart(cropName) {
        if(trendChart) trendChart.destroy();
        
        const data = dummyChartData[cropName] || dummyChartData['Wheat'];
        // Generate last 7 days labels
        const labels = [];
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push(d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
        }

        let isGoingUp = data[data.length-1] >= data[0];
        let lineColor = isGoingUp ? '#52B788' : '#F4A261'; // Use theme colors
        let gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, isGoingUp ? 'rgba(82, 183, 136, 0.5)' : 'rgba(244, 162, 97, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${cropName} Price (₹/q)`,
                    data: data,
                    borderColor: lineColor,
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: lineColor,
                    pointBorderWidth: 2,
                    pointRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { family: "'DM Sans', sans-serif" } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderChart('Wheat');

    document.getElementById('chart-crop-select').addEventListener('change', (e) => {
        renderChart(e.target.value);
    });

    document.getElementById('reset-chart-btn').addEventListener('click', () => {
        const selectedCrop = document.getElementById('chart-crop-select').value;
        renderChart(selectedCrop);
    });

});
