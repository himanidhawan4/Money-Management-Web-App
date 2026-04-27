 document.getElementById('transaction-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Stop the form from reloading the page

    try {
        // 1. Reset all previous errors and highlights
        clearErrors();

        // 2. Perform all validation checks
        let isValid = true;

        // a) Validate Amount
        const amountInput = document.getElementById('amount');
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            displayError('amount-error', 'Amount must be a positive number.');
            highlightField(amountInput);
            isValid = false;
        }

        // b) Validate Date
        const dateInput = document.getElementById('FromDate');
        const today = new Date().toISOString().split('T')[0];
        if (dateInput.value && dateInput.value > today) {
            displayError('date-error', 'Date cannot be in the future.');
            highlightField(dateInput);
            isValid = false;
        }

        // c) Validate Category
        const categorySelected = document.querySelector('input[name="category"]:checked');
        if (!categorySelected) {
            displayError('category-error', 'Category is required.');
            isValid = false;
        }
        
        // d) Validate Sub-Category
        const subcategorySelect = document.getElementById('subcategory');
        if (subcategorySelect.value === '') {
            displayError('subcategory-error', 'Please select a sub-category.');
            highlightField(subcategorySelect);
            isValid = false;
        }

        // e) Validate Description
        const descriptionInput = document.getElementById('description');
        if (descriptionInput.value.length > 100) {
            displayError('description-error', 'Description is limited to 100 characters.');
            highlightField(descriptionInput);
            isValid = false;
        }

        // 3. If validation is successful, process the data
        if (isValid) {
            console.log('Form is valid! Submitting...');
            // Place your code to handle the form data here
        }

    } catch (error) {
        // Handle any unexpected runtime exceptions
        console.error("An unexpected error occurred:", error);
        alert("An error occurred. Please try again later.");
    }
});

// Helper functions (should be defined outside the main event listener)
function displayError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function highlightField(element) {
    element.classList.add('invalid-field');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.invalid-field').forEach(el => el.classList.remove('invalid-field'));
}
