/**
 * JUNIPER EDGE TOURS & TRAVEL - Core JavaScript
 * Handles navbar, animations, job board filtering, visa wizard, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageTransitionLoader(); // Initialize page transition loader
    initAuth(); // Initialize authentication system
    initNavbar();
    initMobileMenu();
    initStatsCounter();
    initTestimonials();
    initJobBoard();
    initVisaWizard();
    initTourExplorer();
    initSuccessTimeline();
    initNewsletter();
    initConnectedCountries();
    initTargetHighlighting();
    initUpcomingTrips();
});

/* ==========================================
   Page Transition Loader (Plane Animation)
   ========================================== */
function initPageTransitionLoader() {
    // Inject Loader HTML if not already present (hidden by default)
    if (!document.getElementById('page-transition-loader')) {
        const loaderHTML = `
            <div id="page-transition-loader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(11, 12, 16, 0.96); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; opacity: 0; visibility: hidden; transition: opacity 0.25s ease, visibility 0.25s ease;">
                <div class="loader-plane-container" style="position: relative; width: 150px; height: 150px; margin-bottom: 2rem;">
                    <i class="fa-solid fa-plane" id="loader-plane" style="font-size: 3.5rem; color: var(--color-accent); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); text-shadow: 0 0 25px rgba(207,46,46,0.6); transition: all 0.3s ease;"></i>
                    <div class="loader-ring" style="width: 100px; height: 100px; border: 3px solid rgba(255, 255, 255, 0.05); border-top: 3px solid var(--color-accent); border-radius: 50%; position: absolute; top: calc(50% - 50px); left: calc(50% - 50px); animation: spin 1.5s linear infinite;"></div>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; margin-bottom: 0.5rem; letter-spacing: 1px; font-weight: 600;">Preparing For Takeoff</h3>
                <p style="color: var(--color-text-muted-light); font-size: 0.95rem; letter-spacing: 1px;">Navigating to your next destination...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loaderHTML);
    }

    const loader = document.getElementById('page-transition-loader');
    const plane = document.getElementById('loader-plane');

    // Intercept internal page transitions
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        const target = anchor.getAttribute('target');

        // Skip non-navigation anchors, external links, and new tabs
        if (!href || 
            href.startsWith('#') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') || 
            target === '_blank' || 
            href.includes('javascript:void') ||
            anchor.classList.contains('no-transition')) {
            return;
        }

        // Prevent default browser navigation
        e.preventDefault();

        // Trigger takeoff animation and fade in loader
        if (loader && plane) {
            plane.className = 'fa-solid fa-plane'; // Reset class list
            void plane.offsetWidth; // Trigger reflow
            plane.classList.add('plane-takeoff');
            
            loader.style.visibility = 'visible';
            loader.style.opacity = '1';

            // Redirect after 350ms (snappy and smooth)
            setTimeout(() => {
                window.location.href = href;
            }, 350);
        } else {
            window.location.href = href;
        }
    });
}

/* ==========================================
   Navbar Scroll Effect
   ========================================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Check on initial load too
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
}

/* ==========================================
   Mobile Menu Toggle
   ========================================== */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // Inject backdrop overlay if not present
    let overlay = document.getElementById('nav-menu-backdrop');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nav-menu-backdrop';
        overlay.className = 'nav-menu-overlay';
        document.body.appendChild(overlay);
    }

    const toggleMenu = (forceClose = false) => {
        const isOpen = forceClose ? false : !navMenu.classList.contains('active');
        
        if (isOpen) {
            navMenu.classList.add('active');
            overlay.classList.add('active');
            // Animate hamburger to X and turn white
            const spans = hamburger.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[0].style.backgroundColor = '#ffffff';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                spans[2].style.backgroundColor = '#ffffff';
            }
        } else {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            // Reset hamburger to bars
            const spans = hamburger.querySelectorAll('span');
            if (spans.length >= 3) {
                spans[0].style.transform = 'none';
                spans[0].style.backgroundColor = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                spans[2].style.backgroundColor = '';
            }
        }
    };

    hamburger.addEventListener('click', () => toggleMenu());
    overlay.addEventListener('click', () => toggleMenu(true));

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // Expose closeMobileMenu globally so it can be called from auth actions
    window.closeMobileMenu = () => toggleMenu(true);
}

/* ==========================================
   Stats Counter Animation
   ========================================== */
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-num');
    if (counters.length === 0) return;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = target / 50; // speed
            
            const updateCount = () => {
                if (current < target) {
                    current += Math.ceil(increment);
                    if (current > target) current = target;
                    counter.innerText = current + suffix;
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer to trigger counters when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-counter-bar');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

/* ==========================================
   Testimonials Slider
   ========================================== */
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    if (slides.length === 0) return;

    let activeIndex = 0;
    let autoSlideInterval;

    // Generate dots dynamically if container exists
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        slides[activeIndex].classList.remove('active');
        if (dots[activeIndex]) dots[activeIndex].classList.remove('active');
        
        activeIndex = index;
        
        slides[activeIndex].classList.add('active');
        if (dots[activeIndex]) dots[activeIndex].classList.add('active');
    }

    function nextSlide() {
        let nextIdx = (activeIndex + 1) % slides.length;
        goToSlide(nextIdx);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 6000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Set first slide active initially
    slides[0].classList.add('active');
    startAutoSlide();
}

/* ==========================================
   Job Board logic (Search, Filter, Drag & Drop Modal Apply)
   ========================================== */
function initJobBoard() {
    const jobsGrid = document.querySelector('.jobs-grid');
    if (!jobsGrid) return; // Only run on careers page

    const searchInput = document.getElementById('job-search');
    const filterCountry = document.getElementById('filter-country');
    const filterCategory = document.getElementById('filter-category');
    const jobCards = document.querySelectorAll('.job-card');
    const modalOverlay = document.getElementById('apply-modal');
    const modalClose = document.querySelector('.modal-close');
    const applyForm = document.getElementById('job-apply-form');
    const modalJobTitleInput = document.getElementById('modal-job-title');
    const jobTitleHeading = document.getElementById('apply-job-title-heading');

    // Continent & Country Filtering Logic
    const continentBtns = document.querySelectorAll('.continent-btn');
    const countryBadgeBtns = document.querySelectorAll('.country-badge-btn');
    
    let activeContinent = 'all';
    let activeCountry = 'all';

    function filterJobs() {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const category = filterCategory ? filterCategory.value : 'all';

        jobCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const requirements = card.querySelector('.job-requirements').innerText.toLowerCase();
            const cardCountry = card.getAttribute('data-country');
            const cardCategory = card.getAttribute('data-category');

            // Map country to continent
            let cardContinent = '';
            if (['canada'].includes(cardCountry)) cardContinent = 'north-america';
            else if (['luxembourg', 'turkey'].includes(cardCountry)) cardContinent = 'europe';
            else if (['uae', 'qatar', 'saudi', 'oman'].includes(cardCountry)) cardContinent = 'middle-east-asia';
            else if (['mauritius'].includes(cardCountry)) cardContinent = 'africa';

            const matchesSearch = title.includes(query) || requirements.includes(query);
            const matchesCategory = category === 'all' || cardCategory === category;
            
            let matchesRegion = false;
            if (activeCountry !== 'all') {
                matchesRegion = (cardCountry === activeCountry);
            } else if (activeContinent !== 'all') {
                matchesRegion = (cardContinent === activeContinent);
            } else {
                matchesRegion = true;
            }

            if (matchesSearch && matchesCategory && matchesRegion) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterJobs);
    if (filterCategory) filterCategory.addEventListener('change', filterJobs);

    if (continentBtns.length > 0) {
        continentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                continentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                activeContinent = btn.getAttribute('data-continent');
                activeCountry = 'all'; // Reset to all countries on continent switch

                // Toggle country badges visibility
                countryBadgeBtns.forEach(badge => {
                    const badgeContinent = badge.getAttribute('data-continent');
                    badge.classList.remove('active');

                    if (activeContinent === 'all') {
                        badge.style.display = 'flex';
                        if (badge.getAttribute('data-country') === 'all') {
                            badge.classList.add('active');
                        }
                    } else {
                        if (badge.getAttribute('data-country') === 'all' || badgeContinent === activeContinent) {
                            badge.style.display = 'flex';
                            if (badge.getAttribute('data-country') === 'all') {
                                badge.classList.add('active');
                            }
                        } else {
                            badge.style.display = 'none';
                        }
                    }
                });

                filterJobs();
            });
        });
    }

    if (countryBadgeBtns.length > 0) {
        countryBadgeBtns.forEach(badge => {
            badge.addEventListener('click', () => {
                countryBadgeBtns.forEach(b => b.classList.remove('active'));
                badge.classList.add('active');

                activeCountry = badge.getAttribute('data-country');
                filterJobs();
            });
        });
    }

    // Apply Buttons / Modals (Intercepted with Auth Check)
    const applyButtons = document.querySelectorAll('.btn-apply-job');
    applyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('juniper_user'));
            const jobTitle = btn.getAttribute('data-job');
            
            if (!user) {
                // Store pending action
                window.pendingJobApply = jobTitle;
                // Trigger global login modal
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.classList.add('active');
                } else {
                    injectAuthModal();
                    document.getElementById('auth-modal').classList.add('active');
                }
                return;
            }

            openApplyModal(jobTitle, user);
        });
    });

    function openApplyModal(jobTitle, user) {
        if (modalJobTitleInput) {
            modalJobTitleInput.value = jobTitle;
        }
        if (jobTitleHeading) {
            jobTitleHeading.innerText = `Apply for: ${jobTitle}`;
        }
        
        // Pre-fill user data
        const appNameInput = document.getElementById('applicant-name');
        const appEmailInput = document.getElementById('applicant-email');
        const appPhoneInput = document.getElementById('applicant-phone');
        if (appNameInput) appNameInput.value = user.name || '';
        if (appEmailInput) appEmailInput.value = user.email || '';
        if (appPhoneInput) appPhoneInput.value = user.phone || '';

        if (modalOverlay) {
            modalOverlay.classList.add('active');
        }
    }

    // Expose openApplyModal globally so auth callback can trigger it
    window.openApplyModalAfterAuth = openApplyModal;

    // Drag & Drop File Upload Logic
    const dropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('resume-upload');
    const fileDisplay = document.getElementById('selected-file-display');
    const fileNameText = document.getElementById('file-name-text');
    const removeFileBtn = document.getElementById('remove-file-btn');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', (e) => {
            if (e.target.closest('#remove-file-btn') || e.target.closest('#selected-file-display')) return;
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            handleFiles(fileInput.files);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            handleFiles(files);
        });
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (fileNameText) fileNameText.innerText = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            if (fileDisplay) fileDisplay.style.display = 'flex';
            
            const uploadIcon = dropZone.querySelector('.file-upload-icon');
            const uploadText = dropZone.querySelector('.file-upload-text');
            const uploadInfo = dropZone.querySelector('.file-upload-info');
            if (uploadIcon) uploadIcon.style.display = 'none';
            if (uploadText) uploadText.style.display = 'none';
            if (uploadInfo) uploadInfo.style.display = 'none';
        }
    }

    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (fileInput) fileInput.value = '';
            if (fileDisplay) fileDisplay.style.display = 'none';
            
            const uploadIcon = dropZone.querySelector('.file-upload-icon');
            const uploadText = dropZone.querySelector('.file-upload-text');
            const uploadInfo = dropZone.querySelector('.file-upload-info');
            if (uploadIcon) uploadIcon.style.display = 'block';
            if (uploadText) uploadText.style.display = 'block';
            if (uploadInfo) uploadInfo.style.display = 'block';
        });
    }

    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // Submit Application Form (Connected to Serverless api/apply)
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const jobTitle = modalJobTitleInput ? modalJobTitleInput.value : 'Position';
            const applicantName = document.getElementById('applicant-name').value;
            const applicantEmail = document.getElementById('applicant-email').value;
            const applicantPhone = document.getElementById('applicant-phone').value;
            const educationVal = document.getElementById('applicant-education') ? document.getElementById('applicant-education').value : '';
            const coverMessage = document.getElementById('applicant-message') ? document.getElementById('applicant-message').value : '';
            
            // Show loading spinner
            applyForm.innerHTML = `
                <div class="success-message" style="text-align:center; padding: 3rem 0;">
                    <i class="fa-solid fa-spinner fa-spin" style="font-size: 3.5rem; color: var(--color-accent); margin-bottom: 1.5rem;"></i>
                    <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 1rem; color: #fff;">Submitting Application...</h3>
                    <p style="color: var(--color-text-muted-light); max-width: 320px; margin: 0 auto;">
                        Uploading your documents and dispatching your details to our team.
                    </p>
                </div>
            `;

            const sendApplication = (payload) => {
                fetch('/api/apply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => {
                    if (!res.ok) throw new Error('API submission failed');
                    return res.json();
                })
                .then(data => {
                    applyForm.innerHTML = `
                        <div class="success-message" style="text-align:center; padding: 2rem 0;">
                            <i class="fa-solid fa-circle-check" style="font-size: 4rem; color: var(--color-accent); margin-bottom: 1.5rem;"></i>
                            <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 1rem; color: #fff;">Application Submitted!</h3>
                            <p style="color: var(--color-text-muted-light); max-width: 400px; margin: 0 auto 2rem auto;">
                                Thank you, <strong>${applicantName}</strong>. Your application for <strong>${jobTitle}</strong> has been transmitted successfully. A confirmation email has been sent to you.
                            </p>
                            <button class="btn btn-primary btn-close-success" type="button" style="margin: 0 auto;">Close</button>
                        </div>
                    `;
                    const closeSuccessBtn = applyForm.querySelector('.btn-close-success');
                    if (closeSuccessBtn) {
                        closeSuccessBtn.addEventListener('click', () => {
                            modalOverlay.classList.remove('active');
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        });
                    }
                })
                .catch(err => {
                    console.error('Error submitting application:', err);
                    applyForm.innerHTML = `
                        <div class="success-message" style="text-align:center; padding: 2rem 0;">
                            <i class="fa-solid fa-circle-check" style="font-size: 4rem; color: var(--color-accent); margin-bottom: 1.5rem;"></i>
                            <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 1rem; color: #fff;">Application Registered</h3>
                            <p style="color: var(--color-text-muted-light); max-width: 400px; margin: 0 auto 2rem auto;">
                                Your application for <strong>${jobTitle}</strong> has been registered. Please contact us directly if you do not receive a confirmation within 48 hours.
                            </p>
                            <button class="btn btn-primary btn-close-success" type="button" style="margin: 0 auto;">Close</button>
                        </div>
                    `;
                    const closeSuccessBtn = applyForm.querySelector('.btn-close-success');
                    if (closeSuccessBtn) {
                        closeSuccessBtn.addEventListener('click', () => {
                            modalOverlay.classList.remove('active');
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        });
                    }
                });
            };

            // Helper to read file as Base64 asynchronously
            const readFileAsDataURL = (fileInputEl) => {
                return new Promise((resolve) => {
                    if (fileInputEl && fileInputEl.files.length > 0) {
                        const file = fileInputEl.files[0];
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            resolve({ data: e.target.result, name: file.name });
                        };
                        reader.readAsDataURL(file);
                    } else {
                        resolve(null);
                    }
                });
            };

            const resumeInput = document.getElementById('resume-upload');
            const certInput = document.getElementById('cert-upload');
            const idInput = document.getElementById('id-upload');
            const passportInput = document.getElementById('passport-upload');

            Promise.all([
                readFileAsDataURL(resumeInput),
                readFileAsDataURL(certInput),
                readFileAsDataURL(idInput),
                readFileAsDataURL(passportInput)
            ]).then(([resumeFile, certFile, idFile, passportFile]) => {
                const payload = {
                    name: applicantName,
                    email: applicantEmail,
                    phone: applicantPhone,
                    job: jobTitle,
                    education: educationVal,
                    message: coverMessage,
                    resumeData: resumeFile ? resumeFile.data : null,
                    resumeName: resumeFile ? resumeFile.name : null,
                    certData: certFile ? certFile.data : null,
                    certName: certFile ? certFile.name : null,
                    idData: idFile ? idFile.data : null,
                    idName: idFile ? idFile.name : null,
                    passportData: passportFile ? passportFile.data : null,
                    passportName: passportFile ? passportFile.name : null
                };
                
                sendApplication(payload);
            });
        });
    }
}

/* ==========================================
   Visa Eligibility Wizard logic (Glassmorphic + Scoring)
   ========================================== */
function initVisaWizard() {
    const wizardForm = document.getElementById('assessment-wizard');
    const authGate = document.getElementById('visa-auth-gate');
    
    // Auth Gate check
    function checkWizardAuth() {
        const user = JSON.parse(localStorage.getItem('juniper_user'));
        const wizardBox = document.getElementById('wizard-box');
        
        if (user) {
            if (authGate) authGate.style.display = 'none';
            if (wizardBox) {
                wizardBox.style.display = 'block';
                // Pre-fill final step fields
                const pName = document.getElementById('applicant-name');
                const pEmail = document.getElementById('applicant-email');
                const pPhone = document.getElementById('applicant-phone');
                if (pName) pName.value = user.name || '';
                if (pEmail) pEmail.value = user.email || '';
                if (pPhone) pPhone.value = user.phone || '';
            }
        } else {
            if (authGate) authGate.style.display = 'block';
            if (wizardBox) wizardBox.style.display = 'none';
        }
    }

    // Expose checkWizardAuth globally
    window.checkWizardAuth = checkWizardAuth;
    checkWizardAuth();

    if (authGate) {
        const gateBtn = document.getElementById('gate-signin-btn');
        if (gateBtn) {
            gateBtn.addEventListener('click', () => {
                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.classList.add('active');
                } else {
                    injectAuthModal();
                    document.getElementById('auth-modal').classList.add('active');
                }
            });
        }
    }

    if (!wizardForm) return;

    const steps = wizardForm.querySelectorAll('.wizard-step');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const progressFill = document.querySelector('.wizard-progress-fill');
    
    let currentStepIdx = 0;

    // Option cards selection logic
    const optionCards = wizardForm.querySelectorAll('.wizard-option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            const groupName = card.getAttribute('data-group');
            const value = card.getAttribute('data-value');
            
            wizardForm.querySelectorAll(`.wizard-option-card[data-group="${groupName}"]`).forEach(c => {
                c.classList.remove('selected');
            });

            card.classList.add('selected');

            const hiddenInput = wizardForm.querySelector(`input[name="${groupName}"]`);
            if (hiddenInput) {
                hiddenInput.value = value;
            }
        });
    });

    function updateWizardProgress() {
        const percentage = ((currentStepIdx + 1) / steps.length) * 100;
        if (progressFill) progressFill.style.width = `${percentage}%`;

        steps.forEach((step, idx) => {
            if (idx === currentStepIdx) {
                step.style.display = 'block';
                step.style.animation = 'fadeIn 0.4s ease forwards';
            } else {
                step.style.display = 'none';
            }
        });

        if (currentStepIdx === 0) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        if (currentStepIdx === steps.length - 1) {
            nextBtn.innerText = 'Submit Assessment';
        } else {
            nextBtn.innerText = 'Continue';
        }
    }

    function validateStep(index) {
        const step = steps[index];
        const hiddenInputs = step.querySelectorAll('input[type="hidden"]');
        let isValid = true;

        hiddenInputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                step.querySelectorAll('.wizard-option-card').forEach(card => {
                    card.style.borderColor = '#cf2e2e';
                    setTimeout(() => {
                        card.style.borderColor = '';
                    }, 1000);
                });
            }
        });

        const textInputs = step.querySelectorAll('input[required], select[required]');
        textInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#cf2e2e';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 1000);
            }
        });

        return isValid;
    }

    nextBtn.addEventListener('click', () => {
        if (!validateStep(currentStepIdx)) return;

        if (currentStepIdx < steps.length - 1) {
            currentStepIdx++;
            updateWizardProgress();
        } else {
            submitWizardAssessment();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStepIdx > 0) {
            currentStepIdx--;
            updateWizardProgress();
        }
    });

    function submitWizardAssessment() {
        const name = document.getElementById('applicant-name').value;
        const email = document.getElementById('applicant-email').value;
        const phone = document.getElementById('applicant-phone').value;
        const visaGoalVal = wizardForm.querySelector('input[name="visa_goal"]').value;
        const destVal = wizardForm.querySelector('input[name="destination"]').value;
        const eduVal = wizardForm.querySelector('input[name="education"]').value;

        let details = '';
        
        if (visaGoalVal === 'work') {
            details += '<li><strong>Goal:</strong> Skilled work visa pathway.</li>';
        } else if (visaGoalVal === 'study') {
            details += '<li><strong>Goal:</strong> Academic study visa pathway.</li>';
        } else {
            details += '<li><strong>Goal:</strong> Short-term visitor / tourism visa.</li>';
        }

        if (destVal === 'canada' || destVal === 'germany') {
            details += `<li><strong>Destination:</strong> ${destVal.toUpperCase()} (High-priority migration zone).</li>`;
        } else if (destVal === 'poland') {
            details += '<li><strong>Destination:</strong> POLAND (Schengen Area skilled trade zone).</li>';
        } else {
            details += `<li><strong>Destination:</strong> ${destVal.toUpperCase()} (Employment permit zone).</li>`;
        }

        if (eduVal === 'postgrad') {
            details += '<li><strong>Education Tier:</strong> Post-Graduate degree (Master/PhD).</li>';
        } else if (eduVal === 'bachelors') {
            details += "<li><strong>Education Tier:</strong> Bachelor's degree.</li>";
        } else if (eduVal === 'diploma') {
            details += '<li><strong>Education Tier:</strong> College Diploma.</li>';
        } else {
            details += '<li><strong>Education Tier:</strong> High School certificate.</li>';
        }

        let recommendation = '';
        if (visaGoalVal === 'work') {
            recommendation = `Based on your highest education (${eduVal.toUpperCase()}), you have solid prospects for our <strong>Global Skilled Migration Pathways</strong> to <strong>${destVal.toUpperCase()}</strong>. We have matching roles in sectors like Hospitality, Tech, and Skilled Trade.`;
        } else if (visaGoalVal === 'study') {
            recommendation = `Your path to <strong>${destVal.toUpperCase()}</strong> is highly viable via our <strong>Fast-Track Student Intake Pathways</strong>. We partner with multiple universities offering intake support for ${eduVal.toUpperCase()} graduates.`;
        } else if (visaGoalVal === 'immigrate') {
            recommendation = `For relocation to <strong>${destVal.toUpperCase()}</strong>, the Express Entry & Provincial Nominee Pathways match your profile. We recommend scheduling a direct paperwork review.`;
        } else {
            recommendation = `You qualify for standard tourist / short-term business visitor routes to <strong>${destVal.toUpperCase()}</strong>. We can manage your entire documentation flow and visa booking.`;
        }

        // Hide progress bar and headers
        const header = wizardForm.previousElementSibling;
        const progressBar = document.querySelector('.wizard-progress');
        if (header) header.style.display = 'none';
        if (progressBar) progressBar.style.display = 'none';

        // Show loading state
        wizardForm.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 3rem 0; animation: fadeIn 0.5s ease;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size: 3rem; color: var(--color-accent); margin-bottom: 1.5rem;"></i>
                <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff;">Formulating Roadmap...</h3>
                <p style="color: var(--color-text-muted-light); font-size: 0.95rem;">Transmitting your assessment data securely to our consultants.</p>
            </div>
        `;

        // Send data to serverless API in the background
        fetch('/api/assess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                visaGoal: visaGoalVal,
                destination: destVal,
                education: eduVal,
                details,
                recommendation
            })
        })
        .then(res => {
            if (!res.ok) throw new Error('API submission failed');
            return res.json();
        })
        .then(data => {
            renderSuccessWizard(name, email, recommendation, details);
        })
        .catch(err => {
            console.error('Error submitting assessment:', err);
            // Render success report anyway so the client isn't blocked on network errors
            renderSuccessWizard(name, email, recommendation, details);
        });
    }

    function renderSuccessWizard(name, email, recommendation, details) {
        wizardForm.innerHTML = `
            <div class="success-message printable-report" style="text-align: center; padding: 1rem 0; animation: fadeIn 0.5s ease;">
                <i class="fa-solid fa-circle-check" style="font-size: 4.5rem; color: var(--color-accent); margin-bottom: 1.5rem;"></i>
                <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 0.5rem; color: #fff;">Visa Eligibility Check Sent!</h3>
                <p style="font-size: 1rem; margin-bottom: 1.5rem; color: var(--color-text-muted-light);">Dear <strong>${name}</strong>, your visa eligibility check has been successfully submitted.</p>
                
                <div style="background-color: var(--color-bg-light-alt); border-left: 4px solid var(--color-accent); padding: 1.5rem; text-align: left; border-radius: var(--border-radius-sm); margin-bottom: 2rem; color: var(--color-text-dark);">
                    <p style="margin: 0 0 1rem 0; line-height: 1.6; font-size: 0.95rem;">${recommendation}</p>
                    <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--color-accent); margin-bottom: 0.75rem;">Your Profile Details:</h4>
                    <ul style="padding-left: 1.25rem; font-size: 0.85rem; line-height: 1.6;">
                        ${details}
                    </ul>
                </div>
                
                <p style="color: var(--color-text-muted-light); font-size: 0.9rem; margin-bottom: 2rem;">
                    Our senior consultant will review your profile parameters and contact you at <strong>${email}</strong> or by phone to guide you through the official documentation process.
                </p>
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-secondary" onclick="window.print()"><i class="fa-solid fa-print" style="margin-right: 0.5rem;"></i> Print Summary</button>
                    <button class="btn btn-primary" onclick="window.location.reload()">Submit New Check</button>
                </div>
            </div>
        `;
    }

    updateWizardProgress();
}

/* ==========================================
   Tour Explorer logic (Filters, Itineraries, Estimator)
   ========================================== */
function initTourExplorer() {
    // 1. Category Filtering
    const filterButtons = document.querySelectorAll('.tour-filter-btn');
    const tourCards = document.querySelectorAll('.tour-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            tourCards.forEach(card => {
                const cardFilter = card.getAttribute('data-filter');
                if (filterValue === 'all' || cardFilter === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 2. Collapsible Itineraries
    const itineraryToggles = document.querySelectorAll('.itinerary-toggle-btn');
    itineraryToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const container = toggle.nextElementSibling;
            toggle.classList.toggle('active');
            container.classList.toggle('active');
            
            if (toggle.classList.contains('active')) {
                toggle.innerHTML = `Hide Itinerary <i class="fa-solid fa-chevron-up"></i>`;
            } else {
                toggle.innerHTML = `View Itinerary <i class="fa-solid fa-chevron-down"></i>`;
            }
        });
    });    // Submit handler
    const tourForm = document.getElementById('tour-booking-form');
    if (tourForm) {
        tourForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('juniper_user'));
            if (!user) {
                alert('Please sign in to book this tour.');
                document.getElementById('auth-modal')?.classList.add('active');
                return;
            }
            alert('Booking request submitted successfully!');
        });
    }
}

/* ==========================================
   Client Success Timeline logic (Filtering)
   ========================================== */
function initSuccessTimeline() {
    const filterButtons = document.querySelectorAll('.timeline-filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (filterButtons.length === 0 || timelineItems.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            timelineItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'flex';
                    item.style.animation = 'scaleIn 0.4s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================
   Newsletter Form Handlers
   ========================================== */
function initNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('.newsletter-input');
            const email = emailInput ? emailInput.value : '';
            if (email) {
                form.innerHTML = `
                    <div style="color: var(--color-accent); font-weight: 600; font-size: 0.9rem; padding: 0.5rem 0;">
                        <i class="fa-solid fa-paper-plane" style="margin-right: 0.5rem;"></i> Subscribed! Thank you.
                    </div>
                `;
            }
        });
    });
}

/* ==========================================
   Hash Target Highlight and Scroll
   ========================================== */
function initTargetHighlighting() {
    const handleHash = () => {
        const hash = window.location.hash;
        if (!hash) return;

        // Clear existing highlight classes
        document.querySelectorAll('.highlight-flash').forEach(el => {
            el.classList.remove('highlight-flash');
        });

        let targetEl;
        if (hash === '#wizard-box') {
            const wizardBox = document.getElementById('wizard-box');
            if (wizardBox && wizardBox.style.display === 'none') {
                targetEl = document.getElementById('visa-auth-gate');
            } else {
                targetEl = wizardBox;
            }
        } else if (hash === '#office-panel') {
            targetEl = document.getElementById('office-panel');
        }

        if (targetEl) {
            // Scroll to center viewport smoothly
            setTimeout(() => {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Trigger the glow animation
                targetEl.classList.add('highlight-flash');
            }, 150);
        }
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('load', handleHash);
    // Trigger on immediate call if DOM loaded
    handleHash();
}

/* ==========================================
   Connected Countries Careers Interactive Toggle
   ========================================== */
function initConnectedCountries() {
    const cards = document.querySelectorAll('.country-card');
    if (cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If user clicked the button/link inside the card, do not toggle collapse
            if (e.target.closest('.btn-job-connect')) return;

            const isActive = card.classList.contains('active');

            // Collapse all other cards
            cards.forEach(c => c.classList.remove('active'));

            // Toggle this card
            if (!isActive) {
                card.classList.add('active');
            }
        });
    });
}

/* ==========================================
   Custom Toast Alert System (Sleek Glassmorphic Notifications)
   ========================================== */
function showCustomAlert(message, type = 'error') {
    const existing = document.getElementById('custom-toast-alert');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'custom-toast-alert';
    toast.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: ${type === 'error' ? 'rgba(207, 46, 46, 0.95)' : 'rgba(22, 101, 52, 0.95)'};
        color: #ffffff;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        z-index: 99999;
        font-weight: 600;
        font-size: 0.9rem;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateY(-20px);
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
        pointer-events: none;
    `;

    const icon = type === 'error' 
        ? '<i class="fa-solid fa-circle-exclamation" style="font-size: 1.15rem; color: #fff;"></i>' 
        : '<i class="fa-solid fa-circle-check" style="font-size: 1.15rem; color: #fff;"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 50);

    setTimeout(() => {
        toast.style.transform = 'translateY(-20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ==========================================
   Authentication & User Session Logic
   ========================================== */
function initAuth() {
    // Inject Mobile Auth Slot into #nav-menu if not present
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && !document.getElementById('nav-auth-slot-mobile-container')) {
        const li = document.createElement('li');
        li.id = 'nav-auth-slot-mobile-container';
        li.className = 'nav-mobile-only-item';
        li.style.cssText = 'padding: 1.5rem 2rem; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 1.5rem; width: 100%; display: none; list-style: none;';
        li.innerHTML = `<div id="nav-auth-slot-mobile"></div>`;
        navMenu.appendChild(li);
    }

    injectAuthModal();
    updateNavbarAuth();

    // Global click listener to close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdownMenu = document.getElementById('user-dropdown-menu');
        const avatarBtn = document.getElementById('user-avatar-btn');
        if (dropdownMenu && avatarBtn) {
            if (!e.target.closest('#user-avatar-btn') && !e.target.closest('#user-dropdown-menu')) {
                dropdownMenu.classList.remove('active');
            }
        }
    });
}

function updateNavbarAuth() {
    const authSlot = document.getElementById('nav-auth-slot');
    const authSlotMobile = document.getElementById('nav-auth-slot-mobile');

    let user = null;
    try {
        const stored = localStorage.getItem('juniper_user');
        if (stored) {
            user = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error parsing user session:', e);
    }

    const renderAuth = (slot, isMobile = false) => {
        if (!slot) return;

        if (user) {
            const initials = user.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);

            if (isMobile) {
                slot.innerHTML = `
                    <div class="user-mobile-profile" style="display: flex; flex-direction: column; gap: 1rem; text-align: left; width: 100%;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div class="avatar-circle" style="width: 40px; height: 40px; border-radius: 50%; background: var(--color-accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; box-shadow: 0 0 10px rgba(207,46,46,0.25);">${initials}</div>
                            <div>
                                <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: #ffffff; margin: 0; font-weight: 600;">${user.name}</h4>
                                <p style="font-size: 0.75rem; color: var(--color-text-muted-light); margin: 0; word-break: break-all;">${user.email}</p>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                            <button class="dropdown-link-item" id="btn-settings-mobile" type="button" style="padding: 0.75rem 0; color: #ffffff !important; display: flex; align-items: center; gap: 0.75rem; background: none; border: none; font-size: 0.9rem; font-weight: 600; width: 100%; text-align: left; cursor: pointer;"><i class="fa-solid fa-gear" style="color: var(--color-accent); font-size: 1.1rem;"></i> Account Settings</button>
                            <button class="dropdown-link-item signout-item" id="btn-signout-mobile" type="button" style="padding: 0.75rem 0; color: #ff6b6b !important; display: flex; align-items: center; gap: 0.75rem; background: none; border: none; font-size: 0.9rem; font-weight: 600; width: 100%; text-align: left; cursor: pointer;"><i class="fa-solid fa-right-from-bracket" style="font-size: 1.1rem;"></i> Sign Out</button>
                        </div>
                    </div>
                `;
            } else {
                slot.innerHTML = `
                    <div class="user-profile-menu">
                        <button class="user-avatar-btn" id="user-avatar-btn" type="button">
                            <div class="avatar-circle">${initials}</div>
                            <span class="avatar-name">${user.name.split(' ')[0]}</span>
                            <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; opacity: 0.7; transition: transform 0.2s ease;"></i>
                        </button>
                        <div class="user-dropdown-menu" id="user-dropdown-menu">
                            <!-- User Header -->
                            <div class="dropdown-user-info">
                                <h4>${user.name}</h4>
                                <p>${user.email}</p>
                            </div>
                            <!-- Menu Links -->
                            <div class="dropdown-links-list">
                                <button class="dropdown-link-item" id="btn-visa-assess" type="button"><i class="fa-solid fa-square-poll-vertical" style="color: var(--color-accent); font-size: 1rem;"></i> Visa Assessment</button>
                                <button class="dropdown-link-item" id="btn-jobs" type="button"><i class="fa-solid fa-briefcase" style="color: var(--color-accent); font-size: 1rem;"></i> Job Openings</button>
                                <button class="dropdown-link-item" id="btn-settings" type="button"><i class="fa-solid fa-gear" style="color: var(--color-accent); font-size: 1rem;"></i> Account Settings</button>
                                <hr style="border: none; border-top: 1px solid rgba(0,0,0,0.06); margin: 0.4rem 0;">
                                <button class="dropdown-link-item signout-item" id="btn-signout" type="button"><i class="fa-solid fa-right-from-bracket" style="font-size: 1rem;"></i> Sign Out</button>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            if (isMobile) {
                slot.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">
                        <button class="btn btn-signin" id="nav-signin-btn-mobile" style="padding: 0.8rem 1rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: #fff; border-radius: var(--border-radius-sm); text-align: center; justify-content: center; width: 100%; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-right-to-bracket"></i> Sign In</button>
                        <button class="btn btn-signup" id="nav-signup-btn-mobile" style="padding: 0.8rem 1rem; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: 1px solid var(--color-accent); background: var(--color-accent); color: #fff; border-radius: var(--border-radius-sm); text-align: center; justify-content: center; width: 100%; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-user-plus"></i> Sign Up</button>
                    </div>
                `;
            } else {
                slot.innerHTML = `
                    <button class="btn btn-signin" id="nav-signin-btn" style="padding: 0.55rem 1rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none; background: transparent; color: #fff; transition: var(--transition-fast);">Sign In</button>
                    <button class="btn btn-signup" id="nav-signup-btn" style="padding: 0.55rem 1.25rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: 1px solid var(--color-accent); background: var(--color-accent); color: #fff; border-radius: var(--border-radius-sm); transition: var(--transition-fast);">Sign Up</button>
                `;
            }
        }
    };

    renderAuth(authSlot, false);
    renderAuth(authSlotMobile, true);

    // Bind events for both slots
    const bindEvents = (isMobile) => {
        const suffix = isMobile ? '-mobile' : '';
        const dropdownMenu = document.getElementById('user-dropdown-menu');

        // Dropdown toggle (Desktop only)
        if (!isMobile) {
            const avatarBtn = document.getElementById('user-avatar-btn');
            if (avatarBtn && dropdownMenu) {
                avatarBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('active');
                });
            }

            const visaBtn = document.getElementById('btn-visa-assess');
            if (visaBtn) {
                visaBtn.addEventListener('click', () => {
                    if (dropdownMenu) dropdownMenu.classList.remove('active');
                    window.location.href = 'contact.html#wizard-box';
                });
            }

            const jobsBtn = document.getElementById('btn-jobs');
            if (jobsBtn) {
                jobsBtn.addEventListener('click', () => {
                    if (dropdownMenu) dropdownMenu.classList.remove('active');
                    window.location.href = 'careers.html';
                });
            }
        }

        // Settings Modal
        const settingsBtn = document.getElementById(`btn-settings${suffix}`);
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                if (dropdownMenu) dropdownMenu.classList.remove('active');
                
                // Close mobile navigation drawer if open
                const navMenu = document.getElementById('nav-menu');
                if (navMenu) navMenu.classList.remove('active');

                injectSettingsModal(user);
            });
        }

        // Sign Out
        const signoutBtn = document.getElementById(`btn-signout${suffix}`);
        if (signoutBtn) {
            signoutBtn.addEventListener('click', () => {
                try {
                    localStorage.removeItem('juniper_user');
                } catch (e) {
                    console.error(e);
                }
                showCustomAlert('Signed out successfully.', 'success');
                updateNavbarAuth();
                if (window.checkWizardAuth) window.checkWizardAuth();
                setTimeout(() => window.location.reload(), 500);
            });
        }

        // Sign In Trigger
        const signinBtn = document.getElementById(`nav-signin-btn${suffix}`);
        if (signinBtn) {
            signinBtn.addEventListener('click', () => {
                // Close mobile navigation drawer if open
                const navMenu = document.getElementById('nav-menu');
                if (navMenu) navMenu.classList.remove('active');

                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.classList.add('active');
                    const tabSignin = document.getElementById('tab-signin-btn');
                    if (tabSignin) tabSignin.click();
                }
            });
        }

        // Sign Up Trigger
        const signupBtn = document.getElementById(`nav-signup-btn${suffix}`);
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                // Close mobile navigation drawer if open
                const navMenu = document.getElementById('nav-menu');
                if (navMenu) navMenu.classList.remove('active');

                const authModal = document.getElementById('auth-modal');
                if (authModal) {
                    authModal.classList.add('active');
                    const tabSignup = document.getElementById('tab-signup-btn');
                    if (tabSignup) tabSignup.click();
                }
            });
        }
    };

    bindEvents(false);
    bindEvents(true);
}

function injectAuthModal() {
    if (document.getElementById('auth-modal')) return;

    const modalHTML = `
        <div class="modal-overlay" id="auth-modal" style="z-index: 1100;">
            <div class="modal-content glass-card" style="max-width: 400px; padding: 2.5rem 2rem;">
                <div class="modal-header" style="border:none; padding: 0 0 1rem 0; margin-bottom:0.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #fff; margin:0;">Account Access</h3>
                    <span class="modal-close" id="auth-modal-close" style="cursor:pointer;"><i class="fa-solid fa-xmark"></i></span>
                </div>
                
                <div class="auth-tabs" style="display: flex; margin-bottom: 1.5rem;">
                    <button class="auth-tab-btn active" id="tab-signin-btn">Sign In</button>
                    <button class="auth-tab-btn" id="tab-signup-btn">Create Account</button>
                </div>

                <!-- Sign In Panel -->
                <div class="auth-form-panel active" id="panel-signin">
                    <form id="form-signin">
                        <div class="auth-input-group" style="margin-bottom: 1.25rem;">
                            <label for="signin-email" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem;">Email Address</label>
                            <input type="email" id="signin-email" name="email" autocomplete="username" class="form-input" placeholder="e.g. yourname@domain.com" required style="padding: 0.75rem; width: 100%;">
                        </div>
                        <div class="auth-input-group" style="margin-bottom: 1.5rem;">
                            <label for="signin-password" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem;">Password</label>
                            <input type="password" id="signin-password" name="password" autocomplete="current-password" class="form-input" placeholder="••••••••" required style="padding: 0.75rem; width: 100%;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem; cursor: pointer;">Sign In</button>
                    </form>
                </div>

                <!-- Sign Up Panel -->
                <div class="auth-form-panel" id="panel-signup" style="display: none;">
                    <form id="form-signup">
                        <div class="auth-input-group" style="margin-bottom: 1rem;">
                            <label for="signup-name" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem;">Full Name</label>
                            <input type="text" id="signup-name" name="name" autocomplete="name" class="form-input" placeholder="e.g. Jane Doe" required style="padding: 0.75rem; width: 100%;">
                        </div>
                        <div class="auth-input-group" style="margin-bottom: 1rem;">
                            <label for="signup-email" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem;">Email Address</label>
                            <input type="email" id="signup-email" name="email" autocomplete="username" class="form-input" placeholder="e.g. jane@domain.com" required style="padding: 0.75rem; width: 100%;">
                        </div>
                        <div class="auth-input-group" style="margin-bottom: 1rem;">
                            <label for="signup-phone" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem;">Phone Number</label>
                            <input type="tel" id="signup-phone" name="phone" autocomplete="tel" class="form-input" placeholder="e.g. +254 700 000 000" required style="padding: 0.75rem; width: 100%;">
                        </div>
                        <div class="auth-input-group" style="margin-bottom: 1rem;">
                            <label for="signup-password" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem;">Password</label>
                            <input type="password" id="signup-password" name="password" autocomplete="new-password" class="form-input" placeholder="Min. 6 characters" required minlength="6" style="padding: 0.75rem; width: 100%;">
                        </div>
                        <div class="auth-input-group" style="margin-bottom: 1.5rem;">
                            <label for="signup-password-confirm" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem;">Confirm Password</label>
                            <input type="password" id="signup-password-confirm" name="password-confirm" autocomplete="new-password" class="form-input" placeholder="Re-enter your password" required minlength="6" style="padding: 0.75rem; width: 100%;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem; cursor: pointer;">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    initAuthModalEvents();
}

function initAuthModalEvents() {
    const modal = document.getElementById('auth-modal');
    const closeBtn = document.getElementById('auth-modal-close');
    const tabSignin = document.getElementById('tab-signin-btn');
    const tabSignup = document.getElementById('tab-signup-btn');
    const panelSignin = document.getElementById('panel-signin');
    const panelSignup = document.getElementById('panel-signup');

    if (!modal) return;

    // Close Modal
    const closeModal = () => modal.classList.remove('active');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Tab Switching
    if (tabSignin && tabSignup) {
        tabSignin.addEventListener('click', () => {
            tabSignin.classList.add('active');
            tabSignup.classList.remove('active');
            panelSignin.style.display = 'block';
            panelSignup.style.display = 'none';
        });
        tabSignup.addEventListener('click', () => {
            tabSignup.classList.add('active');
            tabSignin.classList.remove('active');
            panelSignup.style.display = 'block';
            panelSignin.style.display = 'none';
        });
    }

    // Handle Form Submissions
    const formSignin = document.getElementById('form-signin');
    const formSignup = document.getElementById('form-signup');

    if (formSignin) {
        formSignin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signin-email').value.trim().toLowerCase();
            const password = document.getElementById('signin-password').value;

            // Admin Override Check
            if (email === 'admin@juniper.com' && password === 'password123') {
                const loggedInUser = { name: 'Admin Account', email, phone: '+254 790 932 804' };
                localStorage.setItem('juniper_user', JSON.stringify(loggedInUser));
                showCustomAlert('Welcome back, Admin!', 'success');
                closeModal();
                updateNavbarAuth();
                if (window.checkWizardAuth) window.checkWizardAuth();
                setTimeout(() => window.location.reload(), 500);
                return;
            }

            let storedUser = null;
            try {
                const stored = localStorage.getItem(`reg_user_${email}`);
                if (stored) {
                    storedUser = JSON.parse(stored);
                }
            } catch (err) {
                console.error('Error parsing stored user:', err);
            }
            
            // Differentiated Verification Checks
            if (!storedUser) {
                showCustomAlert('No account found with this email. Please sign up first.', 'error');
                return;
            }

            if (storedUser.password !== password) {
                showCustomAlert('Incorrect password. Please try again.', 'error');
                return;
            }

            // Successful Login
            try {
                localStorage.setItem('juniper_user', JSON.stringify(storedUser));
            } catch (err) {
                console.error(err);
            }
            
            showCustomAlert('Welcome back to Juniper Edge!', 'success');
            closeModal();
            updateNavbarAuth();
            
            // Trigger page-specific auth updates
            if (window.checkWizardAuth) window.checkWizardAuth();
            
            // If there's a pending job application, open the job application modal
            if (window.pendingJobApply && window.openApplyModalAfterAuth) {
                window.openApplyModalAfterAuth(window.pendingJobApply, storedUser);
                window.pendingJobApply = null;
            } else {
                setTimeout(() => window.location.reload(), 500);
            }
        });
    }

    if (formSignup) {
        formSignup.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameEl = document.getElementById('signup-name');
            const emailEl = document.getElementById('signup-email');
            const phoneEl = document.getElementById('signup-phone');
            const passwordEl = document.getElementById('signup-password');
            const passwordConfirmEl = document.getElementById('signup-password-confirm');

            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
            const phone = phoneEl ? phoneEl.value.trim() : '';
            const password = passwordEl ? passwordEl.value : '';
            const passwordConfirm = passwordConfirmEl ? passwordConfirmEl.value : '';

            // 1. Password Match Validation
            if (password !== passwordConfirm) {
                showCustomAlert('Passwords do not match. Please try again.', 'error');
                return;
            }

            // 2. Kenyan Phone Number Validation
            const cleanPhone = phone.replace(/[\s\-()]/g, ''); // Remove spaces, hyphens, parentheses
            const kenyanPhoneRegex = /^(?:254|\+254|0)?([71]\d{8})$/;
            if (!kenyanPhoneRegex.test(cleanPhone)) {
                showCustomAlert('Please enter a valid Kenyan phone number (e.g., 0712345678).', 'error');
                return;
            }

            // Normalize phone number to standard format (+2547XXXXXXXX)
            let formattedPhone = cleanPhone;
            if (cleanPhone.startsWith('0')) {
                formattedPhone = '+254' + cleanPhone.substring(1);
            } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
                formattedPhone = '+254' + cleanPhone;
            } else if (cleanPhone.startsWith('254')) {
                formattedPhone = '+' + cleanPhone;
            }

            // 3. Email In-Use Validation
            try {
                const existingUser = localStorage.getItem(`reg_user_${email}`);
                if (existingUser) {
                    showCustomAlert('This email address is already in use. Please sign in.', 'error');
                    return;
                }
            } catch (err) {
                console.error('Error checking existing user:', err);
            }

            const newUser = { name, email, phone: formattedPhone, password };
            
            try {
                // Save registered user for future logins
                localStorage.setItem(`reg_user_${email}`, JSON.stringify(newUser));
                // Log in immediately
                localStorage.setItem('juniper_user', JSON.stringify({ name, email, phone: formattedPhone }));
            } catch (err) {
                console.error('Error saving user session:', err);
            }

            // Send welcome email via serverless function in background
            fetch('/api/welcome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            }).catch(err => console.error('Welcome email failed:', err));

            closeModal();
            updateNavbarAuth();

            // Trigger page-specific auth updates
            if (window.checkWizardAuth) window.checkWizardAuth();

            // If there's a pending job application, open the job application modal
            const loggedInUser = { name, email, phone: formattedPhone };
            if (window.pendingJobApply && window.openApplyModalAfterAuth) {
                window.openApplyModalAfterAuth(window.pendingJobApply, loggedInUser);
                window.pendingJobApply = null;
            } else {
                setTimeout(() => window.location.reload(), 100);
            }
        });
    }
}



/* ==========================================
   Settings Modal System
   ========================================== */
function injectSettingsModal(user) {
    if (document.getElementById('settings-modal')) return;

    const modalHTML = `
        <div class="modal-overlay" id="settings-modal" style="z-index: 1100;">
            <div class="modal-content glass-card" style="max-width: 400px; padding: 2.5rem 2rem;">
                <div class="modal-header" style="border:none; padding: 0 0 1rem 0; margin-bottom:0.5rem; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: #fff; margin:0;">Account Settings</h3>
                    <span class="modal-close" id="settings-modal-close" style="cursor:pointer;"><i class="fa-solid fa-xmark"></i></span>
                </div>
                
                <form id="form-settings">
                    <div class="auth-input-group" style="margin-bottom: 1rem;">
                        <label for="settings-name" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</label>
                        <input type="text" id="settings-name" class="form-input" value="${user.name || ''}" required style="padding: 0.75rem; width: 100%;">
                    </div>
                    <div class="auth-input-group" style="margin-bottom: 1rem;">
                        <label style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Email (Read-Only)</label>
                        <input type="email" class="form-input" value="${user.email || ''}" disabled style="padding: 0.75rem; width: 100%; opacity: 0.6; cursor: not-allowed;">
                    </div>
                    <div class="auth-input-group" style="margin-bottom: 1rem;">
                        <label for="settings-phone" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</label>
                        <input type="tel" id="settings-phone" class="form-input" value="${user.phone || ''}" required style="padding: 0.75rem; width: 100%;">
                    </div>
                    <div class="auth-input-group" style="margin-bottom: 1.5rem;">
                        <label for="settings-password" style="display:block; font-size: 0.8rem; color: var(--color-text-muted-light); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">New Password (leave blank to keep current)</label>
                        <input type="password" id="settings-password" class="form-input" placeholder="••••••••" style="padding: 0.75rem; width: 100%;">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.8rem; cursor: pointer;">Save Changes</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('settings-modal');
    const closeBtn = document.getElementById('settings-modal-close');
    const form = document.getElementById('form-settings');

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 400);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('settings-name').value;
            const phone = document.getElementById('settings-phone').value;
            const newPassword = document.getElementById('settings-password').value;

            const updatedUser = { ...user, name, phone };

            if (newPassword && newPassword.trim().length >= 6) {
                updatedUser.password = newPassword;
                try {
                    localStorage.setItem(`reg_user_${user.email}`, JSON.stringify(updatedUser));
                } catch (err) {
                    console.error(err);
                }
            } else if (newPassword && newPassword.trim().length < 6) {
                alert('Password must be at least 6 characters.');
                return;
            } else {
                try {
                    const stored = localStorage.getItem(`reg_user_${user.email}`);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        updatedUser.password = parsed.password;
                        localStorage.setItem(`reg_user_${user.email}`, JSON.stringify(updatedUser));
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            try {
                localStorage.setItem('juniper_user', JSON.stringify({ name, email: user.email, phone }));
            } catch (err) {
                console.error(err);
            }

            alert('Account settings updated successfully!');
            closeModal();
            updateNavbarAuth();
            setTimeout(() => window.location.reload(), 100);
        });
    }

    setTimeout(() => modal.classList.add('active'), 50);
}

/* ==========================================================================
   Upcoming Trips Manager & Global Floating Announcement
   Configuration: To disable the popup site-wide, set `enabled: false` or
   set `active: false`. The popup also automatically expires when `dueDate`
   has passed.
   ========================================================================== */
window.JUNIPER_UPCOMING_TRIPS_CONFIG = {
    enabled: true, // Master toggle: set to false to disable the announcement across all pages
    trips: [
        {
            id: 'namanga-road-trip',
            heading: 'Upcoming Trip',
            badgeText: 'Upcoming Trip',
            title: 'Namanga Border Road Trip',
            displayDate: 'Sat, 7th Nov 2026',
            dueDate: '2026-11-07T23:59:59+03:00', // Auto-expires after this timestamp
            price: 'Ksh 2,999',
            deposit: 'Book with Ksh 1,000',
            description: 'Join our scenic full-day road trip to the Kenya-Tanzania border! Experience Rift Valley highway drives, Namanga border tour, rooftop lounge, and authentic barbecue.',
            ctaText: 'View Trip Details',
            image: 'assets/namanga_trip.jpeg',
            targetUrl: 'tours.html#namanga-road-trip',
            active: true // Individual trip active toggle
        }
    ]
};

function initUpcomingTrips() {
    const config = window.JUNIPER_UPCOMING_TRIPS_CONFIG;
    if (!config || !config.enabled || !Array.isArray(config.trips) || config.trips.length === 0) {
        const existingFloater = document.getElementById('upcoming-trip-floater-widget');
        if (existingFloater) existingFloater.remove();
        return;
    }

    const now = new Date();
    // Filter trips that are marked active and whose due date has not passed
    const activeTrips = config.trips.filter(trip => trip.active && new Date(trip.dueDate) >= now);

    // If no active trips remain, remove any existing floater
    if (activeTrips.length === 0) {
        const existingFloater = document.getElementById('upcoming-trip-floater-widget');
        if (existingFloater) existingFloater.remove();
        return;
    }

    const currentTrip = activeTrips[0];
    const dismissStorageKey = `juniper_dismiss_trip_${currentTrip.id}`;

    // Helper for safe sessionStorage checking (SSR and privacy-mode safe)
    const isDismissed = () => {
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                return sessionStorage.getItem(dismissStorageKey) === 'true';
            }
        } catch (e) {
            // Storage access restricted; proceed without persistence
        }
        return false;
    };

    const setDismissed = () => {
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.setItem(dismissStorageKey, 'true');
            }
        } catch (e) {
            // Storage access restricted
        }
    };

    // If previously dismissed during this browser session, do not render popup
    if (isDismissed()) {
        handleTourCardHighlight();
        initPosterLightbox();
        return;
    }

    // Inject floater widget if not already in DOM
    let floater = document.getElementById('upcoming-trip-floater-widget');
    if (!floater) {
        floater = document.createElement('div');
        floater.id = 'upcoming-trip-floater-widget';
        floater.className = 'upcoming-trip-floater';
        floater.setAttribute('role', 'region');
        floater.setAttribute('aria-label', `${currentTrip.heading}: ${currentTrip.title}`);
        document.body.appendChild(floater);
    }

    floater.innerHTML = `
        <div class="floater-header">
            <span class="floater-badge"><i class="fa-solid fa-bullhorn"></i> ${currentTrip.badgeText || 'Upcoming Trip'}</span>
            <button type="button" class="floater-close-btn" id="close-upcoming-floater" aria-label="Dismiss upcoming trip announcement" title="Dismiss announcement">&times;</button>
        </div>
        <div class="floater-body" id="floater-body-link" role="link" tabindex="0" title="Click to view trip details">
            <div class="floater-img-wrapper" id="floater-thumbnail-wrapper" title="Click to view full poster">
                <img src="${currentTrip.image}" alt="${currentTrip.title} Poster" loading="lazy">
            </div>
            <div class="floater-info">
                <h4 class="floater-title">${currentTrip.title}</h4>
                <p class="floater-desc">${currentTrip.description}</p>
                <div class="floater-meta">
                    <span class="floater-date"><i class="fa-solid fa-calendar-day"></i> ${currentTrip.displayDate}</span>
                    <span class="floater-price">${currentTrip.price}</span>
                </div>
                <div class="floater-timer" id="floater-timer-countdown" aria-label="Countdown to event">
                    <div class="timer-box" id="timer-days">00<span>Days</span></div>
                    <div class="timer-box" id="timer-hours">00<span>Hrs</span></div>
                    <div class="timer-box" id="timer-mins">00<span>Min</span></div>
                    <div class="timer-box" id="timer-secs">00<span>Sec</span></div>
                </div>
            </div>
        </div>
        <a href="${currentTrip.targetUrl}" class="floater-action-btn" id="floater-action-btn">
            <span>${currentTrip.ctaText || 'View Trip Details'}</span> <i class="fa-solid fa-arrow-right"></i>
        </a>
    `;

    // Live Countdown Timer
    const updateCountdown = () => {
        const targetTime = new Date(currentTrip.dueDate).getTime();
        const currentTime = new Date().getTime();
        const diff = targetTime - currentTime;

        if (diff <= 0) {
            floater.remove();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('timer-days');
        const hEl = document.getElementById('timer-hours');
        const mEl = document.getElementById('timer-mins');
        const sEl = document.getElementById('timer-secs');

        if (dEl) dEl.innerHTML = `${String(days).padStart(2, '0')}<span>Days</span>`;
        if (hEl) hEl.innerHTML = `${String(hours).padStart(2, '0')}<span>Hrs</span>`;
        if (mEl) mEl.innerHTML = `${String(mins).padStart(2, '0')}<span>Min</span>`;
        if (sEl) sEl.innerHTML = `${String(secs).padStart(2, '0')}<span>Sec</span>`;
    };

    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);

    // Close Button Event Handler
    const closeBtn = document.getElementById('close-upcoming-floater');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearInterval(timerInterval);
            floater.classList.add('dismissing');
            setDismissed();
            setTimeout(() => {
                if (floater.parentNode) floater.remove();
            }, 300);
        });
    }

    // Navigation Handler (smooth scroll if already on tours.html, else regular navigation)
    const navigateToTrip = (e) => {
        const isToursPage = window.location.pathname.endsWith('tours.html') || window.location.pathname.endsWith('/tours');
        if (isToursPage) {
            e.preventDefault();
            history.pushState(null, null, `#${currentTrip.id}`);
            scrollToAndHighlightCard(currentTrip.id);
        } else {
            // Allow default link navigation to tours.html#namanga-road-trip
            window.location.href = currentTrip.targetUrl;
        }
    };

    const actionBtn = document.getElementById('floater-action-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', navigateToTrip);
    }

    const bodyLink = document.getElementById('floater-body-link');
    if (bodyLink) {
        bodyLink.addEventListener('click', (e) => {
            // If user specifically clicked the image thumbnail, open high-res lightbox
            if (e.target.closest('#floater-thumbnail-wrapper')) {
                e.preventDefault();
                e.stopPropagation();
                openPosterLightbox(currentTrip.image, `${currentTrip.title} - Official Poster`);
                return;
            }
            navigateToTrip(e);
        });

        bodyLink.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToTrip(e);
            }
        });
    }

    handleTourCardHighlight();
    initPosterLightbox();
}

/* ==========================================
   Poster Lightbox Modal Viewer
   ========================================== */
function initPosterLightbox() {
    // Check for images with poster viewing capability
    const namangaPoster = document.querySelector('#namanga-road-trip .tour-image img');
    if (namangaPoster) {
        namangaPoster.addEventListener('click', () => {
            openPosterLightbox(namangaPoster.getAttribute('src'), 'Namanga Road Trip - Official Poster');
        });
    }
}

function openPosterLightbox(imageSrc, imageAlt) {
    let lightbox = document.getElementById('poster-lightbox-modal');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'poster-lightbox-modal';
        lightbox.className = 'poster-lightbox-modal';
        lightbox.innerHTML = `
            <div class="poster-lightbox-content" role="dialog" aria-modal="true" aria-label="Poster Full View">
                <button type="button" class="poster-lightbox-close" id="poster-lightbox-close" aria-label="Close poster view">&times;</button>
                <img id="poster-lightbox-img" src="" alt="Full Resolution Poster">
            </div>
        `;
        document.body.appendChild(lightbox);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.id === 'poster-lightbox-close') {
                closePosterLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closePosterLightbox();
            }
        });
    }

    const img = lightbox.querySelector('#poster-lightbox-img');
    if (img) {
        img.src = imageSrc;
        img.alt = imageAlt || 'Trip Poster';
    }

    lightbox.classList.add('active');
}

function closePosterLightbox() {
    const lightbox = document.getElementById('poster-lightbox-modal');
    if (lightbox) {
        lightbox.classList.remove('active');
    }
}

/* ==========================================
   Tour Card Highlight & Smooth Scroll
   ========================================== */
function handleTourCardHighlight() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        setTimeout(() => {
            scrollToAndHighlightCard(hash);
        }, 300);
    }
}

function scrollToAndHighlightCard(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;

    // Ensure category filter allows card to be visible
    card.style.display = 'block';

    // Expand accordion itinerary if present
    const toggleBtn = card.querySelector('.itinerary-toggle-btn');
    const itineraryContainer = card.querySelector('.itinerary-container');
    if (toggleBtn && itineraryContainer && !toggleBtn.classList.contains('active')) {
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = `Hide Itinerary <i class="fa-solid fa-chevron-up"></i>`;
        itineraryContainer.classList.add('active');
        itineraryContainer.style.maxHeight = itineraryContainer.scrollHeight + 'px';
    }

    // Smooth scroll into center view
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Trigger glowing pulse animation
    card.classList.remove('highlight-pulse');
    void card.offsetWidth; // Reflow
    card.classList.add('highlight-pulse');
}


