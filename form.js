// Get references to the elements
const incomeRadio = document.getElementById('incomeRadio');
const expenseRadio = document.getElementById('expenseRadio');
const subcategorySelect = document.getElementById('subcategory');
// Define the sub-category options
const incomeOptions = [
    '-- Select Sub-Category --',
    'Salary',
    'Allowances',
    'Bonus',
    'Petty Cash',
    'Alimony/Child Support',
    'Gains from Investments', 'Government Benefits',
    'Gifts or Inheritance',
    'Rental Income',
    'Commissions',
    'tips',
    'Wages/Salary',
    'Freelance or Consulting Fees',
    'Interest',
    'others',
];

const expenseOptions = [
    '-- Select Sub-Category --',
    'palour/salon',
    'daily necessities',
    'education',
    'insurance',
    'healthcare',
    'utilities',
    'shopping',
    'Entertainment',
    "transportation",
    'food',
    'water bill',
    'rent',
    'loan or dept repayment',
    'taxes',
    'others'
];
function updateSubcategories(options) {
    // Clear any existing options
    subcategorySelect.innerHTML = '';

    // Add new options from the provided array
    options.forEach(optionText => {
        const newOption = document.createElement('option');
        newOption.textContent = optionText;
        newOption.value = optionText.toLowerCase().replace(/\s/g, ''); // create a clean value
        subcategorySelect.appendChild(newOption);
    });
}

// Add event listeners to the radio buttons
incomeRadio.addEventListener('change', () => {
    if (incomeRadio.checked) {
        updateSubcategories(incomeOptions);
    }
});

expenseRadio.addEventListener('change', () => {
    if (expenseRadio.checked) {
        updateSubcategories(expenseOptions);
    }
});
