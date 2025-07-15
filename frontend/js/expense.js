const form = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categorySelect = document.getElementById("category");
const expenseList = document.getElementById("expense-list");
const userId = localStorage.getItem("userId")

const API_URL = "http://localhost:3000/expense";

let editExpenseId = null; //  track if we're editing

// Load existing expenses from API
function loadExpenses() {
  axios.get(`${API_URL}/get/${userId}`)
    .then(res => {
      res.data.forEach(addExpenseToScreen);
    })
    .catch(err => console.error("Error fetching expenses:", err));
}

function addExpenseToScreen(expense) {
  const card = document.createElement("div");
  card.className = "card mb-3 expense-card shadow-sm";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex justify-content-between align-items-center";

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

    editExpenseId = expense.id; //  set the id for edit mode
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn btn-danger btn-sm";
  deleteBtn.onclick = () => {
    card.remove();
    deleteExpense(expense.id);
  };

  actions.append(editBtn, deleteBtn);
  cardBody.append(details, actions);
  card.append(cardBody);
  expenseList.append(card);
}

function deleteExpense(id) {
  axios.delete(`${API_URL}/delete/${id}`)
    .then(() => console.log("Deleted expense", id))
    .catch(err => console.error("Delete failed:", err));
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const amount = amountInput.value;
  const description = descriptionInput.value;
  const category = categorySelect.value;

  if (!amount || !description) {
    alert("Please fill in all fields.");
    return;
  }

  const expense = { amount, description, category, userId };

  if (editExpenseId) {
    axios.put(`${API_URL}/update-expense/${editExpenseId}`, expense)
      .then(() => {
        refreshExpenses();
        form.reset();
        editExpenseId = null;
      })
      .catch(err => console.error("Failed to update expense:", err));
  } else {
    axios.post(`${API_URL}/add/${userId}`, expense)
      .then(res => {
        addExpenseToScreen(res.data);
        form.reset();
      })
      .catch(err => console.error("Failed to add expense:", err));
  }
});


// Refresh all expenses (used after update)
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
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});