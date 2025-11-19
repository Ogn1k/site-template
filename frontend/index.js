const cardsData = {
  1: { title: "Lorem Ipsum #1", description: "Подробная информация о Lorem Ipsum #1" },
  2: { title: "Pretium tellus #2", description: "Расширенное описание Pretium tellus #2" },
  3: { title: "Conubia nostra #3", description: "Детали и информация Conubia nostra #3" }
};

const popup = document.querySelector('.info-popup');
const popupTitle = document.querySelector('.title-text');
const popupDesc = document.querySelector('.description-text');
const closeButton = document.querySelector('.close-popup-button');
const overlay = document.querySelector('.darker');

document.querySelectorAll('.button-card').forEach(button => {
  button.addEventListener('click', () => {
    overlay.style.display = 'block';
    const cardDiv = button.closest('.card');
    const id = cardDiv.querySelector('button').getAttribute('data-id');
    const data = cardsData[id];
    
    popupTitle.textContent = data.title;
    popupDesc.textContent = data.description;

    popup.style.display = 'block'; 
  });
});



closeButton.addEventListener('click', () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
});   

overlay.addEventListener('click', () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
});