document.addEventListener('DOMContentLoaded', () => {
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });


    
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.log("Autoplay was prevented by browser:", error);
        });
    }

    
    // Access control for profile.html
    if (window.location.pathname.includes('profile.html')) {
        const user = localStorage.getItem('visionease_user');
        if (!user) {
            alert('Please login to access your profile.');
            window.location.href = 'login.html';
            return;
        }
    }

    let cart = JSON.parse(localStorage.getItem('visionease_cart')) || [];

    function updateCartCount() {
        const user = JSON.parse(localStorage.getItem('visionease_user'));
        const navRight = document.querySelector('.nav > div:last-child');
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (navRight) {
            if (user) {
                // User is logged in: show Cart and Profile
                navRight.innerHTML = `
                    <a href="cart.html" class="nav-btn" style="border:none;">CART (${totalQty})</a>
                    <a href="profile.html" class="nav-btn" style="background:var(--white); color:var(--navy);">PROFILE</a>
                `;
            } else {
                // User is not logged in: show Cart, Login, Signup
                navRight.innerHTML = `
                    <a href="cart.html" class="nav-btn" style="border:none;">CART (${totalQty})</a>
                    <a href="login.html" class="nav-btn">LOGIN</a>
                    <a href="signup.html" class="nav-btn" style="background:var(--white); color:var(--navy);">SIGNUP</a>
                `;
            }
        }
    }

    function addToCart(name, price, image) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }
        localStorage.setItem('visionease_cart', JSON.stringify(cart));
        updateCartCount();
        
        
        const buttons = document.querySelectorAll('.view-btn');
        buttons.forEach(btn => {
            const gridItem = btn.closest('.grid-item');
            if (gridItem) {
                const gridName = gridItem.querySelector('h3').textContent;
                if (gridName === name && btn.textContent === 'ADD TO CART') {
                    btn.textContent = 'ADDED!';
                    btn.style.background = 'var(--sage)';
                    btn.style.color = '#fff';
                    setTimeout(() => {
                        btn.textContent = 'ADD TO CART';
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 2000);
                }
            }
        });
    }

    document.querySelectorAll('.view-btn').forEach(btn => {
        if (btn.textContent === 'ADD TO CART') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const gridItem = btn.closest('.grid-item');
                if (gridItem) {
                    const name = gridItem.querySelector('h3').textContent;
                    const priceText = gridItem.querySelector('p').textContent;
                    const price = parseFloat(priceText.replace(/[₹$,\s]/g, ''));
                    const img = gridItem.querySelector('img');
                    
                    
                    let computedFilter = 'none';
                    if (img.style.filter) {
                        computedFilter = img.style.filter;
                    }

                    const imageStyle = computedFilter !== 'none' ? `filter:${computedFilter};` : '';
                    const image = img.src;
                    
                    cart.push({ name, price, image, quantity: 1, style: imageStyle });
                    
                    cart.pop();
                    
                    
                    
                    
                    const existingItem = cart.find(item => item.name === name);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({ name, price, image, quantity: 1, style: imageStyle });
                    }
                    localStorage.setItem('visionease_cart', JSON.stringify(cart));
                    updateCartCount();
                    
                    btn.textContent = 'ADDED!';
                    btn.style.background = 'var(--sage)';
                    btn.style.color = '#fff';
                    setTimeout(() => {
                        btn.textContent = 'ADD TO CART';
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 2000);
                }
            });
        }
    });

    
    function renderCart() {
        const cartContainer = document.getElementById('cart-items-container');
        if (!cartContainer) return;
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<div style="text-align:center; padding: 40px; font-size: 1.5rem;">Your cart is empty.</div>';
            const totalContainer = document.getElementById('cart-total-container');
            if (totalContainer) totalContainer.style.display = 'none';
            return;
        }

        let html = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemPrice = (item.price && !isNaN(item.price)) ? item.price : 0;
            const itemTotal = itemPrice * item.quantity;
            total += itemTotal;
            const extraStyle = item.style ? item.style : '';
            html += `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 20px; margin-bottom: 20px;">
              <div style="display: flex; gap: 20px; align-items: center;">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; ${extraStyle}">
                <div>
                  <h3 style="font-family: var(--font-anton); font-size: 1.5rem; letter-spacing: 0.05em;">${item.name}</h3>
                  <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                    <span style="color: var(--sage);">Quantity:</span>
                    <button class="decrease-qty-btn" data-index="${index}" style="background: transparent; color: var(--white); border: 1px solid var(--sage); padding: 2px 8px; cursor: pointer; border-radius: 4px; font-size: 14px;">-</button>
                    <span style="color: var(--white); font-weight: 600;">${item.quantity}</span>
                    <button class="increase-qty-btn" data-index="${index}" style="background: transparent; color: var(--white); border: 1px solid var(--sage); padding: 2px 8px; cursor: pointer; border-radius: 4px; font-size: 14px;">+</button>
                  </div>
                  <button class="remove-item-btn" data-index="${index}" style="margin-top: 10px; background: transparent; color: #ff6b6b; border: 1px solid #ff6b6b; padding: 5px 10px; cursor: pointer; border-radius: 4px; font-size: 12px; transition: all 0.3s ease;">Remove</button>
                </div>
              </div>
              <div style="font-weight: 600; font-size: 1.2rem;">₹${itemTotal.toFixed(2)}</div>
            </div>
            `;
        });

        
        let discount = 0;
        if (total > 2000) {
            discount = total * 0.10; 
        }
        let finalTotal = total - discount;

        cartContainer.innerHTML = html;
        
        const totalEl = document.getElementById('cart-total-amount');
        if (totalEl) {
            if (discount > 0) {
                totalEl.innerHTML = `<span style="text-decoration: line-through; font-size: 1.2rem; color: var(--sage); margin-right: 10px;">₹${total.toFixed(2)}</span> ₹${finalTotal.toFixed(2)} <div style="font-size: 1rem; color: #4ade80; margin-top: 5px;">(10% OFF Applied!)</div>`;
            } else {
                totalEl.textContent = `₹${total.toFixed(2)}`;
            }
        }
    }

    updateCartCount();
    renderCart();

    
    
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            if (email && password.length >= 6) {
                localStorage.setItem('visionease_user', JSON.stringify({ email }));
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                alert('Please enter a valid email and a password with at least 6 characters.');
            }
        });
    }

    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            if (name && email && password.length >= 6) {
                localStorage.setItem('visionease_user', JSON.stringify({ name, email }));
                alert('Registration successful!');
                window.location.href = 'index.html';
            } else {
                alert('Please fill out all fields correctly. Password must be at least 6 characters.');
            }
        });
    }

    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            if (name && email && message) {
                
                window.location.href = `mailto:vikramarora1100@gmail.com?subject=Contact Us Query from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
            } else {
                alert('Please fill out all fields.');
            }
        });
    }

    
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(e) {
            const target = e.target;
            if (target.classList.contains('remove-item-btn')) {
                const index = target.getAttribute('data-index');
                cart.splice(index, 1); 
                localStorage.setItem('visionease_cart', JSON.stringify(cart));
                updateCartCount();
                renderCart(); 
            } else if (target.classList.contains('increase-qty-btn')) {
                const index = target.getAttribute('data-index');
                cart[index].quantity += 1;
                localStorage.setItem('visionease_cart', JSON.stringify(cart));
                updateCartCount();
                renderCart();
            } else if (target.classList.contains('decrease-qty-btn')) {
                const index = target.getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1); 
                }
                localStorage.setItem('visionease_cart', JSON.stringify(cart));
                updateCartCount();
                renderCart();
            }
        });
    }

    // ─── CHECKOUT MODAL AND FORM HANDLING ───────────────────────────
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    
    let couponPercent = 0;
    let appliedCouponCode = '';

    function updateCheckoutTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const checkoutSubtotal = document.getElementById('checkoutSubtotal');
        if (checkoutSubtotal) checkoutSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
        
        // Auto 10% discount for orders > 2000
        let autoDiscount = 0;
        const autoDiscountRow = document.getElementById('autoDiscountRow');
        if (subtotal > 2000) {
            autoDiscount = subtotal * 0.10;
            if (autoDiscountRow) autoDiscountRow.style.display = 'flex';
            const checkoutAutoDiscount = document.getElementById('checkoutAutoDiscount');
            if (checkoutAutoDiscount) checkoutAutoDiscount.textContent = `-₹${autoDiscount.toFixed(2)}`;
        } else {
            if (autoDiscountRow) autoDiscountRow.style.display = 'none';
        }
        
        // Coupon discount
        const couponDiscountRow = document.getElementById('checkoutDiscountRow');
        let couponDiscount = 0;
        if (couponPercent > 0) {
            couponDiscount = (subtotal - autoDiscount) * (couponPercent / 100);
            if (couponDiscountRow) {
                couponDiscountRow.style.display = 'flex';
                const cpEl = document.getElementById('couponPercent');
                if (cpEl) cpEl.textContent = couponPercent;
                const cdEl = document.getElementById('checkoutDiscount');
                if (cdEl) cdEl.textContent = `-₹${couponDiscount.toFixed(2)}`;
            }
        } else {
            if (couponDiscountRow) couponDiscountRow.style.display = 'none';
        }
        
        const finalTotal = subtotal - autoDiscount - couponDiscount;
        const checkoutFinalTotal = document.getElementById('checkoutFinalTotal');
        if (checkoutFinalTotal) checkoutFinalTotal.textContent = `₹${finalTotal.toFixed(2)}`;
    }

    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Check if user is logged in
            const user = localStorage.getItem('visionease_user');
            if (!user) {
                alert('Please log in to proceed to checkout.');
                window.location.href = 'login.html';
                return;
            }
            
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Show modal
            checkoutModal.style.display = 'flex';
            
            // Reset fields
            couponPercent = 0;
            appliedCouponCode = '';
            const couponCodeInput = document.getElementById('couponCode');
            if (couponCodeInput) couponCodeInput.value = '';
            const couponMessage = document.getElementById('couponMessage');
            if (couponMessage) couponMessage.textContent = '';
            const addressInput = document.getElementById('checkoutAddress');
            if (addressInput) {
                addressInput.value = '';
                addressInput.style.borderColor = 'rgba(255,255,255,0.2)';
            }
            const addressError = document.getElementById('addressError');
            if (addressError) addressError.style.display = 'none';
            const upiInput = document.getElementById('upiId');
            if (upiInput) {
                upiInput.value = '';
                upiInput.style.borderColor = 'rgba(255,255,255,0.2)';
            }
            const upiError = document.getElementById('upiError');
            if (upiError) upiError.style.display = 'none';
            
            // Pre-calculate details
            updateCheckoutTotals();
        });
    }
    
    if (closeCheckoutBtn && checkoutModal) {
        closeCheckoutBtn.addEventListener('click', () => {
            checkoutModal.style.display = 'none';
        });
        
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.style.display = 'none';
            }
        });
    }

    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponCodeInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');
    
    if (applyCouponBtn && couponCodeInput && couponMessage) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponCodeInput.value.trim().toUpperCase();
            if (!code) {
                couponMessage.textContent = 'Please enter a coupon code.';
                couponMessage.style.color = '#ff6b6b';
                return;
            }
            
            // Valid coupon codes
            const validCoupons = {
                'VISION10': 10,
                'EASE20': 20,
                'WELCOME50': 50
            };
            
            if (validCoupons.hasOwnProperty(code)) {
                couponPercent = validCoupons[code];
                appliedCouponCode = code;
                couponMessage.textContent = `Coupon "${code}" applied successfully!`;
                couponMessage.style.color = '#4ade80';
                updateCheckoutTotals();
            } else {
                couponPercent = 0;
                appliedCouponCode = '';
                couponMessage.textContent = 'Invalid coupon code. Try VISION10, EASE20, or WELCOME50.';
                couponMessage.style.color = '#ff6b6b';
                updateCheckoutTotals();
            }
        });
    }

    const paymentRadios = document.getElementsByName('paymentMethod');
    const upiSection = document.getElementById('upiSection');
    
    if (paymentRadios && upiSection) {
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'upi') {
                    upiSection.style.display = 'block';
                } else {
                    upiSection.style.display = 'none';
                    const upiError = document.getElementById('upiError');
                    if (upiError) upiError.style.display = 'none';
                }
            });
        });
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const addressInput = document.getElementById('checkoutAddress');
            const addressError = document.getElementById('addressError');
            const selectedPaymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
            const paymentMethod = selectedPaymentRadio ? selectedPaymentRadio.value : 'cod';
            
            let isValid = true;
            
            // Address validation
            if (!addressInput.value.trim() || addressInput.value.trim().length < 10) {
                if (addressError) addressError.style.display = 'block';
                addressInput.style.borderColor = '#ff6b6b';
                isValid = false;
            } else {
                if (addressError) addressError.style.display = 'none';
                addressInput.style.borderColor = 'rgba(255,255,255,0.2)';
            }
            
            // UPI validation (conditional)
            if (paymentMethod === 'upi') {
                const upiInput = document.getElementById('upiId');
                const upiError = document.getElementById('upiError');
                const upiPattern = /^[\w.-]+@[\w.-]+$/;
                
                if (!upiInput.value.trim() || !upiPattern.test(upiInput.value.trim())) {
                    if (upiError) upiError.style.display = 'block';
                    upiInput.style.borderColor = '#ff6b6b';
                    isValid = false;
                } else {
                    if (upiError) upiError.style.display = 'none';
                    upiInput.style.borderColor = 'rgba(255,255,255,0.2)';
                }
            }
            
            if (isValid) {
                // Success: Order Placed!
                alert('Order placed successfully! Thank you for choosing VisionEase.');
                
                // Clear cart
                cart = [];
                localStorage.removeItem('visionease_cart');
                
                // Hide modal and reload/redirect
                checkoutModal.style.display = 'none';
                window.location.href = 'index.html';
            }
        });
    }

});

/* ═══════════════════════════════════════════════════
   VISIONEASE AI CHATBOT
   Concepts used:
   - Object & array destructuring
   - JSON.stringify / JSON.parse
   - querySelector / getElementById / querySelectorAll
   - addEventListener / Event Delegation
   - Form validation with preventDefault
   - Creating & appending / removing DOM nodes
   - localStorage for chat history
   - BOM: scrollTop = scrollHeight (auto-scroll)
   - fetch() + async/await for Gemini API
═══════════════════════════════════════════════════ */

const GROQ_API_KEY = "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT =
  "You are VisionEase AI, a helpful assistant for a premium eyewear brand called VisionEase. " +
  "We sell high-quality spectacles and smart contact lenses. Answer questions about our products, " +
  "eye care, pricing, and general eyewear advice. Keep answers concise (2-4 sentences). " +
  "Be friendly, professional, and on-brand.";

const chatOverlay   = document.getElementById("chatOverlay");
const chatOpenBtn   = document.getElementById("chatOpenBtn");
const chatCloseBtn  = document.getElementById("chatCloseBtn");
const chatClearBtn  = document.getElementById("chatClearBtn");
const chatMessages  = document.getElementById("chatMessages");
const chatForm      = document.getElementById("chatForm");
const chatInput     = document.getElementById("chatInput");
const chatSendBtn   = document.getElementById("chatSendBtn");
const chatTyping    = document.getElementById("chatTyping");

const STORAGE_KEY = "visionease_chat_history";

let chatHistory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function getTimeString() {
  const now = new Date();
  const { hours, mins } = {
    hours: String(now.getHours()).padStart(2, "0"),
    mins: String(now.getMinutes()).padStart(2, "0")
  };
  return `${hours}:${mins}`;
}

function createMessageNode(text, role) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("chat-msg", role);

  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble");
  bubble.textContent = text;

  const time = document.createElement("div");
  time.classList.add("chat-time");
  time.textContent = getTimeString();

  wrapper.appendChild(bubble);
  wrapper.appendChild(time);

  return wrapper;
}

function appendMessage(text, role) {
  const node = createMessageNode(text, role);
  chatMessages.appendChild(node);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderSavedHistory() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  while (chatMessages.firstChild) {
    chatMessages.removeChild(chatMessages.firstChild);
  }

  if (saved.length === 0) {
    const welcome = document.createElement("div");
    welcome.classList.add("chat-welcome");
    welcome.innerHTML = '<div class="chat-welcome-icon">✨</div><p>Hi! I\'m your VisionEase AI assistant.<br>Ask me anything about our spectacles, lenses, or eyewear.</p>';
    chatMessages.appendChild(welcome);
    return;
  }

  saved.forEach(({ role, text }) => {
    appendMessage(text, role === "user" ? "user" : "bot");
  });
}

function saveToStorage(role, text) {
  const entry = { role, text };
  chatHistory.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
}

function setLoading(isLoading) {
  chatSendBtn.disabled = isLoading;
  chatInput.disabled   = isLoading;
  chatTyping.style.display = isLoading ? "flex" : "none";
  if (isLoading) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

async function sendToGroq(userText) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
    throw new Error("API_KEY_MISSING");
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user",   content: userText }
  ];

  const body = JSON.stringify({ model: GROQ_MODEL, messages });

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + GROQ_API_KEY
    },
    body
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg = errData?.error?.message || `HTTP ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();

  const { choices } = data;
  if (!choices || choices.length === 0) {
    throw new Error("No response from Groq.");
  }

  return choices[0].message.content.trim();
}

async function handleUserMessage(userText) {
  const trimmed = userText.trim();
  if (!trimmed) return;

  const welcome = chatMessages.querySelector(".chat-welcome");
  if (welcome) welcome.remove();

  appendMessage(trimmed, "user");
  saveToStorage("user", trimmed);

  chatInput.value = "";
  setLoading(true);

  try {
    const botReply = await sendToGroq(trimmed);
    appendMessage(botReply, "bot");
    saveToStorage("model", botReply);
  } catch (err) {
    let errorMsg = "Sorry, I couldn't connect right now. Please try again!";
    if (err.message === "API_KEY_MISSING") {
      errorMsg = "⚠️ API key is not configured. Please add your Groq API key to script.js.";
    } else if (err.message.includes("invalid_api_key") || err.message.includes("Incorrect") || err.message.includes("invalid")) {
      errorMsg = "⚠️ Invalid Groq API key. Please check your key at console.groq.com.";
    }
    appendMessage(errorMsg, "bot");
    console.error("Gemini error:", err);
  } finally {
    setLoading(false);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

chatOpenBtn.addEventListener("click", () => {
  chatOverlay.classList.add("open");
  chatInput.focus();
  renderSavedHistory();
});

chatCloseBtn.addEventListener("click", () => {
  chatOverlay.classList.remove("open");
});

chatOverlay.addEventListener("click", (e) => {
  if (e.target === chatOverlay) {
    chatOverlay.classList.remove("open");
  }
});

chatClearBtn.addEventListener("click", () => {
  chatHistory = [];
  localStorage.removeItem(STORAGE_KEY);

  while (chatMessages.firstChild) {
    chatMessages.removeChild(chatMessages.firstChild);
  }

  const welcome = document.createElement("div");
  welcome.classList.add("chat-welcome");
  welcome.innerHTML = '<div class="chat-welcome-icon">✨</div><p>Chat cleared! Ask me anything about VisionEase.</p>';
  chatMessages.appendChild(welcome);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { value } = chatInput;
  if (!value.trim()) return;
  handleUserMessage(value);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && chatOverlay.classList.contains("open")) {
    chatOverlay.classList.remove("open");
  }
});
