document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('like-icon-clickable')) {
        const icon = e.target;
        const container = icon.closest('.modal-like');
        const input = container.querySelector('.is-favorite-input');

        icon.classList.toggle('bi-heart');
        icon.classList.toggle('bi-heart-fill');
        icon.classList.toggle('heart-active');

        const isFavorite = icon.classList.contains('bi-heart-fill');
        input.value = isFavorite;
    }
});