document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('authToken');
    const csrfToken = getCookie('csrftoken');

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

    window.openEditForm = function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien

        const propertyId = event.target.getAttribute('data-id');

        axios.get(`http://127.0.0.1:8000/api/properties/${propertyId}/`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            const property = response.data;

            // Récupérer la liste des zones
            axios.get('http://127.0.0.1:8000/api/zones/', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'X-CSRFToken': csrfToken
                }
            })
            .then(zoneResponse => {
                const zones = zoneResponse.data;

                // Créer un formulaire d'édition
                const editFormHTML = `
                    <div class="container mt-4">
                        <h2>Modifier la Propriété</h2>
                        <form id="edit-property-form">
                            <input type="hidden" id="property-id" value="${propertyId}">
                            <div class="form-group">
                                <label for="title">Titre</label>
                                <input type="text" class="form-control" id="title" value="${property.title}" required>
                            </div>
                            <div class="form-group">
                                <label for="description">Description</label>
                                <textarea class="form-control" id="description" required>${property.description}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="price">Prix (FCFA)</label>
                                <input type="number" class="form-control" id="price" value="${property.price_in_fcfa}" required>
                            </div>
                            <div class="form-group">
                                <label for="zone">Zone</label>
                                <select class="form-control" id="zone" required>
                                    ${zones.map(zone => `
                                        <option value="${zone.id}" ${zone.id === property.zone ? 'selected' : ''}>${zone.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="image">URL de l'image</label>
                                <input type="text" class="form-control" id="image" value="${property.image}">
                            </div>
                            <button type="submit" class="btn btn-primary">Sauvegarder</button>
                            <a href="#" class="btn btn-secondary" onclick="loadProperties()">Annuler</a>
                        </form>
                    </div>
                `;

                // Remplacer le contenu du body avec le formulaire d'édition
                document.body.innerHTML = editFormHTML;

                // Ajouter un gestionnaire d'événements pour le formulaire d'édition
                document.getElementById('edit-property-form').addEventListener('submit', function(event) {
                    event.preventDefault();

                    axios.put(`http://127.0.0.1:8000/api/properties/${propertyId}/`, {
                        title: document.getElementById('title').value,
                        description: document.getElementById('description').value,
                        price_in_fcfa: document.getElementById('price').value,
                        zone: document.getElementById('zone').value,
                        image: document.getElementById('image').value
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
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
                });
            })
            .catch(zoneError => {
                console.error('Erreur lors de la récupération des zones:', zoneError);
                alert('Erreur lors de la récupération des zones');
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des détails de la propriété:', error);
            alert('Erreur lors de la récupération des détails de la propriété');
        });
    }

    window.loadProperties = function() {
        axios.get('http://127.0.0.1:8000/api/properties/', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
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
                            <img src="${property.image || 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/aa/42/e4/azalai-hotel-salam.jpg?w=1400&h=-1&s=1'}" class="card-img-top" alt="${property.title}">
                            <div class="card-body">
                                <h5 class="card-title">${property.title}</h5>
                                <p class="card-text">${property.description}</p>
                                <p class="card-text"><strong>Zone:</strong> ${property.zone}</p>
                                <p class="card-text"><strong>Prix:</strong> ${property.price_in_fcfa} FCFA</p>
                                <a href="#" class="btn btn-primary" data-id="${property.id}" onclick="openEditForm(event)">Modifier</a>
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
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            alert('Connexion réussie');
            window.location.reload();
        })
        .catch(error => {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion');
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (localStorage.getItem('authToken')) {
        loadProperties();
    }
});
