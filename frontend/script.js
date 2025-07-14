// Selecting the container and toggle buttons
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const api = 'https://crudcrud.com/api/4404b14863f246c7a55d812abc81aa11'

// Toggle animations
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

// Handling Register Form Submission
const registerForm = document.querySelector('.form-box.register form');

registerForm.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent page reload

    // Get values from the form
    const username = registerForm.querySelector('input[placeholder="Username"]').value;
    const email = registerForm.querySelector('input[placeholder="Email"]').value;
    const password = registerForm.querySelector('input[placeholder="Password"]').value;

    // Create data object
    const formData = {
        username: username,
        email: email,
        password: password
    };

    console.log("Register Form Data:", formData); // for debugging

    // Send data to CrudCrud endpoint via Axios
    axios.post(`${api}/register`, formData)
        .then(response => {
            alert("Registration Successful!");
            registerForm.reset();
            container.classList.remove('active'); // switch to login form
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Registration Failed. Please try again.");
        });
});