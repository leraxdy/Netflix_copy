// REGISTER - для страницы Sign_up.html
if (window.location.pathname.includes('Sign_up.html') || window.location.pathname.includes('sign_up.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const registerButton = document.getElementById('register');
        
        if (registerButton) {
            registerButton.addEventListener('click', (event) => {
                event.preventDefault();

                const username = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const repeatPassword = document.getElementById('repeat_password').value;
                const childrenMode = document.getElementById('child_mode');

                // Проверка на пустые поля
                if (!username || !email || !password || !repeatPassword) {
                    alert('Please fill all fields');
                    return;
                }

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
                    password,
                    childMode: childrenMode.checked
                };

                // Сохраняем в localStorage
                localStorage.setItem(email, JSON.stringify(user));

                // Запоминаем текущего пользователя
                localStorage.setItem('currentUser', email);



                // Переход на нужную страницу
                if (childrenMode.checked) {
                    window.location.href = './index_v.html';
                } else {
                    window.location.href = './index_s.html';
                }
            });
        }
    });
}

// LOGIN - для страницы index.html
else if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', () => {
        const loginButton = document.getElementById('login');
        
        if (loginButton) {
            loginButton.addEventListener('click', (event) => {
                event.preventDefault();

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const childrenMode = document.getElementById('child_mode');

                // Проверка на пустые поля
                if (!email || !password) {
                    alert('Please fill all fields');
                    return;
                }

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


                // Переход
                if (childrenMode.checked) {
                    window.location.href = './index_v.html';
                } else {
                    window.location.href = './index_s.html';
                }
            });
        }
    });
}