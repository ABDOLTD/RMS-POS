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

const reportModal = document.getElementById('report-modal');
const closeReportModal = document.getElementsByClassName('close-report')[0];

// Function to update the menu
function updateMenu() {
    menuContainer.innerHTML = '';
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name} image">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            <button onclick="addToOrder(${item.id})">Add to Order</button>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Add item to order
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

// Render current order
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

// Remove item from order
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
    modalOrderSummary.innerHTML = '';
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

// Save confirmed order to localStorage
function saveConfirmedOrder(customerName) {
    const orderSummary = {
        customerName,
        items: order.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity
        })),
        total: order.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toLocaleString()
    };

    const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
    confirmedOrders.push(orderSummary);
    localStorage.setItem('confirmedOrders', JSON.stringify(confirmedOrders));
}

// Event listener for the "Place Order" button
placeOrderButton.addEventListener('click', () => {
    const customerName = document.getElementById('customer-name').value;
    if (!customerName) {
        alert('Please enter your name.');
        return;
    }
    showModal();  // Show modal when Place Order is clicked
});

// Event listener for confirming the order
confirmOrderButton.addEventListener('click', () => {
    const customerName = document.getElementById('customer-name').value;
    saveConfirmedOrder(customerName);  // Save confirmed order for the report
    alert(`Order confirmed for ${customerName}!\nTotal: $${modalTotalPayment.textContent.split('$')[1]}`);
    order = []; // Reset order
    renderOrder();
    modal.style.display = "none";
});

// Close modals
closeModal.onclick = function() { modal.style.display = "none"; };
closeReportModal.onclick = function() { reportModal.style.display = "none"; };

// Close modals if clicking outside them
window.onclick = function(event) {
    if (event.target === modal) modal.style.display = "none";
    if (event.target === reportModal) reportModal.style.display = "none";
};

// Generate and display the daily report
function generateReport() {
    const reportBody = document.getElementById('report-body');
    reportBody.innerHTML = ''; // Clear previous report

    const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];

    confirmedOrders.forEach((order, index) => {
        const orderRow = document.createElement('tr');
        const itemsDescription = order.items.map(item => 
            `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
        ).join('<br>');

        orderRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.customerName}</td>
            <td>${itemsDescription}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${order.date}</td>
        `;
        reportBody.appendChild(orderRow);
    });

    // Create summary for item quantities
    const summary = calculateSummary(confirmedOrders);
    displaySummary(summary);

    reportModal.style.display = "block"; // Show the report modal
}

// Function to calculate item quantities from all confirmed orders
function calculateSummary(orders) {
    const summary = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (summary[item.name]) {
                summary[item.name] += item.quantity; // Increment existing item quantity
            } else {
                summary[item.name] = item.quantity; // Initialize quantity
            }
        });
    });
    return summary;
}

// Function to display the summary of item quantities below the report table
function displaySummary(summary) {
    const summaryContainer = document.getElementById('summary-container');
    summaryContainer.innerHTML = ''; // Clear previous summary

    const summaryTitle = document.createElement('h3');
    summaryTitle.textContent = "Item Summary";
    summaryContainer.appendChild(summaryTitle);

    for (const [itemName, quantity] of Object.entries(summary)) {
        const summaryItem = document.createElement('div');
        summaryItem.innerHTML = `${itemName}: ${quantity}x`;
        summaryContainer.appendChild(summaryItem);
    }
}

// Function to download the report as CSV
function downloadCSV() {
    const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
    if (confirmedOrders.length === 0) {
        alert("No data to download.");
        return;
    }

    // Generate CSV content
    let csvContent = "Order #,Customer Name,Items,Total Price,Date\n";
    confirmedOrders.forEach((order, index) => {
        const itemsDescription = order.items.map(item => 
            `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
        ).join("; ");
        csvContent += `${index + 1},${order.customerName},"${itemsDescription}",$${order.total.toFixed(2)},${order.date}\n`;
    });

    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Daily_Report.csv';
    link.click();
    URL.revokeObjectURL(url);
}

// Function to download the report as PDF
function downloadPDF() {
    const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders')) || [];
    if (confirmedOrders.length === 0) {
        alert("No data to download.");
        return;
    }

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title and Table Headers
    doc.text("Daily Report", 10, 10);
    doc.autoTable({
        head: [['Order #', 'Customer Name', 'Items', 'Total Price', 'Date']],
        body: confirmedOrders.map((order, index) => [
            index + 1,
            order.customerName,
            order.items.map(item => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join("; "),
            `$${order.total.toFixed(2)}`,
            order.date,
        ]),
        startY: 20,
    });

    // Download PDF
    doc.save("Daily_Report.pdf");
}

// Event listeners for the CSV and PDF download buttons
document.getElementById('download-csv').addEventListener('click', downloadCSV);
document.getElementById('download-pdf').addEventListener('click', downloadPDF);

// Event listener for "View Daily Report" button
document.getElementById('view-report').addEventListener('click', generateReport);

// Initialize the menu
updateMenu();
