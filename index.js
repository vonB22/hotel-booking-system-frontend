const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_item');

menu.addEventListener('click', () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});



