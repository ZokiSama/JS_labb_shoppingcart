const localKey = 'shoppingCart';
const localProducts = JSON.parse(window.localStorage.getItem(localKey));
const productPage = document.querySelector('#product-page');
const deliveryFee = 45;
printProducts();

function printProducts() {
  console.log(localProducts);
    // movieList.push(movie);
  updateProductsInCart(localProducts);
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
    console.log(movie);
    template.innerHTML += `
    <tr>
      <td>${movie.Title}</td>
      <td>${movie.DiscType}</td>
      <td>${movie.Quantity}</td>
      <td>${movie.Price}</td>   
    </tr>
    `;

  }
  updateSumFromProducts();
}

function updateSumFromProducts() {
  const footerSums = document.querySelector('#show-sums');
  let productSum = 0;
  localProducts.forEach(product => { productSum += product.Price * product.Quantity});

  footerSums.innerHTML = `
    <tr>
      <th></th>
      <th></th>
      <th><em>Sub-Total</em>: <br><hr>
          <em>VAT 25%</em>: <br><hr>
          <em>Delivery fee</em>:
      </th>
      <th><span id="sub-total">${productSum}</span><br><hr>
          <span id="VAT">${productSum * 0.25}</span><br><hr>
          ${deliveryFee}</th>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th><em>Total</em>: </th>
      <th>${productSum + deliveryFee}</th>
    </tr>
  `
}

function completePurchase() {
  alert('thank you for the purchase');
  window.localStorage.clear();
  window.location.href =  "index.html"
}