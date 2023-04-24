const btn = document.querySelector('.confirm');
const modal = document.querySelector('.modal');
btn.addEventListener('click', () => {
    modal.setAttribute('style', 'visibility: visible');
});
const closeBtn = document.querySelector('.close-modal');
closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.setAttribute('style', 'visibility: hidden');
});
const modalBtn = document.querySelector('.modal button:nth-of-type(2)');
const modalInput = document.querySelector('.modal input');
const modalMsg = document.querySelector('.modal p');

modalBtn.addEventListener('click', (e) => {
    if (modalInput.value !== 'password') {
        e.preventDefault();
        modalInput.value = '';
        modalMsg.textContent = 'Incorrect password';
    }
});
