// Selecting register form and message display element
const registerForm = document.querySelector(".form-box.register form");
const loginForm = document.querySelector(".form-box.login form");
const registerMessage = document.querySelector(".register-message");
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
const api = "http://localhost:3000";
registerMessage.style.color = "black";

// Toggle animations
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Register form submission handler
registerForm.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent form reload

  // Get values from input fields
  const usernameInput = registerForm.querySelector('input[placeholder="Name"]');
  const emailInput = registerForm.querySelector('input[placeholder="Email"]');
  const passwordInput = registerForm.querySelector(
    'input[placeholder="Password"]'
  );

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validate basic input
  if (!username || !email || !password) {
    registerMessage.style.color = "red";
    registerMessage.textContent = "All fields are required.";
    return;
  }

  // Create data object
  const formData = { username, email, password };

  // Clear previous message
  registerMessage.textContent = "";

  // Send data via Axios POST
  axios
    .post(`${api}/user/register`, formData)
    .then((response) => {
      registerMessage.style.color = "green";
      localStorage.setItem("userId", response.data.id);
      registerMessage.textContent = "Registration Successful!";
      registerForm.reset();

      // Remove error borders if any
      [usernameInput, emailInput, passwordInput].forEach((input) => {
        input.classList.remove("error");
      });

      // After short delay, switch to login and clear message
      setTimeout(() => {
        container.classList.remove("active");
        registerMessage.textContent = "";
      }, 1500);
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 400) {
          // Apply red border to all inputs
          [usernameInput, emailInput, passwordInput].forEach((input) => {
            input.classList.add("error");
          });

          registerMessage.style.color = "red";
          registerMessage.textContent = "User already exists. Please log in.";

          // Remove error borders after 2 seconds
          setTimeout(() => {
            [usernameInput, emailInput, passwordInput].forEach((input) => {
              input.classList.remove("error");
            });
            registerMessage.textContent = "";
          }, 2000);
        } else {
          registerMessage.style.color = "red";
          registerMessage.textContent =
            "Registration failed. Please try again.";
        }
      } else {
        // Network error (server offline or unreachable)
        registerMessage.style.color = "red";
        registerMessage.textContent =
          "Unable to connect to server. Check your connection.";
      }
    });
});

// Selecting login form and inputs
const loginMessage = document.createElement("p");
loginMessage.classList.add("login-message");
loginForm.appendChild(loginMessage); // Add message below form

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const emailInput = loginForm.querySelector('input[placeholder="Email"]');
  const passwordInput = loginForm.querySelector(
    'input[placeholder="Password"]'
  );

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Basic validation
  if (!email || !password) {
    loginMessage.style.color = "red";
    loginMessage.textContent = "Please enter both email and password.";
    return;
  }

  const loginData = { email, password };

  // Clear previous styles
  loginMessage.textContent = "";
  [emailInput, passwordInput].forEach((input) =>
    input.classList.remove("error")
  );

  axios
    .post(`${api}/user/login`, loginData)
    .then((response) => {
      loginMessage.style.color = "green";
      localStorage.setItem("userId", response.data.id);
      window.location.href = 'expense.html'
      loginMessage.textContent = "Login successful!";
    })
    .catch((error) => {
      console.log(error?.response?.data);

      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          loginMessage.style.color = "red";
          loginMessage.textContent = "User not found. Please register.";
          emailInput.classList.add("error");
        } else if (status === 401) {
          loginMessage.style.color = "red";
          loginMessage.textContent = "Incorrect password.";
          passwordInput.classList.add("error");
        } else if (status === 400) {
          loginMessage.style.color = "red";
          loginMessage.textContent = "Please fill in all required fields.";
        } else {
          loginMessage.style.color = "red";
          loginMessage.textContent = "Server error. Please try again later.";
        }

        setTimeout(() => {
          loginMessage.textContent = "";
          [emailInput, passwordInput].forEach((input) =>
            input.classList.remove("error")
          );
        }, 2000);
      }
    });
});