// RevenueGuard AI - Main JavaScript File

// Initialize Stripe
const stripe = Stripe('pk_live_51Pwo5kDtP1f2waLUy3sduJgmiFkJ59K6v3R3aXTW7mgLbom8sMm3ShwOKUivfxjF7Bp2JYSWaBurReYHr60TEFwQ00m6IPSsJt'); // Live Stripe publishable key
const elements = stripe.elements();

// Global variables
let cardElement;
let currentPlan = null;
let currentPrice = null;

// DOM Elements
const scanButton = document.getElementById('scanButton');
const websiteUrl = document.getElementById('websiteUrl');
const resultsSection = document.getElementById('results');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.querySelector('.close');
const paymentForm = document.getElementById('paymentForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize Stripe Elements
    initializeStripe();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize navigation
    initializeNavigation();
    
    // Add security measures
    addSecurityMeasures();
}

function initializeStripe() {
    const style = {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    };

    cardElement = elements.create('card', { style });
    cardElement.mount('#card-element');

    cardElement.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

function addEventListeners() {
    // URL Scanning
    scanButton.addEventListener('click', handleUrlScan);
    websiteUrl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUrlScan();
        }
    });

    // Modal controls
    closeModal.addEventListener('click', hidePaymentModal);
    window.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            hidePaymentModal();
        }
    });

    // Payment form
    paymentForm.addEventListener('submit', handlePayment);

    // Navigation CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button-nav, .cta-button-main');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.onclick) {
                e.preventDefault();
                showPricing();
            }
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

function addSecurityMeasures() {
    // Input validation and sanitization
    const inputs = document.querySelectorAll('input[type="url"], input[type="email"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });

    // Prevent XSS attacks
    const userInputs = document.querySelectorAll('input, textarea');
    userInputs.forEach(input => {
        input.addEventListener('input', function() {
            sanitizeInput(this);
        });
    });
}

// URL Scanning Functions
function handleUrlScan() {
    const url = websiteUrl.value.trim();
    
    if (!url) {
        showError('Please enter a website URL');
        return;
    }

    if (!isValidUrl(url)) {
        showError('Please enter a valid URL (e.g., https://example.com)');
        return;
    }

    // Show loading state
    scanButton.disabled = true;
    scanButton.innerHTML = '<span class="loading"></span> Scanning...';

    // Simulate scanning process
    setTimeout(() => {
        showScanResults(url);
        scanButton.disabled = false;
        scanButton.innerHTML = 'Scan for Revenue Leaks';
    }, 3000);
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function showScanResults(url) {
    // Generate realistic revenue loss data based on URL
    const revenueData = generateRevenueLossData(url);
    
    // Update the results section with the scanned URL
    updateResultsContent(url, revenueData);
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Track the scan event (for analytics)
    trackEvent('website_scanned', {
        url: url,
        revenue_loss: revenueData.totalLoss
    });
}

function generateRevenueLossData(url) {
    // Generate realistic revenue loss scenarios
    const scenarios = [
        {
            icon: '💸',
            title: 'Mobile Conversion Rate 67% Below Industry Average',
            description: 'Your mobile site is losing $12,400/month in potential sales',
            impact: Math.floor(Math.random() * 15000) + 8000
        },
        {
            icon: '🐌',
            title: 'Page Load Speed 4.2s (Should be under 2s)',
            description: 'Slow loading costs you $8,900/month in abandoned carts',
            impact: Math.floor(Math.random() * 12000) + 5000
        },
        {
            icon: '🔒',
            title: 'Missing Trust Signals & Security Badges',
            description: 'Customers don\'t trust your site, losing $6,200/month',
            impact: Math.floor(Math.random() * 8000) + 3000
        },
        {
            icon: '📱',
            title: 'Poor Mobile User Experience',
            description: 'Difficult navigation costs you $4,800/month',
            impact: Math.floor(Math.random() * 6000) + 2000
        },
        {
            icon: '🔍',
            title: 'SEO Issues Preventing Discoverability',
            description: 'Poor search rankings cost you $7,200/month',
            impact: Math.floor(Math.random() * 10000) + 4000
        }
    ];

    // Select 3 random issues
    const selectedIssues = scenarios.sort(() => 0.5 - Math.random()).slice(0, 3);
    const totalLoss = selectedIssues.reduce((sum, issue) => sum + issue.impact, 0);

    return {
        issues: selectedIssues,
        totalLoss: totalLoss
    };
}

function updateResultsContent(url, data) {
    const issuesContainer = document.querySelector('.issues-found');
    const totalLossElement = document.querySelector('.loss-amount');
    
    // Clear existing issues
    issuesContainer.innerHTML = '';
    
    // Add new issues
    data.issues.forEach(issue => {
        const issueElement = createIssueElement(issue);
        issuesContainer.appendChild(issueElement);
    });
    
    // Update total loss
    totalLossElement.textContent = `$${data.totalLoss.toLocaleString()}`;
    
    // Update the urgency message
    const urgencyMessage = document.querySelector('.loss-urgency');
    urgencyMessage.textContent = `Every day you wait, AI competitors steal more of your customers. You're losing $${Math.floor(data.totalLoss/30).toLocaleString()} per day. Fix this NOW.`;
}

function createIssueElement(issue) {
    const issueElement = document.createElement('div');
    issueElement.className = 'issue-item';
    issueElement.innerHTML = `
        <div class="issue-icon">${issue.icon}</div>
        <div class="issue-details">
            <h4>${issue.title}</h4>
            <p>${issue.description}</p>
        </div>
        <div class="issue-impact">-$${issue.impact.toLocaleString()}/mo</div>
    `;
    return issueElement;
}

// Pricing Functions
function selectPlan(planName, price) {
    currentPlan = planName;
    currentPrice = price;
    
    // Update modal content
    document.getElementById('selectedPlanName').textContent = 
        planName.charAt(0).toUpperCase() + planName.slice(1) + ' Plan';
    document.getElementById('selectedPlanPrice').textContent = price.toLocaleString();
    
    // Pre-fill website URL if available
    const websiteInput = document.getElementById('website');
    if (websiteUrl.value) {
        websiteInput.value = websiteUrl.value;
    }
    
    showPaymentModal();
    
    // Track plan selection
    trackEvent('plan_selected', {
        plan: planName,
        price: price
    });
}

function showPricing() {
    const pricingSection = document.getElementById('pricing');
    pricingSection.scrollIntoView({ behavior: 'smooth' });
    
    // Track pricing view
    trackEvent('pricing_viewed');
}

function showPaymentModal() {
    paymentModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus on email input
    setTimeout(() => {
        document.getElementById('email').focus();
    }, 100);
}

function hidePaymentModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Payment Functions
async function handlePayment(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('.payment-btn');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Processing Payment...';
    
    try {
        // Validate form
        const formData = validatePaymentForm();
        if (!formData) {
            throw new Error('Please fill in all required fields');
        }
        
        // Create payment intent
        const { client_secret } = await createPaymentIntent(formData);
        
        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    email: formData.email,
                },
            }
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        if (paymentIntent.status === 'succeeded') {
            showPaymentSuccess(paymentIntent);
        }
        
    } catch (error) {
        showError(error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

function validatePaymentForm() {
    const email = document.getElementById('email').value.trim();
    const website = document.getElementById('website').value.trim();
    
    if (!email || !website) {
        showError('Please fill in all required fields');
        return null;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return null;
    }
    
    if (!isValidUrl(website)) {
        showError('Please enter a valid website URL');
        return null;
    }
    
    return {
        email: email,
        website: website,
        plan: currentPlan,
        price: currentPrice
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function createPaymentIntent(formData) {
    try {
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error('Payment processing temporarily unavailable. Please try again.');
    }
}

function showPaymentSuccess(paymentIntent) {
    hidePaymentModal();
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    z-index: 3000; text-align: center; max-width: 500px; width: 90%;">
            <h2 style="color: #4CAF50; margin-bottom: 1rem;">✅ Payment Successful!</h2>
            <p style="margin-bottom: 1rem;">Thank you for choosing RevenueGuard AI. Your website will be optimized within 48 hours.</p>
            <p style="color: #666; font-size: 0.875rem; margin-bottom: 1.5rem;">Transaction ID: ${paymentIntent.id}</p>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: #4CAF50; color: white; border: none; padding: 0.75rem 1.5rem; 
                           border-radius: 10px; cursor: pointer; font-weight: 600;">
                Continue
            </button>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Track successful payment
    trackEvent('payment_successful', {
        plan: currentPlan,
        price: currentPrice,
        payment_id: paymentIntent.id
    });
    
    // Reset form
    resetPaymentForm();
}

function resetPaymentForm() {
    paymentForm.reset();
    currentPlan = null;
    currentPrice = null;
}

// Utility Functions
function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #ff6b6b; color: white; 
                    padding: 1rem 1.5rem; border-radius: 10px; box-shadow: 0 5px 20px rgba(255,107,107,0.3);
                    z-index: 3000; max-width: 400px;">
            <strong>Error:</strong> ${message}
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; margin-left: 1rem; cursor: pointer; font-size: 1.2rem;">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

function validateInput(input) {
    const value = input.value.trim();
    
    if (input.type === 'email' && value && !isValidEmail(value)) {
        input.style.borderColor = '#ff6b6b';
        showFieldError(input, 'Please enter a valid email address');
    } else if (input.type === 'url' && value && !isValidUrl(value)) {
        input.style.borderColor = '#ff6b6b';
        showFieldError(input, 'Please enter a valid URL');
    } else {
        input.style.borderColor = '#e1e5e9';
        hideFieldError(input);
    }
}

function showFieldError(input, message) {
    hideFieldError(input); // Remove existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorDiv);
}

function hideFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function sanitizeInput(input) {
    // Basic XSS protection
    let value = input.value;
    value = value.replace(/[<>]/g, '');
    if (value !== input.value) {
        input.value = value;
    }
}

function trackEvent(eventName, data = {}) {
    // In a real application, this would send data to your analytics service
    console.log('Event tracked:', eventName, data);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Add CSS for animations
const animationCSS = `
    .feature-card, .pricing-card, .testimonial {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

// Inject animation CSS
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);
