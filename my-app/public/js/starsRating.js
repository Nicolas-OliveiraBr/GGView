document.addEventListener('DOMContentLoaded', () => {

const stars = document.querySelectorAll('.star-selectable');
const ratingInput = document.getElementById('selectedRating');

stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => {
        resetStars();
        for (let i = 0; i <= index; i++) {
            stars[i].classList.replace('bi-star', 'bi-star-fill');
            stars[i].classList.add('star-hover');
        }
    });

    star.addEventListener('mouseleave', () => {
        updateVisualRating(ratingInput.value);
    });

    star.addEventListener('click', () => {
        ratingInput.value = index + 1; 
        updateVisualRating(ratingInput.value);
    });
});

function resetStars() {
    stars.forEach(s => {
        s.classList.replace('bi-star-fill', 'bi-star');
        s.classList.remove('star-hover', 'star-selected');
    });
}

function updateVisualRating(value) {
    resetStars();
    for (let i = 0; i < value; i++) {
        stars[i].classList.replace('bi-star', 'bi-star-fill');
        stars[i].classList.add('star-selected');
    }
}

})