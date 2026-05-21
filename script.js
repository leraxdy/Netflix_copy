const button = document.getElementById('in');

button.addEventListener('click', async () => {

    const username = document.getElementById('name').value;

    const email = document.getElementById('email').value;

    const password = document.getElementById('password').value;

    const repeatPassword = document.getElementById('repeat_password').value;

    // проверка паролей
    if (password !== repeatPassword) {

        alert('Passwords do not match');

        return;

    }

    try {

        const response = await fetch('http://localhost:5000/register', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                username,
                email,
                password

            })

        });

        const data = await response.json();

        console.log(data);

        alert(JSON.stringify(data));

    } catch (err) {

        console.log(err);

    }

});

const loginButton = document.getElementById('in');

if (loginButton) {

    loginButton.addEventListener('click', async () => {

        const email = document.getElementById('email').value;

        const password = document.getElementById('password').value;

        try {

            const response = await fetch('http://localhost:5000/login', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    email,
                    password

                })

            });

            const data = await response.json();

            console.log(data);

            alert(data.message);

            // SUCCESS LOGIN
            if (data.message === 'Login successful') {

                localStorage.setItem('user', email);

                window.location.href = 'home.html';

            }

        } catch (err) {

            console.log(err);

        }

    });

}