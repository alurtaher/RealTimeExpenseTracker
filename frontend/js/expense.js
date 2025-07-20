// DOM Elements
const form = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categorySelect = document.getElementById("category");
const expenseList = document.getElementById("expense-list");
const emptyState = document.getElementById("empty-state");
const totalExpenses = document.getElementById("total-expenses");
const expensesCount = document.getElementById("expenses-count");
const avgExpense = document.getElementById("avg-expense");
const expensesCountHeader = document.getElementById("expenses-count-header");
const submitBtnText = document.getElementById("submit-btn-text");

// API Configuration
const token = localStorage.getItem("token");
const API_URL = "http://localhost:3000/expense";
let editExpenseId = null;
let expenseChart = null;
let allExpenses = []; // Store all expenses globally

// Initialize the app
function initApp() {
  // Set dark mode if previously selected
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.querySelector("#toggle-dark-mode i").className = "fas fa-sun";
  }

  // Load expenses from API
  loadExpenses();
}

// Load expenses from API
function loadExpenses() {
  axios
    .get(`${API_URL}/get`, { headers: { Authorization: token } })
    .then((res) => {
      if (res.data && res.data.length > 0) {
        allExpenses = res.data; // Store expenses globally
        renderExpenseList(allExpenses);
        updateStats(allExpenses);
        renderChart(allExpenses);
      } else {
        showEmptyState();
      }
    })
    .catch((err) => {
      console.error("Error fetching expenses:", err);
      expenseList.innerHTML = `<div class="alert alert-danger">Failed to load expenses. Please try again later.</div>`;
    });
}

// Render expense list
function renderExpenseList(expenses) {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    showEmptyState();
    return;
  }

  emptyState.classList.add("d-none");

  expenses
    .slice()
    .reverse()
    .forEach((expense) => {
      const card = document.createElement("div");
      card.className = "expense-card card p-3";
      card.innerHTML = `
          <div class="d-flex justify-content-between">
            <div>
              <div class="expense-amount">₹${expense.amount}</div>
              <div class="expense-description">${expense.description}</div>
              <span class="category-badge badge-${
                expense.category
              }">${getCategoryName(expense.category)}</span>
            </div>
            <div class="d-flex gap-2 align-items-start">
              <div class="action-btn edit-btn" data-id="${expense.id}">
                <i class="fas fa-edit"></i>
              </div>
              <div class="action-btn delete-btn" data-id="${expense.id}">
                <i class="fas fa-trash"></i>
              </div>
            </div>
          </div>
        `;
      expenseList.appendChild(card);
    });

  // Add event listeners to action buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => editExpense(btn.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteExpense(btn.dataset.id));
  });
}

// Show empty state
function showEmptyState() {
  expenseList.innerHTML = "";
  emptyState.classList.remove("d-none");
}

// Update statistics
function updateStats(expenses) {
  const total = expenses.reduce(
    (sum, expense) => sum + parseInt(expense.amount),
    0
  );
  const average = expenses.length ? Math.round(total / expenses.length) : 0;

  totalExpenses.textContent = `₹${total}`;
  expensesCount.textContent = expenses.length;
  avgExpense.textContent = `₹${average}`;
  expensesCountHeader.textContent = `${expenses.length} ${
    expenses.length === 1 ? "item" : "items"
  }`;
}

// Render chart
function renderChart(expenses) {
  const ctx = document.getElementById("expense-chart").getContext("2d");

  // Group expenses by category
  const categories = {
    food: 0,
    travel: 0,
    party: 0,
    bills: 0,
  };

  expenses.forEach((expense) => {
    if (categories.hasOwnProperty(expense.category)) {
      categories[expense.category] += parseInt(expense.amount);
    }
  });

  // Destroy existing chart if it exists
  if (expenseChart) {
    expenseChart.destroy();
  }

  // Create new chart
  expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Food", "Travel", "Party", "Bills"],
      datasets: [
        {
          data: [
            categories.food,
            categories.travel,
            categories.party,
            categories.bills,
          ],
          backgroundColor: [
            "rgba(76, 201, 240, 0.7)",
            "rgba(67, 97, 238, 0.7)",
            "rgba(252, 163, 17, 0.7)",
            "rgba(247, 37, 133, 0.7)",
          ],
          borderColor: [
            "rgba(76, 201, 240, 1)",
            "rgba(67, 97, 238, 1)",
            "rgba(252, 163, 17, 1)",
            "rgba(247, 37, 133, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "var(--text-primary)",
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `₹${context.raw}`;
            },
          },
        },
      },
    },
  });
}

// Get category display name
function getCategoryName(category) {
  const names = {
    food: "Food",
    travel: "Travel",
    party: "Party",
    bills: "Bills",
  };
  return names[category] || category;
}

// Edit expense - FIXED
function editExpense(id) {
  // Find the expense in our global array
  const expense = allExpenses.find((e) => e.id == id);

  if (expense) {
    amountInput.value = expense.amount;
    descriptionInput.value = expense.description;
    categorySelect.value = expense.category;
    editExpenseId = expense.id;

    // Update button text
    submitBtnText.textContent = "Update Expense";

    // Scroll to form
    document.getElementById("expense-form").scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Highlight form
    form.classList.add("form-highlight");
    setTimeout(() => {
      form.classList.remove("form-highlight");
    }, 2000);
  } else {
    console.error(`Expense with ID ${id} not found`);
    alert("Expense not found for editing. It might have been deleted.");
  }
}

// Delete expense
function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    axios
      .delete(`${API_URL}/delete/${id}`, { headers: { Authorization: token } })
      .then(() => {
        loadExpenses();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete expense. Please try again.");
      });
  }
}

// Add or update expense
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const amount = amountInput.value;
  const description = descriptionInput.value.trim();
  const category = categorySelect.value;

  if (!amount || !description || !category) {
    alert("Please fill in all fields.");
    return;
  }

  const expense = { amount, description, category };
  let apiCall;

  if (editExpenseId) {
    // Update existing expense
    apiCall = axios.put(`${API_URL}/update-expense/${editExpenseId}`, expense, {
      headers: { Authorization: token },
    });
  } else {
    // Add new expense
    apiCall = axios.post(`${API_URL}/add`, expense, {
      headers: { Authorization: token },
    });
  }

  apiCall
    .then(() => {
      form.reset();
      editExpenseId = null;
      submitBtnText.textContent = "Save Expense";
      loadExpenses();
    })
    .catch((err) => {
      console.error(editExpenseId ? "Update failed:" : "Add failed:", err);
      alert(
        `Failed to ${
          editExpenseId ? "update" : "add"
        } expense. Please try again.`
      );
    });
});

// Dark mode toggle
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = document.querySelector("#toggle-dark-mode i");

  if (document.body.classList.contains("dark-mode")) {
    icon.className = "fas fa-sun";
    localStorage.setItem("theme", "dark");
  } else {
    icon.className = "fas fa-moon";
    localStorage.setItem("theme", "light");
  }

  // Re-render chart to update colors
  if (expenseChart) {
    renderChart(allExpenses);
  }
});

// Initialize app
document.addEventListener("DOMContentLoaded", initApp);


//cashfree
const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage

    const response = await axios.post("http://localhost:3000/payment/pay", null, {
      headers: {
        Authorization: token,
      },
    });

    const data = response.data;
    const paymentSessionId = data.paymentSessionId;

    let checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: "_self",
    };
    await cashfree.checkout(checkoutOptions);
  } catch (error) {
    console.log("Error is: ", error);
  }
});