document.querySelectorAll('.cart-item').forEach(item => {
  const minus = item.querySelector('.minus');
  const plus = item.querySelector('.plus');
  const count = item.querySelector('.count');

  minus.addEventListener('click', () => {
    let value = parseInt(count.textContent);
    if (value > 1) count.textContent = value - 1;
  });

  plus.addEventListener('click', () => {
    let value = parseInt(count.textContent);
    count.textContent = value + 1;
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("site-header");
  const main = document.querySelector("main") || document.querySelector(".container");
  
  if (header && main) {
    const headerHeight = header.offsetHeight;
    main.style.paddingTop = headerHeight + "px";
  }
});