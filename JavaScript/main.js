const apiKey = '13379312d7658386ada282ad9a0fc1a1';
const apiUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=';
const movieDiscover = '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1';
const imgUrl = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/';

let shoppingCart = [];
let movieList = [];
let subTotal = 0;

getMoviesFromApi();
checkLocalStorageIfExist();

if (checkLocalStorageIfExist('shoppingCart')){
  document.querySelector('#products-in-cart').innerHTML = parseLocalstorage('shoppingCart').length.toString();
}

function getMoviesFromApi(){
  fetch(apiUrl + apiKey + movieDiscover)
    .then(response => response.json())
    //.then(myJson => (printMovie(myJson.results)))
    .then(myJson => promiseToList(myJson.results))
    .then(printMovie)
    .catch(err => console.log(err));
}

function promiseToList(promise) {
  for (let obj of promise){
    movieList.push(obj);
  }
  console.log('List Created')
}

function printMovie() {
  console.log('List Loaded');
  const productPage = document.querySelector('#product-page');

  for (let movie of movieList){
    // movieList.push(movie);
    productPage.innerHTML = productPage.innerHTML +
    `<div data-movieID="${movie.id}" class="four wide horizontal card">
      <div class="image">
        <img src="${imgUrl + movie.poster_path}" alt="">
      </div>
      <div class="content">
        <div class="header">
          ${movie.title}
        </div>
        <div class="meta">
            Price: <span class="product-price">${movie.overview.length} Sek</span>
        </div>
        <div class="description">
          ${movie.overview}
        </div>
      </div>
      <div class="extra content">
        <div class="ui two buttons">
          <div class="ui basic green button show-modal" onclick="$('.ui.modal').modal('show');modalToCart(${movie.id})">Buy</div>
        </div>
      </div>
    </div>`
  }
}

function modalToCart(movieId) {
  let movie = movieList.find(p => p.id === movieId);
  const modal = document.querySelector('.modal');

  console.log(movie);

  modal.innerHTML = `
  <div class="image content row">
    <div class="ui medium image">
      <img src="${imgUrl+movie.poster_path}" alt="">
    </div>
    <div class="description modal-description">
      <div class="ui header">${movie.title}</div>
      <h4>Price: ${movie.overview.length} Sek</h4>
      <p>${movie.overview}</p>
      <div class="actions">
        <form name="add-to-cart-form" onsubmit="event.preventDefault(); addToCart()" data-value="${movie.id}" 
        data-price="${movie.overview.length}">
        <div id="modal-input" class="inline fields">
          <label>Choose format:</label>
          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" name="disc-type" value="blu-ray" checked="checked">
              <label>Blu-Ray</label>
            </div>
          </div>
          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" name="disc-type" value="dvd">
              <label>DVD</label>
            </div>
          </div>
          <div class="field">            
            <input type="number" name="quantity" min="1" max="5" value="1">
            <label>Qty</label>
          </div>
          <div class="field">            
            <button id="add-cart" type="submit" class="ui button primary">Add to cart</button>
          </div>
        </div>
        </form>        
      </div>
    </div>
    </div>
  </div>
  `;
}

function addToCart() {
  const form = document.forms['add-to-cart-form'];
  const movieId = form.dataset.value;
  const movieInfo = getMovieInfo(movieId);
  const discType = form['disc-type'].value;
  const price = parseInt(form.dataset.price);
  const quantity = parseInt(form['quantity'].value);

  let product = {
    'MovieID' : movieId,
    'Title': movieInfo.title,
    'DiscType' : discType,
    'Quantity' : quantity,
    'Price' : price
  };

  if (shoppingCart.length === 0 && !checkLocalStorageIfExist('shoppingCart')) {
    shoppingCart.push(product);
  } else {
    shoppingCart = parseLocalstorage('shoppingCart');
    let existed = addIfExist(product, shoppingCart);
    if (!existed){
      shoppingCart.push(product);
    }
  }
  window.localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
  document.querySelector('#products-in-cart').innerHTML = shoppingCart.length.toString();
}

function showCart() {
  shoppingCart = parseLocalstorage('shoppingCart');
  const localContent = parseLocalstorage('shoppingCart');
  const modal = document.querySelector('.modal');

  modal.innerHTML = `
  <div class="content">
    <div class="ui header">Your shopping cart</div>
    <div class="description">
      <table class="ui five column table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Disc Type</th>
            <th>Price &aacute;</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody id="show-products">
          
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th></th>
            <th>VAT 25%:  <em><span id="VAT">${0.25 * subTotal}</span></em></th>
            <th>Sub-Total:  <em><span id="sub-total">${subTotal}</span></em></th>
          </tr>
        </tfoot>
      </table>
    </div>
    </div>
  </div>
  <div class="actions">
      <a href="checkout.html">
      <div class="ui positive right labeled icon button">
        Proceed to checkout
        <i class="checkmark icon"></i>
      </div>
      </a>
    </div>
  `;

  updateProductsInCart(localContent);
}

function addIfExist(obj, arr) {
  for(let i = 0; i < shoppingCart.length; i++){
    if (obj.MovieID === arr[i].MovieID && obj.DiscType === arr[i].DiscType ){
      arr[i].Quantity += obj.Quantity;
      return (true);
    }
  }
  return false;
}

function updateProductsInCart(arr) {
  const subTotalhtml = document.querySelector('#sub-total');
  const vathtml = document.querySelector('#VAT');
  const template = document.querySelector('#show-products');
  template.innerHTML = '';
  subTotal = 0;

  if (arr === null){
    return `<tr><td>No Products in cart</td></tr>`
  }
  for (let movie of arr) {
    let movieInfo = getMovieInfo(movie.MovieID);
    console.log(movie);
    template.innerHTML += `
    <tr>
      <td>${movie.Title}</td>
      <td>${movie.DiscType}</td>
      <td>${movie.Price}</td>
      <td>
        <input type="number" data-index="${arr.indexOf(movie)}" value="${movie.Quantity}" 
        onchange="changeQuantity(this)">  
      </td>   
    </tr>
    `;

    subTotal += (movie.Price * movie.Quantity);
    subTotalhtml.innerHTML = subTotal;
    vathtml.innerHTML = 0.25 * subTotal
  }
}

function parseLocalstorage(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function checkLocalStorageIfExist(key) {
  return (parseLocalstorage(key) !== null);
}

function getMovieInfo(movieID) {
  return movieList.find(movie => movie.id === parseInt(movieID))
}

function changeQuantity(obj) {
  shoppingCart[obj.dataset.index].Quantity = parseInt(obj.value);
  if (shoppingCart[obj.dataset.index].Quantity <= 0){
    shoppingCart.splice(obj.dataset.index, 1);
  }
  window.localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
  const localContent = parseLocalstorage('shoppingCart');
  updateProductsInCart(localContent);
}