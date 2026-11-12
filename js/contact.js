document.addEventListener('DOMContentLoaded', () => {

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Check if curr is already active
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(el => el.classList.remove('active'));
            
            // Toggle current
            if(!isActive) {
                item.classList.add('active');
            }
        });
    });

});
