// Simple client-side AI assistant (standalone file)
(function(){
    const assistantTemplates = [
        "Hi, I’m interested in viewing available properties. Please send details and availability.",
        "Hello, I need a quote for delivery of construction materials to my site. Please advise.",
        "Hi, I found a listing I like. Can you connect me with the landlord or schedule a viewing?",
        "Hello, I want to rent a house. What documents do I need and what's the application process?",
        "Hi, I need urgent assistance with repairs at my rented property. Please advise next steps."
    ];

    function debounce(fn, wait) {
        let t;
        return function(...args) {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        }
    }

    function suggestReplies(input) {
        const text = (input || '').toLowerCase();
        if (!text.trim()) return assistantTemplates.slice(0, 3);
        const keywords = ['price','rent','delivery','view','visit','repair','urgent','documents','quote','availability'];
        const scored = assistantTemplates.map(t => {
            let score = 0;
            keywords.forEach(k => { if (t.toLowerCase().includes(k)) score += 1; if (text.includes(k)) score += 2; });
            return {t, score};
        });
        scored.sort((a,b)=>b.score-a.score);
        const top = scored.filter(s=>s.score>0).map(s=>s.t);
        return (top.length ? top : assistantTemplates).slice(0,3);
    }

    function renderAssistantSuggestions(suggestions) {
        const container = document.getElementById('assistant-suggestions');
        if (!container) return;
        container.innerHTML = '';
        suggestions.forEach(s => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'list-group-item list-group-item-action';
            item.textContent = s;
            item.addEventListener('click', ()=> {
                const textarea = document.getElementById('message-content');
                if (!textarea) return;
                textarea.value = textarea.value ? textarea.value + "\n\n" + s : s;
                textarea.focus();
            });
            container.appendChild(item);
        });
    }

    function onAssistantAsk() {
        const textarea = document.getElementById('message-content');
        const input = textarea ? textarea.value : '';
        const suggestions = suggestReplies(input);
        renderAssistantSuggestions(suggestions);
    }

    window.addEventListener('DOMContentLoaded', () => {
        const page = document.documentElement.dataset.page;
        if (page !== 'message') return;
        const askBtn = document.getElementById('assistant-ask');
        if (askBtn) askBtn.addEventListener('click', onAssistantAsk);
        const textarea = document.getElementById('message-content');
        if (textarea) {
            textarea.addEventListener('input', debounce(() => {
                const s = suggestReplies(textarea.value);
                renderAssistantSuggestions(s);
            }, 300));
        }
    });
})();
