const reviewForm = document.getElementById('createReviewForm');

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        gameId: reviewForm.gameId.value,
        nameGame: reviewForm.nameGame.value,
        reviewText: reviewForm.reviewText.value,
        rating: document.getElementById('selectedRating').value,
        authorName: "<%= authorName %>"
    };

    try {
        const response = await fetch('/api/reviews', { // Colocar a API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            reviewForm.reset(); 
            // Fecha o modal usando a API do Bootstrap
            const modalElement = document.getElementById('staticBackdrop');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide(); 

            window.location.reload();
        } else {
            alert('Erro ao enviar a review.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});