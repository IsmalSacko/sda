//aller chercher axios depuis le CDN
import axios from 'axios';


const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
