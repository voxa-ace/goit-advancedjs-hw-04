import axios from "axios";


const API_KEY = '44529920-2c5437e602f6361a7a48a154a';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, page, perPage = 40) {  
    const {data} = await axios(`?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    return data;
  }