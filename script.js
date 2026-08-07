var swiper = new Swiper('.mySwiper', {
    loop: true,
    navigation: {
        nextEl: '#next',
        prevEl: '#prev',
    },
});



// CART ICON

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');


cartIcon.addEventListener('click', () => cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', () => cartTab.classList.remove('cart-tab-active'));
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('mobile-menu-active'));
hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    bars.classList.toggle('fa-xmark');
    bars.classList.toggle('fa-bars');
});

// MENU
let productList = [];
let cartProduct = [];

const updateTotals = () =>{
    
    let totalPrice = 0;
    let totalQuantity = 0;

    document.querySelectorAll('.item').forEach(item =>{

        const quantity = parseInt(item.querySelector('.quantity-value').textContent);
        const price = parseFloat(item.querySelector('.item-total').textContent.replace('₹ ',''));
        
        totalPrice += price;
        totalQuantity += quantity;
    
    })

    cartTotal.textContent = `₹ ${totalPrice.toFixed(2)}`;
    cartValue.textContent = totalQuantity;
}



const showCards = () => {

    productList.forEach(product => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
        <div class="card-imag">
            <img src="${product.image}">
        </div>
        <h4>${product.name}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="#" class="btn card-btn">Add to Cart</a>
        `;

        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click', (e) =>{
            e.preventDefault();
            addToCart(product);
        });
        
    });
}

// CART
const addToCart = (product) =>{

    const existingProduct = cartProduct.find(item => item.id === product.id);
    if(existingProduct){

        alert('Item already in your cart');
        return;
    }

    cartProduct.push(product);
    let quantity = 1;
    let price = parseFloat(product.price.replace('₹ ',''))

    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem.innerHTML = `
            <div class="item-image">
                <img src="${product.image}">
            </div>

            <div class="detail">
                <h4>${product.name}</h4>
                <h4 class="item-total">${product.price}</h4>
            </div>
            <div class="flex">
                <a href="#" class="quantity-btn minus">
                    <i class="fa-solid fa-minus"></i>
                </a>
                <h4 class="quantity-value">${quantity}</h4>
                <a href="#" class="quantity-btn plus">
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
    `;

    cartList.appendChild(cartItem);
    updateTotals();

    
    const plusBtn = cartItem.querySelector('.plus');
    const quantityValue = cartItem.querySelector('.quantity-value');
    const itemTotal = cartItem.querySelector('.item-total');
    const minusBtn = cartItem.querySelector('.minus');

    plusBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        quantity++;
        quantityValue.textContent = quantity;
        itemTotal.textContent = `₹ ${(price * quantity).toFixed(2)}`;
        updateTotals();
    });

    minusBtn.addEventListener('click', (e) =>{
        e.preventDefault();
        if(quantity >1 ){
            quantity--;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `₹ ${(price * quantity).toFixed(2)}`;
            updateTotals();
        }
        else{
            cartItem.classList.add('slide-out')
            
            setTimeout(() =>{
                cartItem.remove();
                cartProduct = cartProduct.filter(item => item.id !== product.id);
                updateTotals();
            },400)
        }
    })


}


const initApp = () => {

    fetch('products.json').then
        (response => response.json()).then
        (data => {
            productList = data;
            showCards();
        })
}

initApp();

// USER PROFILE
const userPhoto = document.querySelector(".user-photo");
const userTooltip = document.querySelector(".user-tooltip");


function loadUserProfile(){

    const savedUser = JSON.parse(localStorage.getItem("user"));


    if(savedUser){

        userPhoto.src = savedUser.photo;
        userTooltip.textContent = savedUser.name;
    }
    else{

        userPhoto.src = "images/blue.png";
        userTooltip.textContent = "Guest";
    }
}

loadUserProfile();

// ADDRESS
const addressContainer = document.querySelector(".address-container");
const addressTitle = document.querySelector(".address-title");

// Open / Close Popup
addressTitle.addEventListener("click", (e) => {
    e.stopPropagation();
    addressContainer.classList.toggle("active");
});

// Close popup when clicking outside
document.addEventListener("click", (e)=>{
    if(!addressContainer.contains(e.target)){
        addressContainer.classList.remove("active");
    }
});


// CURRENT LOCATION
const locationBtn = document.querySelector(".location-btn");
const addressBox = document.querySelector("#user-address");

locationBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            async(position)=>{
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try{
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );
                    
                    const data = await response.json();
                    addressBox.value = data.display_name;

                }
                catch(error){
                    alert("Unable to get address");
                }
            },
            ()=>{

                alert("Location permission denied");
            }
        );
    }

    else{

        alert("Geolocation not supported");
    }
});

 // SAVE DELIVERY ADDRESS
const saveAddressBtn = document.querySelector(".save-address-btn");
const displayAddress = document.querySelector("#display-address");

saveAddressBtn.addEventListener("click",()=>{
    const address = addressBox.value.trim();
    if(address){
        displayAddress.textContent = address;
        localStorage.setItem(
            "deliveryAddress",
            address
        );

        addressContainer.classList.remove("active");
    }
    else{
        alert("Please enter address");
    }
});

// Load saved address
const savedAddress = localStorage.getItem("deliveryAddress");
if(savedAddress){
    displayAddress.textContent = savedAddress;
}
