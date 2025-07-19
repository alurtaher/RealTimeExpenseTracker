const form = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categorySelect = document.getElementById("category");
const expenseList = document.getElementById("expense-list");
const token = localStorage.getItem("token");

const API_URL = "http://localhost:3000/expense";

let editExpenseId = null; // Track if we're editing

// Load existing expenses from API
function loadExpenses() {
  axios
    .get(`${API_URL}/get`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      res.data.forEach(addExpenseToScreen);
    })
    .catch((err) => console.error("Error fetching expenses:", err));
}

function addExpenseToScreen(expense) {
  const card = document.createElement("div");
  card.className = "card mb-3 expense-card shadow-sm";

  const cardBody = document.createElement("div");
  cardBody.className =
    "card-body d-flex justify-content-between align-items-center";

  const details = document.createElement("div");
  details.innerHTML = `
    <h5 class="card-title text-success">₹ ${expense.amount}</h5>
    <p class="card-text mb-1">${expense.description}</p>
    <span class="badge bg-secondary">${expense.category}</span>
  `;

  const actions = document.createElement("div");
  actions.className = "d-flex flex-column gap-2";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "btn btn-warning btn-sm";
  editBtn.onclick = () => {
    amountInput.value = expense.amount;
    descriptionInput.value = expense.description;
    categorySelect.value = expense.category;
    editExpenseId = expense.id; // Set the ID for edit mode
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn btn-danger btn-sm";
  deleteBtn.onclick = () => {
    deleteExpense(expense.id);
  };

  actions.append(editBtn, deleteBtn);
  cardBody.append(details, actions);
  card.append(cardBody);
  expenseList.append(card);
}

//Delete Expense
function deleteExpense(expenseId) {
  axios
    .delete(`${API_URL}/delete/${expenseId}`, {
      headers: { Authorization: token },
    })
    .then(() => {
      console.log("Deleted expense", expenseId);
      refreshExpenses();
    })
    .catch((err) => console.error("Delete failed:", err));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const amount = amountInput.value;
  const description = descriptionInput.value;
  const category = categorySelect.value;

  if (!amount || !description || !category) {
    alert("Please fill in all fields.");
    return;
  }

  const expense = { amount, description, category };

  if (editExpenseId) {
    // Update existing expense
    axios
      .put(`${API_URL}/update-expense/${editExpenseId}`, expense, {
        headers: { Authorization: token },
      })
      .then(() => {
        refreshExpenses();
        form.reset();
        editExpenseId = null;
      })
      .catch((err) => console.error("Failed to update expense:", err));
  } else {
    // Add new expense
    axios
      .post(`${API_URL}/add`, expense, {
        headers: { Authorization: token },
      })
      .then((res) => {
        addExpenseToScreen(res.data);
        form.reset();
      })
      .catch((err) => console.error("Failed to add expense:", err));
  }
});

// Refresh all expenses (used after update/delete)
function refreshExpenses() {
  expenseList.innerHTML = "";
  loadExpenses();
}

// Load on page load
window.addEventListener("DOMContentLoaded", () => {
  loadExpenses();

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
});

// Dark mode toggle
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );
});