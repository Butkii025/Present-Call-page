/**
 * Present Call - Enterprise AI Attendance Management System
 * Interactive Frontend Engine with Adaptive Responsive & Device-Aware System
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SCROLL REVEAL OBSERVER
    // ==========================================
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.feature-card, .flow-step, .tech-card, .summary-card');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    const styleTag = document.createElement('style');
    styleTag.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleTag);

    // ==========================================
    // 2. LIVE DATE & TIME DISPLAY
    // ==========================================
    const liveDateEl = document.getElementById('liveDashboardDate');
    if (liveDateEl) {
        const updateDate = () => {
            const now = new Date();
            const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            liveDateEl.textContent = now.toLocaleDateString('en-US', options);
        };
        updateDate();
        setInterval(updateDate, 30000);
    }

    // ==========================================
    // 3. TOAST NOTIFICATION SYSTEM (Section 8 & 14)
    // ==========================================
    const toastContainer = document.getElementById('toastContainer');
    window.showToast = function(message, type = 'success') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        } else {
            iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <div class="toast-body">${message}</div>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        `;

        toastContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

        const closeBtn = toast.querySelector('.toast-close');
        const removeToast = () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        };

        closeBtn.addEventListener('click', removeToast);
        setTimeout(removeToast, 4000);
    };

    // ==========================================
    // 4. SAAS PORTAL TABS SWITCHER & MOBILE SIDEBAR (Section 2 & 5)
    // ==========================================
    const saasSidebar = document.getElementById('saasSidebar');
    const saasSidebarToggle = document.getElementById('saasSidebarToggle');
    const saasSidebarClose = document.getElementById('saasSidebarClose');
    const saasSidebarBackdrop = document.getElementById('saasSidebarBackdrop');
    const sidebarLinks = document.querySelectorAll('.saas-sidebar .sidebar-link[data-view]');
    const dashboardViews = document.querySelectorAll('.dashboard-view');
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

    const viewTitles = {
        'overview': 'Executive Overview',
        'attendance': 'Attendance Records & Roster',
        'ai-camera': 'AI Face Biometric Studio',
        'voice-id': 'Voice Biometric Roll-Call',
        'students': 'Enrolled Students Directory',
        'settings': 'Platform & AI Settings'
    };

    const openSaasSidebar = () => {
        if (saasSidebar) saasSidebar.classList.add('mobile-open');
        if (saasSidebarBackdrop) saasSidebarBackdrop.classList.add('active');
        document.body.classList.add('dashboard-menu-open');
    };

    const closeSaasSidebar = () => {
        if (saasSidebar) saasSidebar.classList.remove('mobile-open');
        if (saasSidebarBackdrop) saasSidebarBackdrop.classList.remove('active');
        document.body.classList.remove('dashboard-menu-open');
    };

    if (saasSidebarToggle) {
        saasSidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            openSaasSidebar();
        });
    }

    if (saasSidebarClose) {
        saasSidebarClose.addEventListener('click', closeSaasSidebar);
    }

    if (saasSidebarBackdrop) {
        saasSidebarBackdrop.addEventListener('click', closeSaasSidebar);
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = link.getAttribute('data-view');
            
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            dashboardViews.forEach(view => {
                if (view.id === `view-${targetView}`) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });

            if (breadcrumbCurrent && viewTitles[targetView]) {
                breadcrumbCurrent.textContent = viewTitles[targetView];
            }

            // Trigger AI camera canvas init if switching to camera view
            if (targetView === 'ai-camera') {
                initAiCameraSimulation();
            } else if (targetView === 'voice-id') {
                initVoiceVisualizer();
            }

            // Close mobile sidebar drawer after selection
            closeSaasSidebar();
        });
    });

    // ==========================================
    // 5. ATTENDANCE TABLE SEARCH & FILTERING (Section 5)
    // ==========================================
    const searchInput = document.getElementById('tableSearchInput');
    const statusFilter = document.getElementById('statusFilter');
    const attendanceTbody = document.getElementById('attendanceTableBody');
    const emptyState = document.getElementById('tableEmptyState');

    function filterAttendanceTable() {
        if (!attendanceTbody) return;
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
        const selectedStatus = (statusFilter ? statusFilter.value : 'all').toLowerCase();
        const rows = attendanceTbody.querySelectorAll('tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const name = (row.getAttribute('data-name') || '').toLowerCase();
            const id = (row.getAttribute('data-id') || '').toLowerCase();
            const status = (row.getAttribute('data-status') || '').toLowerCase();

            const matchesSearch = !query || name.includes(query) || id.includes(query);
            const matchesStatus = (selectedStatus === 'all') || (status === selectedStatus);

            if (matchesSearch && matchesStatus) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterAttendanceTable);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAttendanceTable);
    }

    // ==========================================
    // 6. CSV EXPORT FUNCTIONALITY (Section 5)
    // ==========================================
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            if (!attendanceTbody) return;
            const rows = attendanceTbody.querySelectorAll('tr');
            let csvContent = 'Student Name,Student ID,Course,Date,Check-In,Check-Out,Status,AI Confidence\n';

            rows.forEach(row => {
                if (row.style.display !== 'none') {
                    const name = row.getAttribute('data-name') || '';
                    const id = row.getAttribute('data-id') || '';
                    const course = row.querySelector('.course-col') ? row.querySelector('.course-col').textContent.trim() : 'CS-401';
                    const date = row.querySelector('.date-col') ? row.querySelector('.date-col').textContent.trim() : 'Today';
                    const checkin = row.querySelector('.checkin-col') ? row.querySelector('.checkin-col').textContent.trim() : '--';
                    const checkout = row.querySelector('.checkout-col') ? row.querySelector('.checkout-col').textContent.trim() : '--';
                    const status = row.getAttribute('data-status') || 'Present';
                    const confidence = row.querySelector('.confidence-val') ? row.querySelector('.confidence-val').textContent.trim() : '99.4%';

                    csvContent += `"${name}","${id}","${course}","${date}","${checkin}","${checkout}","${status}","${confidence}"\n`;
                }
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `PresentCall_Attendance_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('✓ Attendance report exported successfully as CSV', 'success');
        });
    }

    // ==========================================
    // 7. AI ATTENDANCE CAMERA STUDIO (Section 7)
    // ==========================================
    let cameraSimInitialized = false;
    let cameraStream = null;
    const videoEl = document.getElementById('webcamVideo');
    const simCanvas = document.getElementById('simulatedCameraCanvas');
    const toggleWebcamBtn = document.getElementById('toggleWebcamBtn');
    const markAttendanceBtn = document.getElementById('markAttendanceBtn');
    const aiStatusBadge = document.getElementById('aiStatusBadge');
    const hudTarget = document.getElementById('hudFaceTarget');
    const hudTag = document.getElementById('hudIdTag');

    function initAiCameraSimulation() {
        if (cameraSimInitialized || !simCanvas) return;
        cameraSimInitialized = true;
        const ctx = simCanvas.getContext('2d');
        let width = simCanvas.width = simCanvas.offsetWidth || 600;
        let height = simCanvas.height = simCanvas.offsetHeight || 420;

        window.addEventListener('resize', () => {
            if (simCanvas && (!videoEl || videoEl.style.display !== 'block')) {
                width = simCanvas.width = simCanvas.offsetWidth || 600;
                height = simCanvas.height = simCanvas.offsetHeight || 420;
            }
        });

        // Particle nodes simulating biometric feature points
        const points = [];
        const numPoints = 28;
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: width * 0.35 + Math.random() * (width * 0.3),
                y: height * 0.25 + Math.random() * (height * 0.45),
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                size: 2 + Math.random() * 2
            });
        }

        function drawAiGrid() {
            if (videoEl && videoEl.style.display === 'block') {
                requestAnimationFrame(drawAiGrid);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            // Subtle dark background with gradient
            const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 2);
            grad.addColorStop(0, '#101c42');
            grad.addColorStop(1, '#070d1e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // Geometric telemetry grid
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Simulated silhouette head wireframe
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(width / 2, height * 0.48, Math.min(85, width * 0.2), Math.min(115, height * 0.28), 0, 0, Math.PI * 2);
            ctx.stroke();

            // Connect nearest nodes
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
            ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
            points.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                // Restrict to face area
                const dx = p.x - (width / 2);
                const dy = p.y - (height * 0.48);
                if (Math.hypot(dx, dy) > Math.min(95, width * 0.22)) {
                    p.vx *= -1;
                    p.vy *= -1;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                for (let j = idx + 1; j < points.length; j++) {
                    const p2 = points[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 55) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(drawAiGrid);
        }

        drawAiGrid();
    }

    // Toggle Real Webcam vs Simulator
    if (toggleWebcamBtn && videoEl) {
        toggleWebcamBtn.addEventListener('click', async () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                cameraStream = null;
                videoEl.style.display = 'none';
                if (simCanvas) simCanvas.style.display = 'block';
                toggleWebcamBtn.innerHTML = `<span class="icon"><svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></span><span>Enable Webcam</span>`;
                showToast('Switched to AI Biometric Simulator', 'info');
            } else {
                try {
                    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
                    videoEl.srcObject = cameraStream;
                    videoEl.play();
                    videoEl.style.display = 'block';
                    if (simCanvas) simCanvas.style.display = 'none';
                    toggleWebcamBtn.innerHTML = `<span class="icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg></span><span>Stop Webcam</span>`;
                    showToast('Live camera feed connected to AI Vision Pipeline', 'success');
                } catch (err) {
                    showToast('Camera permission denied or camera not available. Using AI Biometric Simulator.', 'info');
                }
            }
        });
    }

    // Full Verification Lifecycle on "Mark Attendance"
    if (markAttendanceBtn) {
        let isProcessing = false;
        markAttendanceBtn.addEventListener('click', () => {
            if (isProcessing) return;
            isProcessing = true;
            markAttendanceBtn.disabled = true;
            markAttendanceBtn.innerHTML = `<span class="icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle></svg></span><span>Scanning Face...</span>`;

            if (aiStatusBadge) aiStatusBadge.textContent = 'Analyzing Facial Geometry...';
            if (hudTarget) hudTarget.classList.remove('target-verified');
            if (hudTag) {
                hudTag.classList.remove('tag-verified');
                hudTag.innerHTML = `<span>●</span> Scanning Biometrics...`;
            }

            // Step 1: Feature Extraction
            setTimeout(() => {
                if (aiStatusBadge) aiStatusBadge.textContent = 'Extracting 68 Facial Landmarks...';
                if (hudTag) hudTag.innerHTML = `<span>⚡</span> Matching Supabase Vector Embeddings...`;
            }, 700);

            // Step 2: Verification Confirmed
            setTimeout(() => {
                if (hudTarget) hudTarget.classList.add('target-verified');
                if (hudTag) {
                    hudTag.classList.add('tag-verified');
                    hudTag.innerHTML = `<span>✓</span> Verified: Priyanshu Vijay (99.8% Match)`;
                }
                if (aiStatusBadge) aiStatusBadge.textContent = 'Biometric Identity Confirmed ✓';
                showToast('✓ Attendance verified and marked for Priyanshu Vijay (ID: CS2026-001)', 'success');

                // Update summary card counter if present
                const presentCountEl = document.getElementById('countPresentToday');
                if (presentCountEl) {
                    const current = parseInt(presentCountEl.textContent, 10) || 392;
                    presentCountEl.textContent = current + 1;
                }

                // Add to recent activity stream
                const activityStream = document.getElementById('activityStreamList');
                if (activityStream) {
                    const newItem = document.createElement('div');
                    newItem.className = 'activity-item';
                    newItem.innerHTML = `
                        <div class="activity-avatar" style="background:#ecfdf5; color:#059669;">PV</div>
                        <div class="activity-details">
                            <div class="activity-name verification-name" title="Priyanshu Vijay">Priyanshu Vijay</div>
                            <div class="activity-meta">
                                <span class="activity-subtag">AI Verified</span>
                                <span>&bull;</span>
                                <span>CS-401</span>
                                <span>&bull;</span>
                                <span>Just now</span>
                                <span>&bull;</span>
                                <span class="activity-method">FaceID (99.8%)</span>
                            </div>
                        </div>
                        <span class="activity-badge badge-present">&check; Present</span>
                    `;
                    activityStream.prepend(newItem);
                }

                markAttendanceBtn.disabled = false;
                markAttendanceBtn.innerHTML = `<span class="icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></span><span>Attendance Marked!</span>`;

                setTimeout(() => {
                    markAttendanceBtn.innerHTML = `<span class="icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></span><span>Mark Attendance</span>`;
                    isProcessing = false;
                }, 2500);
            }, 1800);
        });
    }

    // ==========================================
    // 8. VOICE BIOMETRICS AUDIO VISUALIZER
    // ==========================================
    let voiceVisualizerInit = false;
    function initVoiceVisualizer() {
        const canvas = document.getElementById('voiceWaveformCanvas');
        if (!canvas || voiceVisualizerInit) return;
        voiceVisualizerInit = true;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth || 300;
        let height = canvas.height = canvas.offsetHeight || 60;
        let step = 0;

        window.addEventListener('resize', () => {
            if (canvas) {
                width = canvas.width = canvas.offsetWidth || 300;
                height = canvas.height = canvas.offsetHeight || 60;
            }
        });

        function renderWave() {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();

            const sliceWidth = width / 40;
            let x = 0;
            for (let i = 0; i < 40; i++) {
                const v = Math.sin((i * 0.4) + step) * Math.cos((i * 0.2) + (step * 0.8));
                const y = (height / 2) + (v * (height * 0.35));
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            ctx.stroke();
            step += 0.08;
            requestAnimationFrame(renderWave);
        }
        renderWave();
    }

    // ==========================================
    // 9. SCREENSHOT LIGHTBOX MODAL (Section 8)
    // ==========================================
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    const flowImages = document.querySelectorAll('.flow-image img');
    flowImages.forEach(img => {
        img.addEventListener('click', () => {
            if (lightboxModal && lightboxImg) {
                lightboxImg.src = img.src;
                if (lightboxCaption) lightboxCaption.textContent = img.alt || 'Present Call Screenshot';
                lightboxModal.classList.add('active');
            }
        });
    });

    if (lightboxClose && lightboxModal) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 10. MAIN TOP NAVBAR MOBILE DRAWER
    // ==========================================
    const navToggle = document.getElementById('navMobileToggle');
    const navClose = document.getElementById('navMobileClose');
    const navLinks = document.getElementById('mainNavLinks');
    const navBackdrop = document.getElementById('navBackdrop');

    const openNavMenu = () => {
        if (navLinks) navLinks.classList.add('mobile-open');
        if (navBackdrop) navBackdrop.classList.add('active');
        if (navToggle) {
            navToggle.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Close navigation menu');
        }
        document.body.classList.add('nav-menu-open');
    };

    const closeNavMenu = () => {
        if (navLinks) navLinks.classList.remove('mobile-open');
        if (navBackdrop) navBackdrop.classList.remove('active');
        if (navToggle) {
            navToggle.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open navigation menu');
        }
        document.body.classList.remove('nav-menu-open');
    };

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks && navLinks.classList.contains('mobile-open')) {
                closeNavMenu();
            } else {
                openNavMenu();
            }
        });
    }

    if (navClose) {
        navClose.addEventListener('click', closeNavMenu);
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeNavMenu);
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', closeNavMenu);
        });
    }

    // Global ESC Key Handler for Modals and Drawers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxModal && lightboxModal.classList.contains('active')) {
                lightboxModal.classList.remove('active');
            }
            closeNavMenu();
            closeSaasSidebar();
        }
    });

    // ==========================================
    // 11. DEVICE-AWARE BACK TO TOP SYSTEM (Sections 11 - 16)
    // ==========================================
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        let isScrollThrottled = false;
        const scrollThreshold = 350;

        const updateBackToTopState = () => {
            const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            
            if (currentScrollY > scrollThreshold) {
                if (!backToTopBtn.classList.contains('visible')) {
                    backToTopBtn.classList.add('visible');
                    backToTopBtn.setAttribute('aria-hidden', 'false');
                    backToTopBtn.setAttribute('tabindex', '0');
                }
            } else {
                if (backToTopBtn.classList.contains('visible')) {
                    backToTopBtn.classList.remove('visible');
                    backToTopBtn.setAttribute('aria-hidden', 'true');
                    backToTopBtn.setAttribute('tabindex', '-1');
                }
            }
            isScrollThrottled = false;
        };

        // Passive scroll listener with requestAnimationFrame throttling for 60fps performance
        window.addEventListener('scroll', () => {
            if (!isScrollThrottled) {
                window.requestAnimationFrame(updateBackToTopState);
                isScrollThrottled = true;
            }
        }, { passive: true });

        // Click handler: smooth scroll back to top with reduced motion respect
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            // Cleanly blur button so focus ring doesn't stick
            backToTopBtn.blur();
        });

        // Initial check on load
        updateBackToTopState();
    }

    console.log('Present Call Enhanced Responsive Engine & Back-to-Top System Initialized');
});
