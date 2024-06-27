import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchImages } from './pixabay-api';
import { refs } from './refs';
import { renderGallery } from './render-functions';

let searchQuery = '';
let page = 1;

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(event) {
  event.preventDefault();
  page = 1;
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.style.display = 'none';
  searchQuery = event.target.searchQuery.value.trim();
  if (!searchQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Empty input, please enter your query.',
    });
    return;
  }
  try {
    const { hits, totalHits } = await fetchImages(searchQuery, page);
    if (hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
      });
      return;
    }
    renderGallery(hits);

    if (page * 40 >= totalHits) {
      refs.loadMoreBtn.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      refs.loadMoreBtn.style.display = 'block';
    }

    iziToast.success({
      title: 'Success',
      message: `Hooray! We found ${totalHits} images.`,
    });
  } catch (error) {
    console.log(error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
    });
  }
}

async function onLoadMoreBtnClick(event) {
  page += 1;
  try {
    const { hits, totalHits } = await fetchImages(searchQuery, page);
    renderGallery(hits);
    if (page * 40 >= totalHits) {
      refs.loadMoreBtn.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
    });
  }
}
