// log in

const loginButton = document.getElementById('in');

loginButton.addEventListener('click', () => {

    const email = document.getElementById('email').value;

    const password = document.getElementById('password').value;

    const user = JSON.parse(localStorage.getItem(email));

    if (!user) {

        alert('User not found');

        return;

    }

    if (user.password !== password) {

        alert('Wrong password');

        return;

    }

    localStorage.setItem('user', email);

    alert('Login successful');

    window.location.href = './index_s.html';

});

// log out

const button = document.getElementById('in');

button.addEventListener('click', () => {

    const username = document.getElementById('name').value;

    const email = document.getElementById('email').value;

    const password = document.getElementById('password').value;

    const repeatPassword = document.getElementById('repeat_password').value;

    if (password !== repeatPassword) {

        alert('Passwords do not match');

        return;

    }

    const user = {

        username,
        email,
        password

    };

    localStorage.setItem(email, JSON.stringify(user));

    alert('Registration successful');

});
