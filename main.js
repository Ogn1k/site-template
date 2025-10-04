const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const pagination = document.querySelector('.slider-pagination');

const slidesPerView = 3;
let currentIndex = 0;
const totalSlides = slides.length;

const totalPages = totalSlides - slidesPerView + 1;

for(let i = 0; i < totalPages; i++)
{
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    pagination.appendChild(dot);
}

const dots = document.querySelectorAll('.slider-dot');

function updatePagination()
{
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

function goToSlide(index)
{
    if (index < 0) index = totalPages - 1;
    if (index >= totalPages) index = 0;
    currentIndex = index;
    const offset = -(index * (100 / slidesPerView));
    track.style.transform = `translateX(${offset}%)`;
    updatePagination();
}

setInterval(() => { goToSlide(currentIndex + 1); }, 4000);