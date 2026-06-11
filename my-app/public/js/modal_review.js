const reviewForm = document.getElementById('createReviewForm');

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
        gameRef: formData.get('gameId'),
        descricao: formData.get('reviewText'),
        avaliacao: Number(formData.get('rating')),
        curtidas: 0,
        data: new Date()
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
