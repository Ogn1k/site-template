const container = document.querySelector('.slider-container');
const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const pagination = document.querySelector('.slider-pagination');

let currentIndex = 0;
const totalSlides = slides.length;
let autoplayTimer = null;

function initPagination()
{
    pagination.innerHTML = '';
    for(let i = 0; i < totalSlides; i++)
    {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(i);
            startAutoplay();
        });
        pagination.appendChild(dot);
    }
}

initPagination();
const dots = Array.from(document.querySelectorAll('.slider-dot'));

function goToSlide(index)
{
    index = ((index % totalSlides) + totalSlides) % totalSlides;
    currentIndex = index;

    const containerWidth = container.clientWidth;
    const slide = slides[index];
    const slideWidth = slide.offsetWidth;
    const slideOffsetLeft = slide.offsetLeft;

    const centerOffset = slideOffsetLeft - (containerWidth - slideWidth) / 2;

//    const offset = -(index * (105 / slidesPerView));
    track.style.transition = 'transform .9s ease-in-out';
    track.style.transform = `translateX(${-centerOffset}px)`;

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

let resizeDebounce;
window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => { goToSlide(currentIndex); }, 120);
});

function startAutoplay(interval = 5000)
{
    stopAutoplay();
    autoplayTimer = setInterval(() => { goToSlide(currentIndex + 1); }, interval);
}

function stopAutoplay()
{
    if(autoplayTimer)
    {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

goToSlide(0);
startAutoplay();

container.addEventListener('mouseenter', stopAutoplay);
container.addEventListener('mouseleave', () => startAutoplay(4000));