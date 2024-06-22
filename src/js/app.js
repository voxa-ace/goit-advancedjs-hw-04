const API_KEY = '44529920-2c5437e602f6361a7a48a154a';
const BASE_URL = 'https://pixabay.com/api/';

let searchQuery = '';
let page = 1;
const perPage = 40;

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', fetchImages);

async function onSearch(event) {
  event.preventDefault();
  searchQuery = event.target.searchQuery.value.trim();
  if (!searchQuery) return;

  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  await fetchImages();
}

async function fetchImages() {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    const data = await response.json();

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again.',
      });
      return;
    }

    renderGallery(data.hits);

    if (page * perPage >= data.totalHits) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      loadMoreBtn.style.display = 'block';
    }

    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${data.totalHits} images.`,
    });

    page += 1;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
    });
  }
}

function renderGallery(images) {
  const markup = images.map(image => {
    return `
      <a href="${image.largeImageURL}" class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </a>
    `;
  }).join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}
