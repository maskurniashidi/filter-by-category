//gunakan fetch untuk mengambil data
fetch("products.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    let products = json;
    initialize(products);
  })
  .catch(function (err) {
    console.log("fetch problem: " + err.message);
  });

//setup the app logic. declare required variables, contains all the other function
function initialize(products) {
  //grab ui elements that we need to manipulate
  const category = document.querySelector("#category");
  const searchTerm = document.querySelector("#searchTerm");
  const searchBtn = document.querySelector("button");
  const main = document.querySelector("main");

  let lastCategory = category.value;
  let lastSearch = "";

  let categoryGroup;
  let finalGroup;

  finalGroup = products;
  updateDisplay();

  categoryGroup = [];
  finalGroup = [];

  searchBtn.onclick = selectCategory;

  function selectCategory(e) {
    e.preventDefault();
    categoryGroup = [];
    finalGroup = [];

    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      if (category.value === "All") {
        categoryGroup = products;
        selectProducts();
      } else {
        let lowerCaseType = category.value.toLowerCase;
        for (let i = 0; i < products.length; i++) {
          if (products[i].type === lowerCaseType) {
            categoryGroup.push(products[i]);
          }
        }
        selectProducts();
      }
    }
  }
  function selectProducts() {
    // If no search term has been entered, just make the finalGroup array equal to the categoryGroup
    // array — we don't want to filter the products further — then run updateDisplay().
    if (searchTerm.value.trim() === "") {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      // Make sure the search term is converted to lower case before comparison. We've kept the
      // product names all lower case to keep things simple
      let lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      // For each product in categoryGroup, see if the search term is contained inside the product name
      // (if the indexOf() result doesn't return -1, it means it is) — if it is, then push the product
      // onto the finalGroup array
      for (let i = 0; i < categoryGroup.length; i++) {
        if (categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }

      // run updateDisplay() after this second round of filtering has been done
      updateDisplay();
    }
  }

  // start the process of updating the display with the new set of products
  function updateDisplay() {
    // remove the previous contents of the <main> element
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    // if no products match the search term, display a "No results to display" message
    if (finalGroup.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No results to display!";
      main.appendChild(para);
      // for each product we want to display, pass its product object to fetchBlob()
    } else {
      for (let i = 0; i < finalGroup.length; i++) {
        fetchBlob(finalGroup[i]);
      }
    }
  }

  // fetchBlob uses fetch to retrieve the image for that product, and then sends the
  // resulting image display URL and product object on to showProduct() to finally
  // display it
  function fetchBlob(product) {
    // construct the URL path to the image file from the product.image property
    let url = "images/" + product.image;
    // Use fetch to fetch the image, and convert the resulting response to a blob
    // Again, if any errors occur we report them in the console.
    fetch(url)
      .then(function (response) {
        return response.blob();
      })
      .then(function (blob) {
        // Convert the blob to an object URL — this is basically an temporary internal URL
        // that points to an object stored inside the browser
        let objectURL = URL.createObjectURL(blob);
        // invoke showProduct
        showProduct(objectURL, product);
      });
  }

  // Display a product inside the <main> element
  function showProduct(objectURL, product) {
    // create <section>, <h2>, <p>, and <img> elements
    const section = document.createElement("section");
    const heading = document.createElement("h2");
    const para = document.createElement("p");
    const image = document.createElement("img");

    // give the <section> a classname equal to the product "type" property so it will display the correct icon
    section.setAttribute("class", product.type);

    // Give the <h2> textContent equal to the product "name" property, but with the first character
    // replaced with the uppercase version of the first character
    heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());

    // Give the <p> textContent equal to the product "price" property, with a $ sign in front
    // toFixed(2) is used to fix the price at 2 decimal places, so for example 1.40 is displayed
    // as 1.40, not 1.4.
    para.textContent = "$" + product.price.toFixed(2);

    // Set the src of the <img> element to the ObjectURL, and the alt to the product "name" property
    image.src = objectURL;
    image.alt = product.name;

    // append the elements to the DOM as appropriate, to add the product to the UI
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
}
