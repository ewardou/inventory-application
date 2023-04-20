const btn = document.querySelector('.confirm');
btn.addEventListener('click', () => {
    document
        .querySelector('.modal')
        .setAttribute('style', 'visibility: visible');
});
const modalBtn = document.querySelector('.modal button');
const modalInput = document.querySelector('.modal input');
const modalMsg = document.querySelector('.modal p');

modalBtn.addEventListener('click', (e) => {
    if (modalInput.value !== 'password') {
        e.preventDefault();
        modalInput.value = '';
        modalMsg.textContent = 'Incorrect password';
    }
});
