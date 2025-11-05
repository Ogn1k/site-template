const totalPriceDiv = document.querySelector('.price');

function updateTotal() {
  var total = 0;
  document.querySelectorAll('.cart-item').forEach(item => {
    const count = parseInt(item.querySelector('.count').textContent);
    const priceText = item.querySelector('.cost-value').textContent; 
    const price = parseFloat(priceText.replace(/[^\d,.]/g, '').replace(',', '.'));
    total += count * price;
  });
  totalPriceDiv.textContent = total.toFixed(2) + " Р";
}

document.querySelectorAll('.cart-item').forEach(item => {
  const minus = item.querySelector('.minus');
  const plus = item.querySelector('.plus');
  const count = item.querySelector('.count');

  minus.addEventListener('click', () => {
    let value = parseInt(count.textContent);
    if (value > 1) {
      count.textContent = value - 1;
      updateTotal();
    }
  });

  plus.addEventListener('click', () => {
    let value = parseInt(count.textContent);
    count.textContent = value + 1;
    updateTotal();
  });
});


