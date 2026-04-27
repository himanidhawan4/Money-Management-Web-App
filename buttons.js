// Get all the necessary DOM elements from the HTML file.
const transactionForm = document.getElementById('transaction-form');
const incomeAmountDisplay = document.getElementById('income-amount');
const expenseAmountDisplay = document.getElementById('expense-amount');
const netBalanceDisplay = document.getElementById('net-balance');
const amountInput = document.getElementById("amount");
const categoryRadios = document.querySelectorAll('input[name="category"]');
const subcategorySelect = document.getElementById("subcategory");
const descriptionInput = document.getElementById("description");
const transactionListContainer = document.querySelector(".transactionhistory");
const FromDate = document.getElementById("FromDate");
const ToDate = document.getElementById("ToDate");
const submitBtn = document.getElementById("btnAddTask");
const messageBox = document.getElementById("message-box");
const loadingIndicator = document.getElementById("loading-indicator");


// State variables for managing the application's data.
let editingId = null; // Stores the ID of the transaction being edited.
let totalIncome = 0; // Tracks the total income.
let totalExpense = 0; // Tracks the total expense.
let transactions = []; // An array to hold all transaction objects.

// An object mapping main categories to their subcategories.
const subcategories = {
    "income": ["Salary", "Freelance", "Gift", "Other Income"],
    "expense": ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Other Expense"]
};

// --- Utility Functions ---

/**
 * Displays a temporary message box to the user.
 * @param {string} message - The message to display.
 * @param {boolean} isError - True if it's an error message, false otherwise.
 */
function showMessage(message, isError = true) {
    // Check if messageBox element exists before using it
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.style.backgroundColor = isError ? '#ef4444' : '#22c55e';
        messageBox.classList.remove('hidden');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Generates a unique ID for each new transaction.
 * This is a simple, client-side UUID generator.
 */
function taskIdGenerator() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Deletes a transaction from the transactions array based on its ID.
 * @param {string} id - The ID of the transaction to delete.
 */
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    showMessage("Transaction deleted successfully!", false);
    recalculateTotals();
    renderTransactions();
}

/**
 * Populates the form fields with data from a selected transaction
 * to allow for editing.
 * @param {string} id - The ID of the transaction to edit.
 */
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        editingId = id; // Set the global editing ID.
        amountInput.value = transaction.amount;
        if (transaction.category === 'income') {
            document.getElementById('incomeRadio').checked = true;
        } else {
            document.getElementById('expenseRadio').checked = true;
        }

        // Manually trigger the 'change' event to update the subcategory dropdown.
        const event = new Event('change');
        document.querySelector(`input[name="category"][value="${transaction.category}"]`).dispatchEvent(event);

        subcategorySelect.value = transaction.subcategory;
        descriptionInput.value = transaction.description;
        FromDate.value = transaction.FromDate;
        ToDate.value = transaction.ToDate;
        submitBtn.textContent = "UPDATE TRANSACTION"; // Change button text to reflect the action.
    }
}

/**
 * Recalculates and updates the total income, total expense, and net balance displays.
 */
function recalculateTotals() {
    totalIncome = 0;
    totalExpense = 0;
    transactions.forEach(t => {
        if (t.category === 'income') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });
    const netBalance = totalIncome - totalExpense;
    if (incomeAmountDisplay) incomeAmountDisplay.textContent = `₹${totalIncome.toFixed(2)}`;
    if (expenseAmountDisplay) expenseAmountDisplay.textContent = `₹${totalExpense.toFixed(2)}`;
    if (netBalanceDisplay) netBalanceDisplay.textContent = `₹${netBalance.toFixed(2)}`;
}

/**
 * Renders the list of transactions on the page.
 * @param {Array} filteredList - An optional list of transactions to display.
 * If not provided, it defaults to the full transactions array.
 */
function renderTransactions(filteredList = transactions) {
    if (!transactionListContainer) return;
    transactionListContainer.innerHTML = "";
    const template = document.getElementById("transaction-template");

    // Check if loadingIndicator element exists before using it
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }

    if (filteredList.length === 0) {
        if (loadingIndicator) {
            loadingIndicator.textContent = "No transactions to display.";
            loadingIndicator.style.display = 'block';
        }
        return;
    }

    filteredList.forEach((item) => {
        if (!template) {
            showMessage("Template not found. Check your HTML file.", true);
            return;
        }
        const clone = template.content.cloneNode(true);

        const tname = clone.getElementById("tname");
        const tdesc = clone.getElementById("tdesc");
        const tdatepriority = clone.getElementById("tdatepriority");
        const btnDeleteTask = clone.getElementById("btnDeleteTask");
        const btnEditTask = clone.getElementById("btnEditTask");

        if (tname) tname.textContent = `${item.category.toUpperCase()} - ${item.subcategory}`;
        if (tdesc) tdesc.textContent = `${item.description}`;
        if (tdatepriority) tdatepriority.textContent = `AMOUNT: ₹${item.amount} | FROM: ${item.FromDate} | TO: ${item.ToDate}`;

        if (btnDeleteTask) btnDeleteTask.onclick = () => deleteTransaction(item.id);
        if (btnEditTask) btnEditTask.onclick = () => editTransaction(item.id);

        transactionListContainer.appendChild(clone);
    });
}

/**
 * Filters the transactions by the date range selected by the user.
 */
function filterTransactionsByDate() {
    const fromDateValue = FromDate.value;
    const toDateValue = ToDate.value;

    if (!fromDateValue || !toDateValue) {
        renderTransactions(); // If dates are not set, show all transactions.
        return;
    }

    const fromDate = new Date(fromDateValue);
    const toDate = new Date(toDateValue);

    const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.FromDate);
        return transactionDate >= fromDate && transactionDate <= toDate;
    });
    renderTransactions(filteredTransactions);
}

// --- Event Listeners ---

// Listener to populate subcategories when a category radio button is changed.
categoryRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        const selectedCategory = document.querySelector('input[name="category"]:checked').value;
        const options = subcategories[selectedCategory];
        subcategorySelect.innerHTML = '<option value="">-- Select Sub-Category --</option>';
        if (options) {
            options.forEach(option => {
                const newOption = document.createElement("option");
                newOption.value = option;
                newOption.textContent = option;
                subcategorySelect.appendChild(newOption);
            });
        }
    });
});

// Main form submission listener to add or update a transaction.
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the page from reloading.

    const amount = parseFloat(amountInput.value);
    const selectedCategory = document.querySelector('input[name="category"]:checked');

    if (!selectedCategory || isNaN(amount) || amount <= 0) {
        showMessage("Please fill out all required fields with valid data.", true);
        return;
    }
    const category = selectedCategory.value;
    const subcategory = subcategorySelect.value;
    const description = descriptionInput.value;
    const fromDate = FromDate.value;
    const toDate = ToDate.value;

    if (editingId) {
        // Find and update the existing transaction.
        const transaction = transactions.find(t => t.id === editingId);
        if (transaction) {
            // Adjust totals before updating the transaction.
            if (transaction.category === 'income') {
                totalIncome -= transaction.amount;
            } else {
                totalExpense -= transaction.amount;
            }

            // Update the transaction object's properties.
            transaction.amount = amount;
            transaction.category = category;
            transaction.subcategory = subcategory;
            transaction.description = description;
            transaction.FromDate = fromDate;
            transaction.ToDate = toDate;

            // Update totals with the new values.
            if (category === 'income') {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }
        }
        editingId = null; // Clear the editing state.
        submitBtn.textContent = "ADD TRANSACTION";
        showMessage("Transaction updated successfully!", false);

    } else {
        // Create a new transaction object and add it to the array.
        const newTransaction = {
            id: taskIdGenerator(),
            amount: amount,
            category: category,
            subcategory: subcategory,
            description: description,
            FromDate: fromDate,
            ToDate: toDate,
        };
        transactions.push(newTransaction);

        // Update totals for the new transaction.
        if (category === 'income') {
            totalIncome += amount;
        } else if (category === 'expense') {
            totalExpense += amount;
        }
        showMessage("Transaction added successfully!", false);
    }

    // Always recalculate and render after a form submission.
    recalculateTotals();
    renderTransactions();
    transactionForm.reset(); // Reset the form fields.
});

// Add event listeners to the date inputs to trigger filtering.
FromDate.addEventListener('change', filterTransactionsByDate);
ToDate.addEventListener('change', filterTransactionsByDate);

// Initial call to render transactions when the page loads.
document.addEventListener("DOMContentLoaded", () => {
    renderTransactions();
});


// Sorts and renders transactions based on the sort option
function applySort(sortOption) {
    let sortedList = [...transactions];
    if (sortOption === 'newest') {
        sortedList.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === 'oldest') {
        sortedList.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    renderTransactions(sortedList);
}

// Event listeners for the new sort buttons
sortNewestBtn.addEventListener('click', () => applySort('newest'));
sortOldestBtn.addEventListener('click', () => applySort('oldest'));

// Initial render
recalculateTotals();
renderTransactions(transactions);