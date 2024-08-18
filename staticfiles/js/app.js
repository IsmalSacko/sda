document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour charger les propriétés
    window.loadProperties = function() {
        axios.get('/api/properties/')
            .then(response => {
                const properties = response.data;
                const container = document.getElementById('properties-container');
                const carouselInner = document.querySelector('.carousel-inner');

                // Vérifiez si les conteneurs existent
                if (!container || !carouselInner) {
                    console.error('Le conteneur des propriétés ou du carrousel n\'existe pas dans le DOM.');
                    return;
                }

                container.innerHTML = '';
                carouselInner.innerHTML = ''; // Vider le carrousel

                if (properties.length === 0) {
                    container.innerHTML = '<p>Aucune propriété trouvée.</p>';
                    return;
                }

                properties.forEach((property, index) => {
                    // Card de la propriété
                    const propertyCard = `
                        <div class="col-md-4">
                            <div class="card property-card">
                                <img src="${property.image || 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/aa/42/e4/azalai-hotel-salam.jpg?w=1400&h=-1&s=1'}" class="card-img-top" alt="${property.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${property.title}</h5>
                                    <p class="card-text">${property.description}</p>
                                    <p class="card-text"><strong>Zone:</strong> ${property.zone_name}</p>
                                    <p class="card-text"><strong>Prix:</strong> ${property.price_in_fcfa} FCFA</p>
                                    <a href="reservation/" class="btn btn-primary btn-sm">Réserver</a>
                                </div>
                            </div>
                        </div>
                    `;
                    container.innerHTML += propertyCard;

                    // Slide du carrousel
                    const carouselItem = `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${property.image || 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/aa/42/e4/azalai-hotel-salam.jpg?w=1400&h=-1&s=1'}" class="d-block w-100" alt="${property.title}">
                            <div class="carousel-caption d-none d-md-block">
                                <h5>${property.title}</h5>
                                <p>${property.description}</p>
                            </div>
                        </div>
                    `;
                    carouselInner.innerHTML += carouselItem;
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des propriétés:', error.response ? error.response.data : error.message);
                Toastify({
                    text: "Erreur lors de la récupération des propriétés",
                    duration: 3000,
                    backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true
                }).showToast();
            });
    };

    // Charger les propriétés automatiquement lors du chargement de la page
    loadProperties();
});
