// Original Code

const menuItems = [
    { id: 1, name: 'BBQ Chicken', price: 4.00, image: 'image/1.jpg' },
    { id: 2, name: 'Burger', price: 2.50, image: 'image/burger.jpg' },
    { id: 3, name: 'Royal Snack', price: 3.00, image: 'image/2.jpg' },
    { id: 4, name: 'Chicken Slices', price: 2.00, image: 'image/3.jpg' },
    { id: 5, name: 'Arabic Kebab', price: 4.00, image: 'image/images.jpg' },
    { id: 6, name: 'Rice', price: 1.50, image: 'image/6.jpg' },
    { id: 7, name: 'Hot Meal', price: 6.00, image: 'image/5.jpg' },
    { id: 8, name: 'Basta Ribs', price: 2.50, image: 'image/4.jpg' },
    { id: 9, name: 'Mangoes', price: 1, image: 'image/7.jpg' },
    { id: 10, name: 'Milk ', price: 1, image: 'image/8.jpg' },
    { id: 11, name: 'chocklate', price: 1, image: 'image/9.jpg' },
    { id: 12, name: 'water melon', price: 1, image: 'image/10.jpg' },
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
const orderDetailsSidebar = document.querySelector('.order-details');
const contentWrapper = document.querySelector('.content-wrapper'); // Reference for adjusting layout

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

// Modified addToOrder function to reset order if sidebar is closed
function addToOrder(id) {
    // Check if sidebar is hidden, then reset the order
    if (!orderDetailsSidebar.classList.contains('show')) {
        order = []; // Reset the order array
    }

    const existingItem = order.find(i => i.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const item = menuItems.find(i => i.id === id);
        order.push({ ...item, quantity: 1 });
    }
    renderOrder();
    
    // Show the sidebar and adjust layout when an item is added
    orderDetailsSidebar.classList.add('show');
    contentWrapper.classList.add('sidebar-visible');
}

// Updated close-sidebar functionality to clear order and hide sidebar
document.querySelector('.close-sidebar').addEventListener('click', () => {
    orderDetailsSidebar.classList.remove('show'); // Hide the sidebar
    contentWrapper.classList.remove('sidebar-visible'); // Reset layout
    order = []; // Clear the order array
    renderOrder(); // Re-render order to clear displayed items
});

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
            <button class="remove" onclick="removeFromOrder(${item.id})">Remove</button>
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

// Updated code: Show modal for order summary and center it
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
    modal.style.display = "flex"; // Set to flex to center the modal
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

// Updated code: Close modals
closeModal.onclick = function() { 
    modal.style.display = "none"; 
};

// Close modals if clicking outside them
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === reportModal) {
        reportModal.style.display = "none";
    }
};

// Updated code: Event listener for the "Daily Report" modal close button
closeReportModal.addEventListener('click', () => {
    reportModal.style.display = "none"; // Hide the report modal when close button is clicked
});

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

    openReportModal(); // Show the report modal
}

// Updated code: Function to open the report modal in a centered position
function openReportModal() {
    reportModal.style.display = "flex"; // Display as flex to center content
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

    // Generate summary
    const summary = calculateSummary(confirmedOrders);
    csvContent += "\nItem Summary\n";
    csvContent += "Item,Quantity\n";
    for (const [itemName, quantity] of Object.entries(summary)) {
        csvContent += `${itemName},${quantity}\n`;
    }

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

    // Generate summary
    const summary = calculateSummary(confirmedOrders);
    doc.text("Item Summary", 10, doc.autoTable.previous.finalY + 10);
    const summaryData = Object.entries(summary).map(([itemName, quantity]) => [itemName, quantity]);
    doc.autoTable({
        head: [['Item', 'Quantity']],
        body: summaryData,
        startY: doc.autoTable.previous.finalY + 15,
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
