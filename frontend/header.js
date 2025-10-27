async function loadHeader() {
  try {
    const response = await fetch('header.html');
    const html = await response.text();
    document.body.insertAdjacentHTML('afterbegin', html);
  } catch (err) {
    console.error('Ошибка при загрузке header:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadHeader);
