// REGISTER

const registerButton = document.getElementById('register');

registerButton.addEventListener('click', () => {

    const username = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat_password').value;
    const childrenMode = document.getElementById('child_mode');

    // Проверка паролей
    if (password !== repeatPassword) {
        alert('Passwords do not match');
        return;
    }

    // Проверяем существует ли пользователь
    if (localStorage.getItem(email)) {
        alert('User already exists');
        return;
    }

    // Создаем объект пользователя
    const user = {
        username,
        email,
        password
    };

    // Сохраняем в localStorage
    localStorage.setItem(email, JSON.stringify(user));

    // Запоминаем текущего пользователя
    localStorage.setItem('currentUser', email);

    alert('Registration successful');

    // Переход на нужную страницу
    if (childrenMode.checked) {
        window.location.href = './index_v.html';
    } else {
        window.location.href = './index_s.html';
    }

});



// LOGIN

const loginButton = document.getElementById('login');

loginButton.addEventListener('click', () => {

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const childrenMode = document.getElementById('child_mode');

    // Получаем пользователя
    const user = JSON.parse(localStorage.getItem(email));

    // Проверка существования
    if (!user) {
        alert('User not found');
        return;
    }

    // Проверка пароля
    if (user.password !== password) {
        alert('Wrong password');
        return;
    }

    // Запоминаем текущего пользователя
    localStorage.setItem('currentUser', email);

    alert('Login successful');

    // Переход
    if (childrenMode.checked) {
        window.location.href = './index_v.html';
    } else {
        window.location.href = './index_s.html';
    }

});