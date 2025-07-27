// Shopping Cart Functionality
        let cart = [];
        let cartCount = 0;
        
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile Menu Toggle
            const mobileMenuButton = document.querySelector('header button.md\\:hidden');
            const mobileMenu = document.querySelector('.mobile-menu');
            
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenu.contains(e.target) && e.target !== mobileMenuButton) {
                    mobileMenu.classList.remove('active');
                }
            });
            
            // Add to Cart Button Handlers
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.getAttribute('data-name');
                    const price = parseFloat(this.getAttribute('data-price'));
                    const image = this.getAttribute('data-image');
                    
                    addToCart(id, name, price, image);
                    updateCartCount();
                    updateCartModal();
                });
            });
            
            // Cart Modal Toggle
            const cartModal = document.getElementById('cart-modal');
            const cartIcon = document.querySelector('.cart-icon');
            const closeCartButtons = document.querySelectorAll('.close-cart');
            
            cartIcon.addEventListener('click', function() {
                cartModal.classList.remove('hidden');
            });
            
            closeCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    cartModal.classList.add('hidden');
                });
            });
            
            // Close cart when clicking outside
            cartModal.addEventListener('click', function(e) {
                if (e.target === cartModal) {
                    cartModal.classList.add('hidden');
                }
            });
        });
        
        function addToCart(id, name, price, image) {
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            // Show success feedback
            const feedback = document.createElement('div');
            feedback.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
            feedback.textContent = `${name} added to cart!`;
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.remove();
            }, 2000);
        }
        
        function updateCartCount() {
            cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            const cartCountElement = document.querySelector('.cart-count');
            cartCountElement.textContent = cartCount;
            
            // Add animation to cart count
            cartCountElement.classList.add('animate-ping');
            setTimeout(() => {
                cartCountElement.classList.remove('animate-ping');
            }, 300);
        }
        
        function updateCartModal() {
            const cartItems = document.getElementById('cart-items');
            const cartSummary = document.getElementById('cart-summary');
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 class="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                        <p class="mt-1 text-gray-500">Start shopping to add items to your cart</p>
                        <div class="mt-6">
                            <button class="close-cart inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                `;
                cartSummary.classList.add('hidden');
            } else {
                cartItems.innerHTML = '';
                
                cart.forEach(item => {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'py-4 flex cart-item';
                    cartItemElement.innerHTML = `
                        <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover object-center">
                        </div>
                        
                        <div class="ml-4 flex flex-1 flex-col">
                            <div>
                                <div class="flex justify-between text-base font-medium text-gray-900">
                                    <h3>${item.name}</h3>
                                    <p class="ml-4">$${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                            <div class="flex flex-1 items-end justify-between text-sm mt-2">
                                <div class="flex items-center border rounded">
                                    <button class="decrease-quantity px-2 py-1 text-gray-500" data-id="${item.id}">-</button>
                                    <span class="px-2 quantity">${item.quantity}</span>
                                    <button class="increase-quantity px-2 py-1 text-gray-500" data-id="${item.id}">+</button>
                                </div>
                                
                                <button class="remove-item font-medium text-red-500" data-id="${item.id}">Remove</button>
                            </div>
                        </div>
                    `;
                    
                    cartItems.appendChild(cartItemElement);
                });
                
                // Add event listeners to quantity buttons
                document.querySelectorAll('.increase-quantity').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const item = cart.find(item => item.id === id);
                        item.quantity += 1;
                        updateCartModal();
                        updateCartCount();
                    });
                });
                
                document.querySelectorAll('.decrease-quantity').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const itemIndex = cart.findIndex(item => item.id === id);
                        
                        if (cart[itemIndex].quantity > 1) {
                            cart[itemIndex].quantity -= 1;
                        } else {
                            cart.splice(itemIndex, 1);
                        }
                        
                        updateCartModal();
                        updateCartCount();
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const itemIndex = cart.findIndex(item => item.id === id);
                        cart.splice(itemIndex, 1);
                        updateCartModal();
                        updateCartCount();
                    });
                });
                
                // Update summary
                const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
                document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
                
                cartSummary.classList.remove('hidden');
            }
        }
