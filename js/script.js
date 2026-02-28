// 1. Tailwind Configuration (MUST run before body parses)
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#24920F", 
                "primary-dark": "#1b7a0b", 
                "background-light": "#f9fafb",
                "background-dark": "#1f2937",
                "text-light": "#111827",
                "text-dark": "#f3f4f6",
                "secondary-light": "#ffffff",
                "secondary-dark": "#374151",
                "review-start": "#ffffff",
                "review-end": "#f0fdf4",
                "star": "#FFD700",
            },
            fontFamily: {
                display: ["Tajawal", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.5rem",
                "card": "1rem", 
            },
        },
    },
};

// 2. Main Logic (Waits for DOM Content to load)
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isHidden = mobileMenu.classList.contains('hidden-menu');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => mobileMenu.classList.remove('hidden-menu'), 10);
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('hidden-menu');
            setTimeout(() => mobileMenu.classList.add('hidden'), 300);
            document.body.style.overflow = 'auto';
        }
    };

    hamburgerBtn?.addEventListener('click', toggleMenu);
    closeMenuBtn?.addEventListener('click', toggleMenu);
    menuBackdrop?.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = targetId ? document.getElementById(targetId) : null;
                
                if (targetId === "") {
                     if (!mobileMenu.classList.contains('hidden-menu')) toggleMenu();
                     window.scrollTo({ top: 0, behavior: "smooth" });
                     return;
                }

                if (targetElement) {
                    if (!mobileMenu.classList.contains('hidden-menu')) toggleMenu();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
            }
        });
    });

    const counter = document.getElementById('experience-counter');
    const target = 10;
    const duration = 2000;
    let animated = false;

    const animateCounter = () => {
        if (animated || !counter) return;
        animated = true;
        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            counter.innerText = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(animate);
            else counter.innerText = target;
        };
        requestAnimationFrame(animate);
    };

    // تحسين مراقب الظهور للموبايل
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // جعل القسم يظهر بمجرد رؤية 5% منه فقط لضمان عمله على الشاشات الصغيرة
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.contains(counter)) animateCounter();
                // إيقاف المراقبة بمجرد الظهور لتحسين الأداء
                revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.05, // تم تقليل العتبة من 0.1 إلى 0.05
        rootMargin: '0px 0px -50px 0px' 
    });

    revealElements.forEach(el => revealObserver.observe(el));
});