document.addEventListener('DOMContentLoaded', () => {

    const CROPS = [
        { id: 1, name: 'Wheat', scientific: 'Triticum aestivum', category: 'Rabi', type: 'Grains', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&fit=crop&auto=format', season: 'Oct - Nov', soil: 'Loam, Clay Loam', water: 'Med (300-400mm)', harvest: '120-150 days', diseases: 'Rust, Smut, Blight', fert: 'NPK 120:60:40 kg/ha', stages: ['Seedling', 'Tillering', 'Jointing', 'Booting', 'Heading', 'Ripening'] },
        { id: 2, name: 'Rice (Paddy)', scientific: 'Oryza sativa', category: 'Kharif', type: 'Grains', img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&fit=crop&auto=format', season: 'Jun - Jul', soil: 'Clay, Clay Loam', water: 'High (1000-1500mm)', harvest: '100-150 days', diseases: 'Blast, Brown Spot', fert: 'NPK 100:50:50 kg/ha', stages: ['Seedling', 'Tillering', 'Panicle Initiation', 'Heading', 'Ripening'] },
        { id: 3, name: 'Tomato', scientific: 'Solanum lycopersicum', category: 'Zaid', type: 'Vegetables', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&fit=crop&auto=format', season: 'All Year', soil: 'Sandy Loam', water: 'Medium', harvest: '70-90 days', diseases: 'Early Blight, Late Blight', fert: 'NPK 120:80:80 kg/ha', stages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting'] },
        { id: 4, name: 'Onion', scientific: 'Allium cepa', category: 'Rabi', type: 'Vegetables', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&fit=crop&auto=format', season: 'Oct - Nov', soil: 'Sandy Loam', water: 'Medium', harvest: '150 days', diseases: 'Purple Blotch', fert: 'NPK 100:50:50 kg/ha', stages: ['Seedling', 'Vegetative', 'Bulb Formation', 'Maturation'] },
        { id: 5, name: 'Cotton', scientific: 'Gossypium', category: 'Kharif', type: 'Cash Crops', img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&fit=crop&auto=format', season: 'May - Jul', soil: 'Black Cotton Soil', water: 'High', harvest: '150-180 days', diseases: 'Bollworm, Leaf Curl', fert: 'NPK 120:60:60 kg/ha', stages: ['Seedling', 'Squaring', 'Flowering', 'Boll Development'] },
        { id: 6, name: 'Sugarcane', scientific: 'Saccharum officinarum', category: 'Kharif', type: 'Cash Crops', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&fit=crop&auto=format', season: 'Jan - Mar', soil: 'Well drained Loam', water: 'High', harvest: '10-14 months', diseases: 'Red Rot, Smut', fert: 'NPK 250:100:100 kg/ha', stages: ['Germination', 'Tillering', 'Grand Growth', 'Maturity'] },
        { id: 7, name: 'Maize', scientific: 'Zea mays', category: 'Kharif', type: 'Grains', img: 'images/maize.png', season: 'Jun - Jul', soil: 'Loam', water: 'Medium', harvest: '90-120 days', diseases: 'Leaf Blight', fert: 'NPK 120:60:40 kg/ha', stages: ['Seedling', 'Vegetative', 'Tasseling', 'Silking', 'Maturity'] },
        { id: 8, name: 'Potato', scientific: 'Solanum tuberosum', category: 'Rabi', type: 'Vegetables', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&fit=crop&auto=format', season: 'Oct - Nov', soil: 'Sandy Loam', water: 'Medium', harvest: '90-120 days', diseases: 'Late Blight', fert: 'NPK 150:100:100 kg/ha', stages: ['Sprouting', 'Vegetative', 'Tuber Initiation', 'Tuber Bulking', 'Maturation'] },
        { id: 9, name: 'Apple', scientific: 'Malus domestica', category: 'Rabi', type: 'Fruits', img: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&fit=crop&auto=format', season: 'Winter', soil: 'Well drained Loam', water: 'Medium', harvest: '130-150 days', diseases: 'Scab, Powdery Mildew', fert: 'Custom per age', stages: ['Dormancy', 'Bud Break', 'Bloom', 'Fruit Set', 'Maturation'] },
        { id: 10, name: 'Mango', scientific: 'Mangifera indica', category: 'Zaid', type: 'Fruits', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&fit=crop&auto=format', season: 'Summer', soil: 'Alluvial, Laterite', water: 'Medium', harvest: '100-150 days', diseases: 'Anthracnose', fert: 'Custom per age', stages: ['Vegetative', 'Flowering', 'Fruit Set', 'Fruit Development', 'Maturity'] },
        { id: 11, name: 'Mustard', scientific: 'Brassica', category: 'Rabi', type: 'Cash Crops', img: 'images/mustard.png', season: 'Oct - Nov', soil: 'Loam to Clay Loam', water: 'Low', harvest: '110-140 days', diseases: 'Aphids, White Rust', fert: 'NPK 60:40:40 kg/ha', stages: ['Seedling', 'Rosette', 'Bolting', 'Flowering', 'Pod Formation'] },
        { id: 12, name: 'Turmeric', scientific: 'Curcuma longa', category: 'Kharif', type: 'Cash Crops', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&fit=crop&auto=format', season: 'May - Jun', soil: 'Well drained Loam', water: 'High', harvest: '7-9 months', diseases: 'Leaf Spot', fert: 'NPK 120:50:50 kg/ha', stages: ['Sprouting', 'Vegetative', 'Rhizome Initiation', 'Rhizome Maturation'] },
        { id: 13, name: 'Groundnut', scientific: 'Arachis hypogaea', category: 'Kharif', type: 'Cash Crops', img: 'images/groundnut.png', season: 'Jun - Jul', soil: 'Sandy Loam', water: 'Medium', harvest: '100-120 days', diseases: 'Tikka Disease', fert: 'NPK 20:40:40 kg/ha', stages: ['Seedling', 'Vegetative', 'Flowering', 'Pegging', 'Pod Development'] },
        { id: 14, name: 'Green Gram', scientific: 'Vigna radiata', category: 'Zaid', type: 'Pulses', img: 'images/green_gram.png', season: 'Mar - Apr', soil: 'Loam', water: 'Low', harvest: '60-70 days', diseases: 'Yellow Mosaic Virus', fert: 'NPK 20:40:20 kg/ha', stages: ['Seedling', 'Vegetative', 'Flowering', 'Pod Formation'] },
        { id: 15, name: 'Chilli', scientific: 'Capsicum annuum', category: 'Kharif', type: 'Vegetables', img: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&fit=crop&auto=format', season: 'May - Jun', soil: 'Well drained Loam', water: 'Medium', harvest: '90-100 days', diseases: 'Leaf Curl, Anthracnose', fert: 'NPK 120:60:60 kg/ha', stages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting'] },
        { id: 16, name: 'Banana', scientific: 'Musa', category: 'Kharif', type: 'Fruits', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&fit=crop&auto=format', season: 'Jun - Jul', soil: 'Rich Loam', water: 'High', harvest: '11-14 months', diseases: 'Panama Wilt', fert: 'NPK 200:100:200 g/plant', stages: ['Vegetative', 'Shooting', 'Bunch Development', 'Maturity'] },
        { id: 17, name: 'Barley', scientific: 'Hordeum vulgare', category: 'Rabi', type: 'Grains', img: 'images/barley.png', season: 'Oct - Nov', soil: 'Sandy Loam', water: 'Low', harvest: '120-130 days', diseases: 'Stripe Rust', fert: 'NPK 60:30:20 kg/ha', stages: ['Seedling', 'Tillering', 'Heading', 'Maturation'] },
        { id: 18, name: 'Chickpea', scientific: 'Cicer arietinum', category: 'Rabi', type: 'Pulses', img: 'images/chickpea.png', season: 'Oct - Nov', soil: 'Loam', water: 'Low', harvest: '90-150 days', diseases: 'Wilt, Blight', fert: 'NPK 20:40:20 kg/ha', stages: ['Seedling', 'Vegetative', 'Flowering', 'Podding', 'Maturation'] },
        { id: 19, name: 'Soybean', scientific: 'Glycine max', category: 'Kharif', type: 'Cash Crops', img: 'images/soybean.png', season: 'Jun - Jul', soil: 'Black Cotton Soil', water: 'Medium', harvest: '100-120 days', diseases: 'Rust, Blight', fert: 'NPK 20:60:40 kg/ha', stages: ['Seedling', 'Vegetative', 'Flowering', 'Pod Development'] }
    ];

    const grid = document.getElementById('crop-grid');
    const searchInput = document.getElementById('crop-search-input');
    const filterChips = document.querySelectorAll('.filter-chip');

    // --- Render Grid ---
    function renderGrid(data) {
        grid.innerHTML = '';
        if(data.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem; color: #666;">No crops found matching your criteria.</p>';
            return;
        }
        data.forEach(crop => {
            const card = document.createElement('div');
            card.className = 'crop-card-item animate-on-scroll';
            card.innerHTML = `
                <div class="crop-img-wrap">
                    <img src="${crop.img}" alt="${crop.name}" onerror="this.src='https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&fit=crop'; this.onerror=null;" style="width:100%; height:200px; object-fit:cover;">
                </div>
                <div class="crop-info">
                    <h4>${crop.name}</h4>
                    <span class="crop-season-tag">${crop.category}</span>
                </div>
            `;
            card.addEventListener('click', () => openModal(crop));
            grid.appendChild(card);
        });
        
        // Re-trigger observer for new elements
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));
    }

    renderGrid(CROPS);

    // --- Filter Logic ---
    function applyFilters() {
        const term = searchInput.value.toLowerCase();
        const activeChip = document.querySelector('.filter-chip.active').getAttribute('data-filter');
        
        let filtered = CROPS.filter(c => c.name.toLowerCase().includes(term));
        if (activeChip !== 'All') {
            filtered = filtered.filter(c => c.category === activeChip || c.type === activeChip);
        }
        renderGrid(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            applyFilters();
        });
    });

    // --- Modal Logic ---
    const modalOverlay = document.getElementById('crop-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    
    function openModal(crop) {
        document.getElementById('modal-img').src = crop.img;
        document.getElementById('modal-img').onerror = function() { this.src='https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&fit=crop'; this.onerror=null; };
        document.getElementById('modal-img').style = "width:100%; height:200px; object-fit:cover;";
        document.getElementById('modal-title').textContent = crop.name;
        document.getElementById('modal-scientific').textContent = crop.scientific;
        // Build Dynamic Phases
        document.getElementById('modal-phase1').textContent = `Prepare ${crop.soil.toLowerCase()} soil. Sowing is best during ${crop.season}. Apply initial ${crop.fert} for strong establishment.`;
        document.getElementById('modal-phase2').textContent = `Maintain ${crop.water.toLowerCase()} water levels throughout growth. Monitor the ${crop.stages.slice(1, 3).join(' and ')} stages carefully.`;
        document.getElementById('modal-phase3').textContent = `High risk of ${crop.diseases}. Keep crops monitored and apply protective treatments at early signs.`;
        document.getElementById('modal-phase4').textContent = `Harvest usually occurs around ${crop.harvest}. Wait until the ${crop.stages[crop.stages.length - 1].toLowerCase()} stage is fully reached.`;
        
        // Build Growth Bar
        const gBar = document.getElementById('modal-growth');
        gBar.innerHTML = '';
        const colors = ['#E9C46A', '#F4A261', '#E76F51', '#2A9D8F', '#264653', '#1d3557'];
        crop.stages.forEach((stage, i) => {
            const div = document.createElement('div');
            div.className = 'growth-stage';
            div.style.flex = 1;
            div.style.backgroundColor = colors[i % colors.length];
            div.textContent = stage;
            gBar.appendChild(div);
        });

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    }

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) closeModal();
    });

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // --- AI Recommender (Rule-Based Logic) ---
    const cropDatabase = {
        // Kharif crops
        "Kharif-Alluvial-High":   ["Rice", "Jute", "Sugarcane"],
        "Kharif-Alluvial-Medium": ["Maize", "Soybean", "Green Gram"],
        "Kharif-Alluvial-Low":    ["Pearl Millet", "Groundnut", "Sesame"],
        "Kharif-Black-High":      ["Cotton", "Soybean", "Rice"],
        "Kharif-Black-Medium":    ["Sorghum", "Maize", "Groundnut"],
        "Kharif-Black-Low":       ["Pearl Millet", "Sesame", "Castor"],
        "Kharif-Red-High":        ["Rice", "Maize", "Groundnut"],
        "Kharif-Red-Medium":      ["Groundnut", "Sorghum", "Green Gram"],
        "Kharif-Red-Low":         ["Pearl Millet", "Castor", "Sesame"],
        "Kharif-Laterite-High":   ["Rice", "Cashew", "Coconut"],
        "Kharif-Laterite-Medium": ["Tapioca", "Groundnut", "Green Gram"],
        "Kharif-Sandy-Low":       ["Pearl Millet", "Groundnut", "Watermelon"],
        // Rabi crops
        "Rabi-Alluvial-High":     ["Wheat", "Sugarcane", "Potato"],
        "Rabi-Alluvial-Medium":   ["Mustard", "Wheat", "Chickpea"],
        "Rabi-Alluvial-Low":      ["Chickpea", "Lentil", "Pea"],
        "Rabi-Black-High":        ["Wheat", "Chickpea", "Sunflower"],
        "Rabi-Black-Medium":      ["Chickpea", "Linseed", "Safflower"],
        "Rabi-Black-Low":         ["Chickpea", "Safflower", "Lentil"],
        "Rabi-Red-High":          ["Wheat", "Sunflower", "Chickpea"],
        "Rabi-Red-Medium":        ["Mustard", "Chickpea", "Linseed"],
        "Rabi-Red-Low":           ["Lentil", "Chickpea", "Pea"],
        "Rabi-Laterite-Medium":   ["Potato", "Pea", "Mustard"],
        "Rabi-Sandy-Low":         ["Mustard", "Chickpea", "Barley"],
        // Zaid crops
        "Zaid-Alluvial-High":     ["Watermelon", "Cucumber", "Muskmelon"],
        "Zaid-Alluvial-Medium":   ["Moong Dal", "Vegetables", "Pumpkin"],
        "Zaid-Black-Medium":      ["Sunflower", "Moong Dal", "Fodder"],
        "Zaid-Red-Medium":        ["Watermelon", "Sesame", "Moong Dal"],
        "default":                ["Maize", "Vegetables", "Green Gram"]
    };

    const stateSpecialty = {
        "Punjab": "Punjab is best known for Wheat and Rice — high MSP support available.",
        "Maharashtra": "Maharashtra excels in Cotton, Soybean, and Sugarcane cultivation.",
        "Karnataka": "Karnataka is ideal for Ragi, Coffee, Arecanut, and Sunflower.",
        "Kerala": "Kerala specializes in Coconut, Rubber, Pepper, and Cardamom.",
        "Andhra Pradesh": "Andhra Pradesh leads in Chilli, Tobacco, and Rice production.",
        "Tamil Nadu": "Tamil Nadu is known for Rice, Banana, Sugarcane, and Groundnut.",
        "Uttar Pradesh": "UP is a major producer of Sugarcane, Wheat, and Potato.",
        "Rajasthan": "Rajasthan is best for Pearl Millet, Mustard, and Guar.",
        "Gujarat": "Gujarat excels in Groundnut, Cotton, and Cumin.",
        "West Bengal": "West Bengal leads in Rice, Jute, and Potato.",
        "Bihar": "Bihar is known for Maize, Rice, Wheat, and Vegetables.",
        "Haryana": "Haryana is a top producer of Wheat, Mustard, and Sugarcane.",
        "Madhya Pradesh": "MP leads in Soybean, Wheat, Chickpea, and Linseed.",
        "Odisha": "Odisha grows Rice, Maize, Groundnut, and Turmeric.",
        "Assam": "Assam specializes in Rice, Tea, Jute, and Mustard.",
        "Telangana": "Telangana grows Cotton, Rice, Sorghum, and Maize.",
        "Himachal Pradesh": "HP is known for Apple, Pea, Potato, and Ginger."
    };

    window.getRecommendations = function() {
        const state = document.getElementById('rec-state').value;
        const seasonRaw = document.getElementById('rec-season').value;
        const soilRaw = document.getElementById('rec-soil').value;
        const waterRaw = document.getElementById('rec-water').value;
        
        const resultDiv = document.getElementById('rec-result');
        
        resultDiv.innerHTML = `
            <div style="text-align: center;">
                <span style="font-size: 4rem; display: inline-block; animation: spin 2s linear infinite;">⏳</span>
                <h3 style="margin: 15px 0; font-family: var(--font-heading); font-size: 2rem;">Analyzing Agmark Data...</h3>
            </div>
        `;

        setTimeout(() => {
            // Parse inputs for key
            let season = "Kharif";
            if(seasonRaw.includes("Rabi")) season = "Rabi";
            else if(seasonRaw.includes("Zaid")) season = "Zaid";

            let soil = "Alluvial";
            if(soilRaw.includes("Black")) soil = "Black";
            else if(soilRaw.includes("Red")) soil = "Red";
            else if(soilRaw.includes("Laterite")) soil = "Laterite";
            else if(soilRaw.includes("Sandy")) soil = "Sandy";

            let water = "Medium";
            if(waterRaw.includes("High")) water = "High";
            else if(waterRaw.includes("Low")) water = "Low";

            const key = season + "-" + soil + "-" + water;
            let recommended = cropDatabase[key] || cropDatabase["default"];
            
            const specialtyNotes = stateSpecialty[state] || "Great farming potential in your region!";

            resultDiv.innerHTML = `
                <h3 style="margin-bottom: 20px; font-family: var(--font-heading); font-size: 2rem; color: var(--background-cream);">Top Recommendations</h3>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 12px; border-left: 4px solid var(--accent-amber);">
                        <h4 style="font-size: 1.2rem; margin-bottom: 5px;">1. ${recommended[0]}</h4>
                        <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">Excellent match for ${soilRaw} soil with ${waterRaw} water availability in ${state} during ${seasonRaw}.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 12px; border-left: 4px solid var(--accent-amber);">
                        <h4 style="font-size: 1.2rem; margin-bottom: 5px;">2. ${recommended[1]}</h4>
                        <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">Good alternative with high market demand for ${soilRaw} soil in this region.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 12px; border-left: 4px solid var(--accent-amber);">
                        <h4 style="font-size: 1.2rem; margin-bottom: 5px;">3. ${recommended[2]}</h4>
                        <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">Suitable for crop rotation to maintain soil health given ${waterRaw} resources.</p>
                    </div>
                    <div style="background: rgba(244, 162, 97, 0.2); border: 1px solid var(--accent-amber); padding: 15px; border-radius: 12px; margin-top: 10px;">
                        <h4 style="font-size: 1.1rem; color: var(--accent-amber); margin-bottom: 5px;">📍 Regional Context</h4>
                        <p style="font-size: 0.95rem; color: var(--background-cream);">${specialtyNotes}</p>
                    </div>
                </div>
            `;
        }, 1500);
    }
});
