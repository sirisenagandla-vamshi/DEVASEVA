import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // ✅ Base URL for all requests
});

export default instance;