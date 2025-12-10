// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Character count for textarea
const textarea = document.getElementById('userInput');
const charCount = document.getElementById('charCount');

textarea.addEventListener('input', function() {
    const length = this.value.length;
    const maxLength = this.getAttribute('maxlength');
    charCount.textContent = `${length}/${maxLength}`;
    
    // Change color when approaching limit
    if (length > maxLength * 0.9) {
        charCount.style.color = '#ef4444';
        charCount.style.fontWeight = 'bold';
    } else {
        charCount.style.color = '#64748b';
        charCount.style.fontWeight = 'normal';
    }
});

// Clear text function
function clearText() {
    textarea.value = '';
    charCount.textContent = `0/500`;
    textarea.focus();
    
    // Reset results section
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('visible');
    
    // Reset results
    document.getElementById('moodDisplay').textContent = '--';
    document.getElementById('scoreDisplay').textContent = '--';
    document.getElementById('moodBar').style.width = '0%';
    document.getElementById('keywordsDisplay').innerHTML = '<span class="placeholder">Keywords will appear here...</span>';
    document.getElementById('insightTip').classList.add('hidden');
}

// Mood color mapping
const moodColors = {
    'Positive': '#10b981',
    'Negative': '#ef4444',
    'Neutral': '#64748b',
    'Mixed': '#f59e0b'
};

// Mood icons mapping
const moodIcons = {
    'Positive': 'fas fa-smile-beam',
    'Negative': 'fas fa-frown',
    'Neutral': 'fas fa-meh',
    'Mixed': 'fas fa-surprise'
};

// Tips based on sentiment
const sentimentTips = {
    'Positive': "Your text shows positive sentiment! Keep spreading positivity.",
    'Negative': "Consider rephrasing to use more positive language for better engagement.",
    'Neutral': "Your text is balanced. Consider adding more emotional language for impact.",
    'Mixed': "Your text shows mixed emotions. Consider clarifying your main message."
};

// Simulate AI analysis (replace with actual API call)
async function simulateAnalysis(text) {
    // This is a mock function - replace with actual API call
    return new Promise(resolve => {
        setTimeout(() => {
            // Simple sentiment detection logic (mock)
            const positiveWords = ['love', 'great', 'awesome', 'fantastic', 'happy', 'good', 'excellent', 'amazing'];
            const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'sad', 'poor', 'horrible', 'worst'];
            
            let positiveCount = 0;
            let negativeCount = 0;
            
            const words = text.toLowerCase().split(/\s+/);
            
            words.forEach(word => {
                if (positiveWords.includes(word)) positiveCount++;
                if (negativeWords.includes(word)) negativeCount++;
            });
            
            let mood;
            let score;
            
            if (positiveCount > negativeCount) {
                mood = 'Positive';
                score = Math.min(90 + Math.floor(Math.random() * 10), 100);
            } else if (negativeCount > positiveCount) {
                mood = 'Negative';
                score = Math.min(85 + Math.floor(Math.random() * 15), 100);
            } else {
                mood = 'Neutral';
                score = Math.floor(Math.random() * 30) + 50;
            }
            
            // Add some randomness for "Mixed"
            if (positiveCount > 0 && negativeCount > 0 && Math.random() > 0.7) {
                mood = 'Mixed';
                score = Math.floor(Math.random() * 30) + 60;
            }
            
            // Extract keywords (mock)
            const allKeywords = ['emotional', 'experience', 'product', 'service', 'feeling', 'quality', 'result', 'outcome'];
            const keywords = [];
            
            for (let i = 0; i < Math.min(3, allKeywords.length); i++) {
                const randomIndex = Math.floor(Math.random() * allKeywords.length);
                keywords.push(allKeywords[randomIndex]);
            }
            
            resolve({
                mood,
                score,
                keywords: [...new Set(keywords)] // Remove duplicates
            });
        }, 1500); // Simulate API delay
    });
}

// Main analysis function
async function analyzeText() {
    const input = textarea.value.trim();
    const btn = document.getElementById('analyzeBtn');
    const btnText = btn.querySelector('.btn-text');
    const spinner = document.getElementById('spinner');
    const resultSection = document.getElementById('resultSection');
    const moodDisplay = document.getElementById('moodDisplay');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const moodBar = document.getElementById('moodBar');
    const keywordsDisplay = document.getElementById('keywordsDisplay');
    const insightTip = document.getElementById('insightTip');
    const tipText = document.getElementById('tipText');

    if (!input) {
        // Show error animation
        textarea.style.borderColor = '#ef4444';
        textarea.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            textarea.style.animation = '';
        }, 500);
        
        return;
    }

    // UI Loading State
    btn.disabled = true;
    btnText.textContent = "Analyzing...";
    spinner.classList.remove('hidden');
    
    try {
        // Show results section with animation
        resultSection.style.display = 'block';
        resultSection.classList.add('visible');
        
        // Mock API call - Replace this with your actual API endpoint
        // const response = await fetch('/analyze', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ text: input })
        // });
        // const data = await response.json();
        
        // Using mock data for demo
        const data = await simulateAnalysis(input);

        // Update UI with Data
        moodDisplay.textContent = data.mood;
        moodDisplay.style.color = moodColors[data.mood] || '#1e293b';
        
        // Update mood icon
        const moodIcon = document.querySelector('.mood-card .card-icon i');
        moodIcon.className = moodIcons[data.mood] || 'fas fa-smile';
        
        // Update score with animation
        animateValue(scoreDisplay, 0, data.score, 1000);
        
        // Animate mood bar
        moodBar.style.width = `${data.score}%`;
        
        // Update keywords
        keywordsDisplay.innerHTML = '';
        if (data.keywords && data.keywords.length > 0) {
            data.keywords.forEach(keyword => {
                const keywordEl = document.createElement('span');
                keywordEl.className = 'keyword';
                keywordEl.textContent = keyword;
                keywordsDisplay.appendChild(keywordEl);
            });
        } else {
            keywordsDisplay.innerHTML = '<span class="placeholder">No keywords detected</span>';
        }
        
        // Show insight tip
        tipText.textContent = sentimentTips[data.mood] || "Analysis complete.";
        insightTip.classList.remove('hidden');
        
    } catch (error) {
        console.error("Error:", error);
        
        // Show error state
        moodDisplay.textContent = "Error";
        moodDisplay.style.color = '#ef4444';
        scoreDisplay.textContent = "0";
        moodBar.style.width = '0%';
        keywordsDisplay.innerHTML = '<span class="placeholder">Failed to analyze text</span>';
        
        tipText.textContent = "An error occurred during analysis. Please try again.";
        insightTip.classList.remove('hidden');
        
    } finally {
        // Reset Button
        btn.disabled = false;
        btnText.textContent = "Analyze Sentiment";
        spinner.classList.add('hidden');
    }
}

// Helper function to animate number values
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === end) {
            clearInterval(timer);
            element.textContent = end;
        }
    }, stepTime);
}

// Add shake animation for error
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);