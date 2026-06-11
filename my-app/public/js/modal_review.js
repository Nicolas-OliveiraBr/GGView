const reviewForm = document.getElementById('createReviewForm');

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(reviewForm); 
    const data = {
        gameRef: formData.get('gameId'),
        descricao: formData.get('reviewText'),
        avaliacao: Number(formData.get('rating')),
        userRef: "Nome do Usuário",
        curtidas: 0
    };


    try {
        const response = await fetch('/create', { // Colocar a API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            reviewForm.reset(); 
            
            const modalElement = reviewForm.closest('.modal');
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
