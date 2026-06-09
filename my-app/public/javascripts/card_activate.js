var button = document.getElementById('show-more');
button.addEventListener('click', () => {
    var card = document.querySelector('.game-card');
    card.classList.toggle('active');

    if (card.classList.contains('active')) {
        return button.innerHTML = '<i class="bi bi-caret-up-fill"></i>';
    }

    button.innerHTML = '<i class="bi bi-caret-down-fill"></i>';
});