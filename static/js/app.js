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
        if (event) event.preventDefault(); // Empêche le comportement par défaut du lien

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
                                <label for="image-file">Image</label>
                                <input type="file" class="form-control" id="image-file">
                                <input type="hidden" id="image-url" value="${property.image}">
                                <div class="form-group">
                                    <label for="image-url-display">URL de l'image</label>
                                    <input type="text" class="form-control" id="image-url-display" value="${property.image}" readonly>
                                </div>
                                <img id="current-image" src="${property.image}" alt="Image actuelle" style="max-width: 100%; max-height: 300px; display: block; margin: 0 auto;">
                            </div>
                            <button type="submit" class="btn btn-primary">Sauvegarder</button>
                            <a href="#" class="btn btn-secondary" onclick="loadProperties()">Annuler</a>
                        </form>
                    </div>
                `;

                // Remplacer le contenu du body avec le formulaire d'édition
                document.body.innerHTML = editFormHTML;

                // Gestionnaire d'événements pour le changement d'image
                document.getElementById('image-file').addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            document.getElementById('current-image').src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                // Ajouter un gestionnaire d'événements pour le formulaire d'édition
                document.getElementById('edit-property-form').addEventListener('submit', function(event) {
                    event.preventDefault();

                    const formData = new FormData();
                    formData.append('title', document.getElementById('title').value);
                    formData.append('description', document.getElementById('description').value);
                    formData.append('price_in_fcfa', document.getElementById('price').value);
                    formData.append('zone', document.getElementById('zone').value);

                    const imageFile = document.getElementById('image-file').files[0];
                    const imageUrl = document.getElementById('image-url').value;

                    if (imageFile) {
                        formData.append('image', imageFile);
                    } else {
                        formData.append('image_url', imageUrl);
                    }

                    axios.patch(`http://127.0.0.1:8000/api/properties/${propertyId}/`, formData, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'X-CSRFToken': csrfToken,
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => {
                        Toastify({
                            text: "Propriété mise à jour avec succès!",
                            duration: 3000,
                            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                            gravity: "top",
                            position: "right",
                            stopOnFocus: true
                        }).showToast();

                        setTimeout(location.reload.bind(location), 2000);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la mise à jour de la propriété:', error.response ? error.response.data : error.message);
                        Toastify({
                            text: "Erreur lors de la mise à jour de la propriété",
                            duration: 3000,
                            backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
                            gravity: "top",
                            position: "right",
                            stopOnFocus: true
                        }).showToast();
                    });
                });
            })
            .catch(zoneError => {
                console.error('Erreur lors de la récupération des zones:', zoneError.response ? zoneError.response.data : zoneError.message);
                Toastify({
                    text: "Erreur lors de la récupération des zones",
                    duration: 3000,
                    backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true
                }).showToast();
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des détails de la propriété:', error.response ? error.response.data : error.message);
            Toastify({
                text: "Erreur lors de la récupération des détails de la propriété",
                duration: 3000,
                backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
                gravity: "top",
                position: "right",
                stopOnFocus: true
            }).showToast();
        });
    }

    function getUserProfile() {
        const authToken = localStorage.getItem('authToken');
        const csrfToken = getCookie('csrftoken');
    
        return axios.get('http://127.0.0.1:8000/api/user-profile/', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'X-CSRFToken': csrfToken
            }
        });
    }
    
///debut de la fonction loadProperties
    window.loadProperties = function() {
        getUserProfile()
            .then(profileResponse => {
                const userRole = profileResponse.data.role; // Récupérer le rôle de l'utilisateur
                
                axios.get('http://127.0.0.1:8000/api/properties/', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'X-CSRFToken': csrfToken
                    }
                })
                .then(response => {
                    const properties = response.data;
                    const container = document.getElementById('properties-container');
    
                    // Vérifiez si le conteneur existe
                    if (!container) {
                        console.error('Le conteneur des propriétés n\'existe pas dans le DOM.');
                        return;
                    }
    
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
                                        <p class="card-text"><strong>Zone:</strong> ${property.zone_name}</p>
                                        <p class="card-text"><strong>Prix:</strong> ${property.price_in_fcfa} FCFA</p>
                                        ${userRole === 'superuser' ? `<a href="#" class="btn btn-primary" data-id="${property.id}" 
                                            onclick="openEditForm(event)">Modifier</a>` : `<a href="#" data-id="${property.id}" class="btn btn-primary btn-sm">Réserver</a>`}
                                    </div>
                                </div>
                            </div>
                        `;
                        container.innerHTML += propertyCard;
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
            })
            .catch(profileError => {
                console.error('Erreur lors de la récupération du profil utilisateur:', profileError.response ? profileError.response.data : profileError.message);
                Toastify({
                    text: "Erreur lors de la récupération du profil utilisateur",
                    duration: 3000,
                    backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true
                }).showToast();
            });
    };






    

// Ajouter un gestionnaire d'événements pour le bouton reserver
    document.addEventListener('click', function(event) {
        if (event.target && event.target.textContent === 'Réserver') {
            const propertyId = event.target.getAttribute('data-id');
            axios.post('http://127.0.0.1:8000/api/reservations/', { property: propertyId }, 
            {
                headers: {
                    
                    'X-CSRFToken': csrfToken
                }
            }) 
            .then(response => {
                Toastify({
                    text: "Propriété réservée avec succès!",
                    duration: 3000,
                    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true
                }).showToast();
            })
            .catch(error => {
                console.error('Erreur lors de la réservation de la propriété:', error.response ? error.response.data : error.message);
                Toastify({
                    text: "Erreur lors de la réservation de la propriété",
                    duration: 3000,
                    backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true
                }).showToast();
            });

        }
    }
    );   

///fin de la fonction loadProperties    
    

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
            Toastify({
                text: "Connexion réussie!",
                duration: 3000,
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                gravity: "top",
                position: "right",
                stopOnFocus: true
            }).showToast();
             // Rediriger vers la page d'accueil après 6 secondes
             setTimeout(location.reload.bind(location), 1000);
             
        })
        .catch(error => {
            console.error('Erreur de connexion:', error.response ? error.response.data : error.message);
            Toastify({
                text: "Erreur de connexion",
                duration: 3000,
                backgroundColor: "linear-gradient(to right, #FF5F6D, #FFC371)",
                gravity: "top",
                position: "right",
                stopOnFocus: true
            }).showToast();
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
