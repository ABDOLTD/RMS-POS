const menuItems = [
    { id: 1, name: 'BBQ Chicken', price: 10.00, image: 'image/1.jpg' },
    { id: 2, name: 'Tuna Boiled Eggs', price: 12.50, image: 'image/burger.jpg' },
    { id: 3, name: 'Meat Sauce Soup', price: 18.00, image: 'image/2.jpg' },
    { id: 4, name: 'Chicken Slices', price: 22.00, image: 'image/3.jpg' },
    { id: 5, name: 'Arabic Kebab', price: 28.00, image: 'image/images.jpg' },
    { id: 6, name: 'Zumbo Burger', price: 10.50, image: 'image/6.jpg' },
    { id: 7, name: 'Hot Dog', price: 12.00, image: 'image/5.jpg' },
    { id: 8, name: 'BBQ Ribs', price: 10.50, image: 'image/4.jpg' },
];

let order = [];
const menuContainer = document.getElementById('menu-items');
const orderSummary = document.getElementById('order-summary');
const totalPayment = document.getElementById('total-payment');
const placeOrderButton = document.getElementById('place-order');
const modal = document.getElementById('order-modal');
const modalOrderSummary = document.getElementById('modal-order-summary');
const modalTotalPayment = document.getElementById('modal-total-payment');
const confirmOrderButton = document.getElementById('confirm-order');
const closeModal = document.getElementsByClassName('close')[0];
const dineInButton = document.getElementById('dine-in-button');
const takeAwayButton = document.getElementById('take-away-button');

// Function to update the menu
function updateMenu() {
    menuContainer.innerHTML = ''; // Clear previous items
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            <button onclick="addToOrder(${item.id})">Add to Order</button>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Function to add item to order
function addToOrder(id) {
    const existingItem = order.find(i => i.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const item = menuItems.find(i => i.id === id);
        order.push({ ...item, quantity: 1 });
    }
    renderOrder();
}

// Function to render the current order
function renderOrder() {
    orderSummary.innerHTML = '';
    let total = 0;

    order.forEach(item => {
        total += item.price * item.quantity;
        const orderItem = document.createElement('div');
        orderItem.innerHTML = `
            <span>${item.name}</span>
            <span>x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromOrder(${item.id})">Remove</button>
        `;
        orderSummary.appendChild(orderItem);
    });

    totalPayment.textContent = `Total Payment: $${total.toFixed(2)}`;
    placeOrderButton.disabled = total === 0;
}

// Function to remove item from order
function removeFromOrder(id) {
    const index = order.findIndex(i => i.id === id);
    if (index !== -1) {
        order[index].quantity--;
        if (order[index].quantity === 0) {
            order.splice(index, 1);
        }
    }
    renderOrder();
}

// Show modal for order summary
function showModal() {
    modalOrderSummary.innerHTML = ''; // Clear previous content
    let total = 0;

    order.forEach(item => {
        total += item.price * item.quantity;
        const orderItem = document.createElement('div');
        orderItem.innerHTML = `
            <span>${item.name}</span>
            <span>x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        modalOrderSummary.appendChild(orderItem);
    });

    modalTotalPayment.textContent = `Total: $${total.toFixed(2)}`;
    modal.style.display = "block";
}

// Event listener for placing an order
placeOrderButton.addEventListener('click', () => {
    const customerName = document.getElementById('customer-name').value;
    if (!customerName) {
        alert('Please enter your name.');
        return;
    }
    showModal();
});

// Event listener for closing the modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Event listener for confirming the order
confirmOrderButton.addEventListener('click', () => {
    const customerName = document.getElementById('customer-name').value;
    alert(`Order confirmed for ${customerName}!\nTotal: $${modalTotalPayment.textContent.split('$')[1]}`);
    order = []; // Reset order
    renderOrder();
    modal.style.display = "none";
});

// Switch between Dine In and Take Away
dineInButton.addEventListener('click', () => {
    dineInButton.classList.add('active');
    takeAwayButton.classList.remove('active');
    updateMenu();
});

takeAwayButton.addEventListener('click', () => {
    takeAwayButton.classList.add('active');
    dineInButton.classList.remove('active');
    updateMenu();
});

// Initialize the menu
updateMenu();