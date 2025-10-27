document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toRegister = document.getElementById("toRegister");
  const toLogin = document.getElementById("toLogin");

  function resetAnimations(el) {
    el.classList.remove('form-enter-right','form-exit-left','form-enter-left','form-exit-right');
    // принудительный reflow, чтобы потом анимация запустилась заново
    // eslint-disable-next-line no-unused-expressions
    void el.offsetWidth;
  }

  function showRegister() {
    document.body.classList.add('register-active');

    // login -> exit to left
    resetAnimations(loginForm);
    loginForm.classList.add('form-exit-left');
    // скрытый по завершении анимации
    setTimeout(() => {
      loginForm.classList.remove('active');
      loginForm.classList.add('hidden');
      resetAnimations(loginForm);
    }, 450);

    // register > enter from right
    registerForm.classList.remove('hidden');
    resetAnimations(registerForm);
    registerForm.classList.add('form-enter-right');
    // активный после начала анимации
    setTimeout(() => {
      registerForm.classList.add('active');
      resetAnimations(registerForm);
    }, 20);
  }

  function showLogin() {
    document.body.classList.remove('register-active');

    // register > exit to right
    resetAnimations(registerForm);
    registerForm.classList.add('form-exit-right');
    setTimeout(() => {
      registerForm.classList.remove('active');
      registerForm.classList.add('hidden');
      resetAnimations(registerForm);
    }, 450);

    // login > enter from left
    loginForm.classList.remove('hidden');
    resetAnimations(loginForm);
    loginForm.classList.add('form-enter-left');
    setTimeout(() => {
      loginForm.classList.add('active');
      resetAnimations(loginForm);
    }, 20);
  }

  // обработчики
  toRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
  });

  toLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });

});

// Регистрация
document.querySelector("#registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target.querySelector('input[placeholder="Имя пользователя"]').value;
  const email = e.target.querySelector('input[placeholder="Email"]').value;
  const password = e.target.querySelector('input[placeholder="Пароль"]').value;

  try {
    const res = await fetch("http://localhost:8000/accounts/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      credentials: "include"
    });

    const data = await res.json();
    if (res.ok) {
      alert("регистрация выполнена");
      console.log("ответ от сервера:", data);
    } else {
      alert(data.message || "ошибка регистрации");
    }
  } catch (err) {
    console.error("ошибка:", err);
    alert("запрос не отправлен");
  }
});

// Вход
document.querySelector("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.querySelector('input[placeholder="Email"]').value;
  const password = e.target.querySelector('input[placeholder="Пароль"]').value;

  try {
    const res = await fetch("http://localhost:8000/accounts/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    const data = await res.json();
    if (res.ok) {
      alert("вход выполнен");
      console.log("ответ от сервера:", data);
    } else {
      alert(data.message || "ошибка входа");
    }
  } catch (err) {
    console.error("ошибка:", err);
    alert("запрос не отправлен");
  }

  
});

// document.querySelector("logoutForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   try {
//     fetch("http://localhost:8000/accounts/logout/", {
//     method: "POST",
//     credentials: "include"
//     });
//   } catch (err) {
//     console.error("ошибка:", err);
//   }
  
// });