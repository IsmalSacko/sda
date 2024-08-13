document.addEventListener('DOMContentLoaded', function() {
    // Token d'authentification fourni
    const authToken = '1f2d48fb81a04d86f5d34a7508278b981e54b2d8';
    const csrfToken = getCookie('csrftoken');

    // Fonction pour obtenir le cookie CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Fonction de connexion
    function handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        axios.post('http://127.0.0.1:8000/accounts/login/', {
            username: username,
            password: password
        }, {
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            const token = response.data.token; // Assurez-vous que la réponse contient le token
            localStorage.setItem('authToken', token); // Stocker le token dans le stockage local
            alert('Connexion réussie');
            window.location.reload(); // Recharger la page après connexion
        })
        .catch(error => {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion');
        });
    }
    
    // Fonction de récupération des propriétés
    function loadProperties() {
        axios.get('http://127.0.0.1:8000/api/properties/', {
            headers: {
                'Authorization': `Bearer ${authToken}`, // Utilisation du token fixe
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            const properties = response.data;
            const container = document.getElementById('properties-container');
            
            container.innerHTML = '';

            if (properties.length === 0) {
                container.innerHTML = '<p>Aucune propriété trouvée.</p>';
                return;
            }

            properties.forEach(property => {
                const propertyCard = `
                    <div class="col-md-4">
                        <div class="card property-card">
                            <img src="${property.imageUrl || 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/aa/42/e4/azalai-hotel-salam.jpg?w=1400&h=-1&s=1'}" class="card-img-top" alt="${property.title}">
                            <div class="card-body">
                                <h5 class="card-title">${property.title}</h5>
                                <p class="card-text">${property.description}</p>
                                <p class="card-text"><strong>Prix:</strong> ${property.price_in_fcfa} FCFA</p>
                                <a href="#" class="btn btn-primary" data-id="${property.id}" onclick="editProperty(event)">Modifier</a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += propertyCard;
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des propriétés:', error);
            alert('Erreur lors de la récupération des propriétés');
        });
    }
    
    // Fonction de modification de propriété
    function editProperty(event) {
        event.preventDefault();
        
        const propertyId = event.target.getAttribute('data-id');
        const title = prompt('Nouveau titre:');
        const description = prompt('Nouvelle description:');
        const price = prompt('Nouveau prix:');
        
        axios.put(`http://127.0.0.1:8000/api/properties/${propertyId}/`, {
            title: title,
            description: description,
            price: price
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`, // Utilisation du token fixe
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            alert('Propriété mise à jour avec succès');
            loadProperties(); // Recharger les propriétés après mise à jour
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour de la propriété:', error);
            alert('Erreur lors de la mise à jour de la propriété');
        });
    }
    
    // Gestion de la soumission du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Charger les propriétés au chargement de la page si déjà connecté
    if (localStorage.getItem('authToken')) {
        loadProperties();
    }
});
