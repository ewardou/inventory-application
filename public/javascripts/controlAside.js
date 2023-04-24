const closeAsideBtn = document.querySelector('.close-aside');
const hamburgerBtn = document.querySelector('.hamburger');

closeAsideBtn.addEventListener('click', () => {
    document.querySelector('aside').classList.remove('visible');
});
hamburgerBtn.addEventListener('click', () => {
    document.querySelector('aside').classList.add('visible');
});
