const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const tbody = document.getElementById("tbodyId");
const logoutBtn = document.getElementById("logoutBtn");

categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});

async function getLeaderboard() {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:3000/premium/getAllUsers", {
    headers: {
      Authorization: token,
    },
  });
  let position = 1;
  res.data.forEach((user) => {
    let name = user.name;
    let amount = user.totalExpenses;

    let tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");

    tbody.appendChild(tr);

    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.appendChild(document.createTextNode(position++));

    let td1 = document.createElement("td");
    td1.appendChild(document.createTextNode(name));

    let td2 = document.createElement("td");
    td2.appendChild(document.createTextNode(amount));

    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
  });
}

async function logout() {
  try {
    localStorage.clear();
    window.location.href = "./index.html";
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", getLeaderboard);
logoutBtn.addEventListener("click", logout);
