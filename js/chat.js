document.addEventListener('DOMContentLoaded', () => {
    
    // --- Expert Data Map ---
    const EXPERTS = [
        { id: 'bot', name: 'FarmBot AI', role: '24/7 Virtual Assistant', avatar: '🤖', isOnline: true, isBot: true },
        { id: 'soil', name: 'Dr. R. Sharma', role: 'Soil & Fertilizer Expert', avatar: '🪨', isOnline: true, isBot: false },
        { id: 'pest', name: 'Amit Verma', role: 'Pest Control Specialist', avatar: '🐛', isOnline: false, isBot: false },
        { id: 'water', name: 'Sunita Patil', role: 'Irrigation Advisor', avatar: '💧', isOnline: true, isBot: false },
        { id: 'organic', name: 'S. N. Iyer', role: 'Organic Farming', avatar: '🌿', isOnline: false, isBot: false },
        { id: 'market', name: 'Rajesh K.', role: 'Market & Price Analyst', avatar: '💰', isOnline: true, isBot: false },
        { id: 'govt', name: 'Kisan Helpline', role: 'Govt Schemes Info', avatar: '📋', isOnline: true, isBot: false }
    ];

    // --- Conversational Histories ---
    const chatHistory = {
        'bot': [
            { sender: 'expert', text: 'Hello! I am FarmBot, an AI agricultural advisor. How can I help you today?' }
        ],
        'soil': [
            { sender: 'expert', text: 'Namaste! I am Dr. Sharma. How can I assist you with your soil testing or fertilizer management today?' }
        ],
        'pest': [
            { sender: 'user', text: 'My tomato leaves are turning yellow, what should I do?' },
            { sender: 'expert', text: 'This could be nitrogen deficiency or early blight. Can you share a photo? Meanwhile, check if leaves yellow from bottom up (nutrient issue) or have brown spots (fungal).' }
        ],
        'water': [
            { sender: 'expert', text: 'Hello. Need advice on drip irrigation or water management for this season?' }
        ],
        'organic': [
            { sender: 'expert', text: 'Welcome to organic farming support. Let me know if you need help with vermicompost preparation.' }
        ],
        'market': [
            { sender: 'expert', text: 'Hi! Looking for today\'s Mandi trends or forecasting advice?' }
        ],
        'govt': [
            { sender: 'expert', text: 'Welcome. I can help you check your eligibility for PM-KISAN, Fasal Bima Yojana, and other schemes.' }
        ]
    };

    let currentExpertId = 'bot';
    let conversationHistory = []; // Gemini format message history

    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // --- DOM Elements ---
    const expertListEl = document.getElementById('expert-list');
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('btn-send');
    const expNameEl = document.getElementById('current-expert-name');
    const expStatusEl = document.getElementById('current-expert-status');
    const expIconEl = document.getElementById('current-expert-icon');
    let typingInd;

    // --- Initialization ---
    function initSidebar() {
        expertListEl.innerHTML = '';
        EXPERTS.forEach(exp => {
            const el = document.createElement('div');
            el.className = `expert-item ${exp.id === currentExpertId ? 'active' : ''}`;
            el.dataset.id = exp.id;
            
            const statusClass = exp.isOnline ? 'status-online' : 'status-busy';
            
            el.innerHTML = `
                <div class="expert-avatar">
                    ${exp.avatar}
                    <div class="status-dot ${statusClass}"></div>
                </div>
                <div class="expert-info">
                    <h4>${exp.name}</h4>
                    <p>${exp.role}</p>
                </div>
            `;
            
            el.addEventListener('click', () => switchExpert(exp.id));
            expertListEl.appendChild(el);
        });
    }

    function switchExpert(id) {
        currentExpertId = id;
        document.querySelectorAll('.expert-item').forEach(el => {
            el.classList.toggle('active', el.dataset.id === id);
        });
        
        const exp = EXPERTS.find(e => e.id === id);
        expNameEl.textContent = exp.name;
        expIconEl.textContent = exp.avatar;
        expStatusEl.textContent = exp.isOnline ? 'Online 🟢' : 'Busy 🔴';
        expStatusEl.style.color = exp.isOnline ? '#38b000' : '#d00000';
        
        renderChat();
    }

    function renderChat() {
        chatBox.innerHTML = '';
        const history = chatHistory[currentExpertId];
        
        history.forEach(msg => {
            appendMessage(msg.sender, msg.text);
        });
        
        // Setup typing indicator
        typingInd = document.createElement('div');
        typingInd.className = 'typing-indicator message-expert';
        typingInd.id = 'typing-indicator';
        typingInd.innerHTML = `<span></span><span></span><span></span>`;
        typingInd.style.display = 'none';
        chatBox.appendChild(typingInd);
        
        scrollToBottom();
    }

    function appendMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `message message-${sender}`;
        let innerText = text.replace(/\n/g, '<br>');
        
        if (sender === 'expert') {
            const safeText = text.replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, " ");
            innerText += ` <span class="speaker-icon" onclick="window.speakResponse('${safeText}')" style="cursor:pointer; font-size:1.1rem; opacity:0.7; margin-left:8px;" title="Read Aloud">🔊</span>`;
        }
        
        div.innerHTML = innerText;
        chatBox.insertBefore(div, typingInd); // Insert before typing indicator
        scrollToBottom();
        
        if (sender === 'expert') {
            if (window.speakResponseIfEnabled) window.speakResponseIfEnabled(text);
        }
    }

    function appendMessageWithId(sender, text, id) {
        const div = document.createElement('div');
        div.className = `message message-${sender}`;
        div.id = id;
        let innerText = text.replace(/\n/g, '<br>');
        
        if (sender === 'expert') {
            const safeText = text.replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, " ");
            innerText += ` <span class="speaker-icon" onclick="window.speakResponse('${safeText}')" style="cursor:pointer; font-size:1.1rem; opacity:0.7; margin-left:8px;" title="Read Aloud">🔊</span>`;
        }
        
        div.innerHTML = innerText;
        chatBox.insertBefore(div, typingInd);
        scrollToBottom();
        
        if (sender === 'expert' && !id.startsWith('countdown-')) {
            if (window.speakResponseIfEnabled) window.speakResponseIfEnabled(text);
        }
    }

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    let isWaiting = false;  // Global flag to block sending during cooldown

    // --- Send Message Logic ---
    async function handleSend() {
        if (isWaiting) return; // Block sending during cooldown

        const text = chatInput.value.trim();
        if(!text) return;
        
        // 1. User Message
        appendMessage('user', text);
        chatHistory[currentExpertId].push({ sender: 'user', text });
        chatInput.value = '';
        
        const currentExp = EXPERTS.find(e => e.id === currentExpertId);
        
        // 2. Mock or AI Reply Logic
        if(currentExp.isBot) {
            await simulateBotReply(text);
        } else {
            simulateHumanReply(currentExp);
        }
    }

    async function sendToGemini(userMessage) {
        const apiKey = localStorage.getItem("gemini_api_key");
        
        if (!apiKey) {
            return "⚠️ Please enter your free Gemini API key in the setup box above to activate me. Get it free at aistudio.google.com — takes 2 minutes!";
        }

        conversationHistory.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        const langInstruction = `IMPORTANT: Always reply in ${window.FARMBOT_REPLY_LANGUAGE || "English"} language only. If the user writes in any language, still reply in ${window.FARMBOT_REPLY_LANGUAGE || "English"}.`;

        const systemPrompt = langInstruction + "\n\n" + `You are FarmBot 🌱, an expert AI agricultural advisor for Indian farmers. 
You have deep knowledge of:
- Indian crops: Wheat, Rice, Cotton, Sugarcane, Tomato, Onion, Potato, Maize, Mustard, Chilli, Turmeric, Groundnut, Soybean, Banana, Mango and all others
- Indian farming seasons: Kharif (June-November), Rabi (October-March), Zaid (March-June)
- Soil types: Alluvial, Black/Regur, Red, Laterite, Sandy, Loamy
- All 28 Indian states and their specific crops and climates
- Government schemes: PM-KISAN, PM Fasal Bima Yojana, Kisan Credit Card, Soil Health Card, eNAM, PM Krishi Sinchai Yojana
- Fertilizers: Urea, DAP, NPK, organic manures, Vermicompost
- Pest and disease management for Indian crops
- Irrigation methods: drip, sprinkler, flood
- Market prices and selling tips for Indian mandis
- Post-harvest storage and processing

Rules:
- Always respond in a warm, respectful tone — farmers are your priority
- Give practical, specific, actionable advice with quantities and timelines
- Mention specific variety names, dosages, and best practices
- If asked in Hindi or mixed Hindi-English, respond in the same language naturally
- Keep responses concise — under 150 words unless detailed explanation is needed
- Always end with an encouraging line or a follow-up question
- Never say you cannot help with farming questions`;

        const messages = conversationHistory.map((msg, index) => {
            if (index === 0 && msg.role === "user") {
                return {
                    role: "user",
                    parts: [{ text: systemPrompt + "\n\nFarmer's question: " + msg.parts[0].text }]
                };
            }
            return msg;
        });

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: messages,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 300,
                        topP: 0.9
                    },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }
                    ]
                })
            });

            const data = await response.json();

            if (data.error) {
                // Remove the failed user message from history
                conversationHistory.pop();
                if (data.error.code === 400) return "❌ Invalid API key. Please check your Gemini API key and try again.";
                if (data.error.code === 429) {
                    return "__RATE_LIMIT__";
                }
                return "❌ Error: " + data.error.message;
            }

            const botReply = data.candidates[0].content.parts[0].text;

            conversationHistory.push({
                role: "model",
                parts: [{ text: botReply }]
            });

            if (conversationHistory.length > 10) {
                conversationHistory = conversationHistory.slice(-10);
            }

            return botReply;

        } catch (error) {
            conversationHistory.pop();
            return "🌐 Network error. Please check your internet connection and try again.";
        }
    }

    async function handleRateLimit(userMessage) {
        isWaiting = true;
        
        // Disable input during wait
        chatInput.disabled = true;
        chatInput.placeholder = "Please wait...";

        let seconds = 30;
        const tempId = "countdown-" + Date.now();
        
        // Show countdown bubble
        typingInd.style.display = 'none';
        
        appendMessageWithId("expert", "⏳ FarmBot is cooling down. Auto-retrying in <b>" + seconds + "s</b>...", tempId);

        // Countdown timer
        await new Promise(resolve => {
            const timer = setInterval(() => {
                seconds--;
                const el = document.getElementById(tempId);
                if (el) {
                    el.innerHTML = "⏳ FarmBot is cooling down. Auto-retrying in <b>" + seconds + "s</b>...";
                }
                if (seconds <= 0) {
                    clearInterval(timer);
                    resolve();
                }
            }, 1000);
        });

        // Update countdown bubble to show retrying
        const el = document.getElementById(tempId);
        if (el) el.innerHTML = "🔄 Retrying your message...";

        // Re-enable input
        chatInput.disabled = false;
        chatInput.placeholder = "Type your farming query here...";
        isWaiting = false;

        typingInd.style.display = 'flex';
        scrollToBottom();

        // Auto-retry the original message
        const retryReply = await sendToGemini(userMessage);

        typingInd.style.display = 'none';

        // Remove countdown bubble
        const countdownBubble = document.getElementById(tempId);
        if (countdownBubble) countdownBubble.remove();

        if (retryReply === "__RATE_LIMIT__") {
            // Still rate limited — wait again
            await handleRateLimit(userMessage);
        } else if (retryReply) {
            appendMessage('expert', retryReply);
            chatHistory[currentExpertId].push({ sender: 'expert', text: retryReply });
        }
    }

    async function simulateBotReply(query) {
        typingInd.style.display = 'flex';
        scrollToBottom();
        
        const reply = await sendToGemini(query);
        
        if (reply === "__RATE_LIMIT__") {
            await handleRateLimit(query);
        } else {
            typingInd.style.display = 'none';
            if (reply) {
                appendMessage('expert', reply);
                chatHistory[currentExpertId].push({ sender: 'expert', text: reply });
            }
        }
    }

    window.saveApiKey = function() {
        const key = document.getElementById("geminiKeyInput").value.trim();
        
        // Only check that key is not empty — remove the AIza check
        if (!key || key.length < 10) {
            alert("❌ Please paste a valid API key. Get yours free at aistudio.google.com/app/apikey");
            return;
        }
        
        localStorage.setItem("gemini_api_key", key);
        document.getElementById("apiSetup").style.display = "none";
        
        const successMsg = "✅ FarmBot AI is now activated! I'm powered by Google Gemini. Ask me anything about farming — crops, pests, soil, schemes, market prices, and more! 🌾";
        appendMessage("expert", successMsg);
        chatHistory[currentExpertId].push({ sender: 'expert', text: successMsg });
    };

    window.addEventListener("load", function() {
        if (localStorage.getItem("gemini_api_key")) {
            const setup = document.getElementById("apiSetup");
            if (setup) setup.style.display = "none";
        }
    });

    function simulateHumanReply(exp) {
        if(!exp.isOnline) {
            setTimeout(() => {
                const response = "This expert is currently busy helping other farmers in the field. They will reply to your message as soon as they are available.";
                appendMessage('expert', response);
                chatHistory[currentExpertId].push({ sender: 'expert', text: response });
            }, 500);
            return;
        }

        typingInd.style.display = 'block';
        scrollToBottom();
        
        setTimeout(() => {
            typingInd.style.display = 'none';
            const responses = [
                "I understand. Could you please provide a bit more detail about your crop's current age?",
                "That's a common issue this season. Let me check the recent agricultural guidelines and get back to you shortly.",
                "Can you upload a clear close-up photo of the affected area using the attachment icon?",
                "I recommend applying a standard NPK 19:19:19 spray immediately if the issue persists.",
                "I can help with that. Are you practicing organic or conventional farming?"
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            appendMessage('expert', response);
            chatHistory[currentExpertId].push({ sender: 'expert', text: response });
        }, 2000 + Math.random() * 2000);
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') handleSend();
    });

    // ==========================================
    // VOICE FEATURES: STT, TTS, COMMANDS
    // ==========================================

    const langMap = {
        en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN', te: 'te-IN',
        ta: 'ta-IN', mr: 'mr-IN', pa: 'pa-IN', bn: 'bn-IN'
    };

    const currentLang = localStorage.getItem('farmadvisor_lang') || 'en';
    const speechLang = langMap[currentLang] || 'en-IN';

    // 1. Text-To-Speech (Voice Output)
    const ttsToggleBtn = document.getElementById('tts-toggle');
    let isVoiceEnabled = localStorage.getItem('farmbot_voice_enabled') !== 'false'; // default true
    
    if (ttsToggleBtn) {
        ttsToggleBtn.style.color = isVoiceEnabled ? '#38b000' : '#888';
        ttsToggleBtn.style.background = isVoiceEnabled ? 'rgba(56, 176, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        ttsToggleBtn.addEventListener('click', () => {
            isVoiceEnabled = !isVoiceEnabled;
            localStorage.setItem('farmbot_voice_enabled', isVoiceEnabled);
            ttsToggleBtn.style.color = isVoiceEnabled ? '#38b000' : '#888';
            ttsToggleBtn.style.background = isVoiceEnabled ? 'rgba(56, 176, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            if (!isVoiceEnabled) window.speechSynthesis.cancel();
        });
    }

    window.speakResponse = function(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        // Remove emojis and special formatting for better speech
        let cleanText = text.replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
        cleanText = cleanText.replace(/\*/g, '');
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = speechLang;
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        window.speechSynthesis.speak(utterance);
    };

    window.speakResponseIfEnabled = function(text) {
        if (isVoiceEnabled) {
            window.speakResponse(text);
        }
    };

    // 2. Speech-To-Text (Voice Input)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micTapBtn = document.getElementById('mic-tap');
    const micHoldBtn = document.getElementById('mic-hold');
    const soundWave = document.getElementById('sound-wave');
    
    let recognition = null;
    let isRecording = false;
    let holdTimer = null;
    let isHoldMode = false;
    
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            isRecording = true;
            if (isHoldMode) {
                micHoldBtn.classList.add('mic-active');
            } else {
                micTapBtn.classList.add('mic-active');
            }
            if (soundWave) soundWave.classList.add('active');
            
            // Show placeholder text
            if (!chatInput.value) {
                chatInput.placeholder = isHoldMode ? "🔴 Hold to speak..." : "🔴 Listening... Speak now";
            }
        };

        recognition.onresult = (event) => {
            let interimText = '';
            let finalText = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalText += event.results[i][0].transcript;
                } else {
                    interimText += event.results[i][0].transcript;
                }
            }

            if (finalText) {
                chatInput.value = finalText;
            } else if (interimText) {
                // To show interim text properly, we set it as the value for now.
                chatInput.value = interimText;
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                showVoiceToast("❌ Microphone access denied. Please allow microphone in browser settings.");
            } else if (event.error === 'no-speech') {
                showVoiceToast("🔇 No speech detected. Please try again.");
            }
            stopRecording();
        };

        recognition.onend = () => {
            stopRecording();
            // Voice Command Checks and Auto-Send
            if (chatInput.value) {
                const text = chatInput.value.toLowerCase();
                if (checkVoiceCommands(text)) {
                    // Command matched, do nothing else
                } else if (isHoldMode) {
                    // Auto-send in hold mode
                    handleSend();
                }
            }
        };

        // Tap to Talk Logic
        if (micTapBtn) {
            micTapBtn.addEventListener('click', () => {
                if (isRecording) {
                    stopRecording();
                    if (recognition) recognition.stop();
                } else {
                    isHoldMode = false;
                    chatInput.value = '';
                    recognition.lang = speechLang;
                    recognition.start();
                }
            });
        }

        // Hold to Talk Logic
        if (micHoldBtn) {
            micHoldBtn.addEventListener('mousedown', startHold);
            micHoldBtn.addEventListener('touchstart', startHold);
            
            micHoldBtn.addEventListener('mouseup', stopHold);
            micHoldBtn.addEventListener('mouseleave', stopHold);
            micHoldBtn.addEventListener('touchend', stopHold);
        }
        
    } else {
        if (micTapBtn) micTapBtn.style.display = 'none';
        if (micHoldBtn) micHoldBtn.style.display = 'none';
        showVoiceToast("ℹ️ Voice input not supported in this browser. Use Chrome for best experience.");
    }

    function startHold(e) {
        e.preventDefault();
        if (isRecording) return;
        isHoldMode = true;
        chatInput.value = '';
        recognition.lang = speechLang;
        recognition.start();
    }

    function stopHold(e) {
        if (!isHoldMode || !isRecording) return;
        if (recognition) recognition.stop();
    }

    function stopRecording() {
        isRecording = false;
        if (micTapBtn) micTapBtn.classList.remove('mic-active');
        if (micHoldBtn) micHoldBtn.classList.remove('mic-active');
        if (soundWave) soundWave.classList.remove('active');
        chatInput.placeholder = "Type your farming query here...";
    }

    function showVoiceToast(msg) {
        let toast = document.getElementById('voice-err-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'voice-err-toast';
            toast.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#1B4332; color:white; padding:15px 20px; border-radius:8px; box-shadow:0 10px 15px rgba(0,0,0,0.1); z-index:1000; transition:opacity 0.3s ease;';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 4000);
    }

    // 3. Voice Command Shortcuts
    function checkVoiceCommands(text) {
        if (text.includes("price of tomato") || text.includes("tomato ka bhav") || text.includes("tomato bele")) {
            chatInput.value = "What is the current market price of Tomato in my region?";
            handleSend();
            return true;
        }
        if (text.includes("weather today") || text.includes("aaj ka mausam") || text.includes("inda havamana")) {
            window.location.href = 'weather.html';
            return true;
        }
        if (text.includes("government scheme") || text.includes("sarkari yojana") || text.includes("sarkari yojane")) {
            window.location.href = 'schemes.html';
            return true;
        }
        if (text.includes("market price") || text.includes("mandi bhav") || text.includes("mandi bele")) {
            window.location.href = 'market.html';
            return true;
        }
        return false;
    }

    // 4. Voice Tooltip Onboarding
    window.activateVoiceTooltip = function() {
        const tooltip = document.getElementById('voice-tooltip');
        if (tooltip) tooltip.classList.remove('show');
        localStorage.setItem('voice_tooltip_shown', 'true');
        // Activate mic instantly
        if (micTapBtn) micTapBtn.click();
    };

    window.dismissVoiceTooltip = function() {
        const tooltip = document.getElementById('voice-tooltip');
        if (tooltip) tooltip.classList.remove('show');
        localStorage.setItem('voice_tooltip_shown', 'true');
    };

    if (!localStorage.getItem('voice_tooltip_shown')) {
        setTimeout(() => {
            const tooltip = document.getElementById('voice-tooltip');
            if (tooltip) tooltip.classList.add('show');
        }, 2000);
    }

    // Initialize
    initSidebar();
    renderChat();
});
