document.addEventListener("DOMContentLoaded", () => {
    // Reveal Elements on Scroll using IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12 // Trigger slightly before the element is fully in view
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add show class for general fade-in / slide-up
                entry.target.classList.add('show');

                // Trigger flicker for tech tags
                const techTag = entry.target.querySelector('.tech-tag');
                if (techTag) techTag.classList.add('flicker-show');

                // Counter animation for numbers
                if (entry.target.classList.contains('stat-item')) {
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl && !numberEl.dataset.animated) {
                        animateValue(numberEl);
                    }
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Number counter logic
    function animateValue(obj) {
        const text = obj.innerText;
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        if (isNaN(target)) return;

        let startValue = 0;
        let duration = 1500;
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * target) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
        obj.dataset.animated = true;
    }

    const hiddenElements = document.querySelectorAll('.hidden, section');
    hiddenElements.forEach((el, index) => {
        // Automatically add staggered classes to service cards and category cards
        if (el.classList.contains('service-card') || el.classList.contains('category-card')) {
            const rowPos = (index % 4) + 1;
            el.classList.add(`stagger-${rowPos}`);
        }
        
        // Sections get drawn lines
        if (el.tagName === 'SECTION') {
            el.classList.add('draw-line');
        }

        observer.observe(el);
    });

    // Custom Glowing Cursor Effect
    // Adds a premium subtle light source moving with the mouse
    const cursorGlow = document.querySelector('.cursor-glow');
    
    // Check if device supports hover (ignore on touch devices to save performance)
    if (window.matchMedia("(hover: hover)").matches) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.top = `${e.clientY}px`;
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.transform = `translate(-50%, -50%)`;
            });
        });
    } else {
        // Hide glow cursor on mobile/touch devices
        if (cursorGlow) {
            cursorGlow.style.display = 'none';
        }
    }
});
