const AUSTRALIA = "https://www.nhp.com.au";
const searchBtn = document.getElementById("search");
const clearBtn = document.getElementById("reset");

let biggerPictures = false;
let showSpecifications = false;
let background = false;
let tableview = false;
let productview = false;
let diagramview = false;
let showAccessory = false;
let showClipboard = false;
let VERIFICATIONTOKEN = "";

let XXX;

console.clear();
console.log(
  "%c--- NHP BULK SEARCH ---",
  "color: navy; font-family:sans-serif; font-size: 20px"
);

document.querySelectorAll('input[name="contentType"]').forEach((elem) => {
  elem.addEventListener("change", function (event) {
    var selection = event.target.value;
    // console.log(selection);
    if (selection === "PHOTOS") {
      document
        .querySelectorAll(".pict02")
        .forEach((pic) => pic.classList.toggle("is-hidden"));
      document
        .querySelectorAll(".cadbim")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".otherPix")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".pict01")
        .forEach((pic) => pic.classList.remove("is-hidden"));
    } else if (selection === "DOCUMENTS") {
      document
        .querySelectorAll(".pict01")
        .forEach((pic) => pic.classList.toggle("is-hidden"));
      document
        .querySelectorAll(".cadbim")
        .forEach((pic) => pic.classList.add("is-hidden"));
      document
        .querySelectorAll(".pict02")
        .forEach((pic) => pic.classList.remove("is-hidden"));
    } else if (selection === "EVERYTHING") {
      document
        .querySelectorAll(".pict01")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".pict02")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".cadbim")
        .forEach((pic) => pic.classList.remove("is-hidden"));
      document
        .querySelectorAll(".otherPix")
        .forEach((pic) => pic.classList.remove("is-hidden"));
    }
  });
});

document.querySelectorAll('input[name="viewType"]').forEach((elem) => {
  elem.addEventListener("change", function (event) {
    var selection = event.target.value;
    if (selection === "STANDARD") {
      document.querySelector(".normalView").classList.remove("is-hidden");
      document.querySelector(".productView").classList.add("is-hidden");
      document.querySelector(".diagramView").classList.add("is-hidden");
      document.querySelector(".tableView").classList.add("is-hidden");
      document.querySelector(".reportView").classList.add("is-hidden");
    } else if (selection === "DIAGRAM") {
      document.querySelector(".diagramView").classList.remove("is-hidden");
      document.querySelector(".normalView").classList.add("is-hidden");
      document.querySelector(".productView").classList.add("is-hidden");
      document.querySelector(".tableView").classList.add("is-hidden");
      document.querySelector(".reportView").classList.add("is-hidden");
    } else if (selection === "TABLE") {
      document.querySelector(".normalView").classList.add("is-hidden");
      document.querySelector(".productView").classList.add("is-hidden");
      document.querySelector(".diagramView").classList.add("is-hidden");
      document.querySelector(".tableView").classList.remove("is-hidden");
      document.querySelector(".reportView").classList.add("is-hidden");
    } else if (selection === "SIMPLE") {
      document.querySelector(".productView").classList.remove("is-hidden");
      document.querySelector(".diagramView").classList.add("is-hidden");
      document.querySelector(".normalView").classList.add("is-hidden");
      document.querySelector(".tableView").classList.add("is-hidden");
      document.querySelector(".reportView").classList.add("is-hidden");
    } else if (selection === "REPORT") {
      document.querySelector(".reportView").classList.remove("is-hidden");
      document.querySelector(".productView").classList.add("is-hidden");
      document.querySelector(".diagramView").classList.add("is-hidden");
      document.querySelector(".normalView").classList.add("is-hidden");
      document.querySelector(".tableView").classList.add("is-hidden");
    }
  });
});

const largePicturesCheckBox = document.getElementById("largepix");
largePicturesCheckBox.addEventListener("change", function () {
  if (this.checked) {
    biggerPictures = true;
    if (document.querySelector("figure")) {
      changeImageSizes();
    }
  } else {
    biggerPictures = false;
    if (document.querySelector("figure")) {
      changeImageSizes();
    }
  }
});

const showSpecificationsCheckBox = document.getElementById("showspecs");
showSpecificationsCheckBox.addEventListener("change", function () {
  if (this.checked) {
    showSpecifications = true;
    if (document.querySelector(".specifications.is-hidden")) {
      showSpecificationsTable();
    }
  } else {
    showSpecifications = false;
    if (document.querySelector(".specifications:not(.is-hidden)")) {
      showSpecificationsTable();
    }
  }
});

const backgroundCheckBox = document.getElementById("background");
backgroundCheckBox.addEventListener("change", function () {
  if (this.checked) {
    background = true;
    backgroundColor();
  } else {
    background = false;
    backgroundColor();
  }
});

const showAccessoryCheckBox = document.getElementById("showAcc");
showAccessoryCheckBox.addEventListener("change", function () {
  if (this.checked) {
    showAccessory = true;
    if (document.querySelector(".accessories.is-hidden")) {
      showAccessoryTable();
    }
  } else {
    showAccessory = false;
    if (document.querySelector(".accessories:not(.is-hidden)")) {
      showAccessoryTable();
    }
  }
});

const showClipboardCheckBox = document.getElementById("showClip");
showClipboardCheckBox.addEventListener("change", function () {
  if (this.checked) {
    showClipboard = true;
    if (document.querySelector(".copyCSV.is-hidden")) {
      showClipboardBox();
    }
  } else {
    showClipboard = false;
    if (document.querySelector(".copyCSV:not(.is-hidden)")) {
      showClipboardBox();
    }
  }
});

// PRINT button...
document.getElementById("btn-print").addEventListener("click", () => {
  window.print();
});

// CLEAR button...
clearBtn.addEventListener("click", (e) => {
  clearSelectionList();
  let selectedGreenBoxes = document.querySelectorAll(
    ".prodItem.has-background-success"
  );
  selectedGreenBoxes.forEach((item) => {
    item.classList.remove("has-background-success");
  });
});

const copyCSVText = document.querySelector(".copyCSV");
copyCSVText.addEventListener("click", () => {
  const text = copyCSVText.innerText;
  navigator.clipboard.writeText(text);
});

// START button...
searchBtn.addEventListener("click", () => {
  console.log(
    "%c\tSEARCH button pressed",
    "color: green; font-family:sans-serif; font-size: 16px"
  );
  let textarea = document.getElementById("productItems").value;
  if (textarea != "") {
    let productList = textarea
      .toUpperCase()
      .replaceAll(" ", "")
      .replaceAll(",", "\n")
      .replaceAll(";", "\n")
      .split("\n")
      .filter((item) => !!item);
    document.getElementById("reset").style.visibility = "visible";
    document.querySelector(".card").style.visibility = "visible";
    document.getElementById("reset").style.visibility = "visible";
    document.getElementById("resultCards").style.visibility = "visible";
    document.getElementById("btn-print").classList.toggle("is-hidden");

    let productListURL = productList.map((item) => `${item}`);

    productListURL = [...new Set(productListURL)]; // remove duplicate item numbers

    if (productListURL.length > 0) {
      // console.log(productListURL);

      let totalCount = 1;
      for (let index = 0; index < productListURL.length; index++) {
        if (
          document.querySelector(
            `#results .productView .prodView .column [data-id="${productListURL[index]}"]`
          )
        ) {
          document
            .querySelector(
              `#results .productView .prodView .column [data-id="${productListURL[index]}"]`
            )
            .parentElement.remove();
        }

        // REPORT VIEW
        document.querySelector("#results .reportView").innerHTML += `
        <div class="card" data-report-id="${productListURL[index]}">
          <div class="card-content">
            <div class="content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-3" >${productListURL[index]}</p>
                    <p class="subtitle is-7 mb-0 has-text-link">
                        <span class="fa-lg">
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"></rect></g></svg>
                      </span>
                    </p>
                  </div>
                  <div class="media-left logo">
                    <span class="fa-lg">
                      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"></rect></g></svg>
                     </span>
                  </div>
                </div>
                <div class="columns" id="report-1">
                  <div class="column is-one-third is-relative">
                      <div class="card-image" data-report-photo="${productListURL[index]}">
                        <span class="fa-lg">
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"></rect></g></svg>
                        </span>
                      </div>
                  </div>
                  <div class="column">
                    <div class="report-information" data-report-information="${productListURL[index]}">
                        <span class="fa-lg">
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"></rect></g></svg>
                        </span>
                    </div>
                  </div>
                </div>
                <div class="columns" id="report-2">
                    <div class="column is-half" id="report-2a">
                      <div class="card-image" data-report-dimensional="${productListURL[index]}">
                        <span class="fa-lg">
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"></rect></g></svg>
                        </span>
                      </div>
                    </div>
                    <div class="column is-half" id="report-2b">
                      <div class="card-image" data-report-specification-dimensions="${productListURL[index]}">
                      </div>
                      <div class="card-image" data-report-specification-mechanical="${productListURL[index]}">
                      </div>  
                      <div class="card-image" data-report-specification-construction="${productListURL[index]}">
                      </div>  
                    </div>

                </div>
                <div class="columns" id="report-3">
                  <div class="column is-half" id="report-3a">
                      <div class="card-image" data-report-other="${productListURL[index]}">
                        <span class="fa-lg">
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"></rect></g></svg>
                        </span>
                      </div>
                  </div>
                  <div class="column is-half" id="report-3b">
                    <div class="card-image" data-report-specification-electrical="${productListURL[index]}">
                    </div> 
                    <div class="card-image" data-report-specification-environment="${productListURL[index]}">
                    </div> 
                    <div class="card-image" data-report-specifications="${productListURL[index]}">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>`;

        // DIAGRAM VIEW
        document.querySelector("#results .diagramView").innerHTML += `
        <div class="card" data-id="${productListURL[index]}">
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4" >${productListURL[index]}<span class="nodiagram"><span></p>
              </div>
              <div class="media-left">                    
                <a href="https://www.nhp.com.au/product/${productListURL[index]}" target="_blank" title="${productListURL[index]}"><i class="fas fa-lg fa-globe has-text-link"></i></a>
             </div>

            </div>
            <div class="diagramsvg" data-diagramsvg="${productListURL[index]}">
            </div>
          </div>        
        </div>`;

        // PRODVIEW (SIMPLE VIEW)
        document.querySelector(
          "#results .productView .prodView"
        ).innerHTML += `                
            <div class="column is-one-quarter">
              <div class="card" data-id="${productListURL[index]}">
                <div class="card-content">
                  <div class="content">
                    <div class="media">
                      <div class="media-content">
                        <p class="title is-4" style="word-break: break-all">
                        <span><a href="https://www.nhp.com.au/product/${productListURL[index]}" target="_blank" title="${productListURL[index]}"><i class="fas fa-globe has-text-link"></i></a></span>
                        ${productListURL[index]}</p>
                        <p class="subtitle is-size-7 mb-0 brand"></p>
                      </div>
                    </div>
                    <div class="card-image" data-product-photo="${productListURL[index]}">
                      <figure class="image m-2 is128x128" data-tooltip="">
                        <img
                          src="Rhombus.gif"
                        />
                      </figure>
                  </div>
                </div>
              </div>
            </div>                              
        `;

        let showSpecTable = showSpecifications === true ? "" : "is-hidden";

        let showTableView = tableview === true ? "" : "is-hidden";

        let showPictures = tableview === true ? "is-hidden" : "";

        if (
          document.querySelector(
            `#results .normalView [data-id="${productListURL[index]}"]`
          )
        ) {
          document
            .querySelector(
              `#results .normalView [data-id="${productListURL[index]}"]`
            )
            .remove();
        }

        // TABLE VIEW
        document.querySelector("#results .tableView").innerHTML += `
        <div class="card" data-id="${productListURL[index]}">
         <div class="card-content">
          <div class="content">
           <div class="media">
              <div class="media-content">
                <p class="title is-4" >${productListURL[index]}</p>
                <p class="subtitle is-size-7 mb-0 brand">Searching.....</p>
                <p class="subtitle is-6 mb-0">Searching.....</p> 
              </div>
              <div class="media-left">                    
                <a href="https://www.nhp.com.au/product/${productListURL[index]}" target="_blank" title="${productListURL[index]}"><i class="fas fa-lg fa-globe has-text-link"></i></a>
              </div>
           </div>
            <div class="assetTable">
              <table class="table is-striped is-fullwidth">
              </table>                  
            </div
          </div>
         </div>
        </div>`;

        // NORMAL VIEW
        document.querySelector(
          "#results .normalView"
        ).innerHTML += `<div class="card" data-id="${productListURL[index]}">
            <div class="card-content">
              <div class="content">
              <div class="media">
              <div class="media-content">
                <p class="title is-4" >${productListURL[index]}</p>
                <p class="subtitle is-size-7 mb-0 brand">Searching.....</p>
                <p class="subtitle is-6 mb-0">Searching.....</p> 
                <p class="subtitle ml-6 is-size-7 mb-0 is-family-monospace rockwell is-hidden" id="rockwell-title"></p>
                <p class="subtitle ml-6 is-size-7 mb-0 is-family-monospace rockwell is-hidden" id="rockwell-description"></p>                      
              </div>
              <div class="media-left is-flex">
              <div class="stock-status">
                <span class="fa-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"></rect></g></svg>  
                </span>
              </div>                    
              <a href="https://www.nhp.com.au/product/${productListURL[index]}" target="_blank" title="${productListURL[index]}"><i class="fas fa-lg fa-globe has-text-link"></i></a>
            </div>
            </div>
                
              <div class="columns is-multiline pictures ${showPictures}">
                <div class="column pict01">
                  <div class="columns prodItem p-2 is-flex-wrap-wrap" data-product-photo="${productListURL[index]}"></div>
                  <div class="otherPix is-flex-wrap-wrap">
                    <div class="columns prodItem p-2" data-product-diagram="${productListURL[index]}"></div>
                    <div class="columns prodItem p-2 is-flex-wrap-wrap" data-product-datasheet="${productListURL[index]}"></div>
                    <div class="columns prodItem p-2 is-flex-wrap-wrap" data-product-logo="${productListURL[index]}"></div>
                  </div>
                  <div class="rockwell is-hidden" id="rockwell-photo">
                    <div class="columns prodItem p-2 is-flex-wrap-wrap" data-rockwell-photo1="${productListURL[index]}"></div>
                    <div class="columns prodItem p-2 is-flex-wrap-wrap" data-rockwell-photo2="${productListURL[index]}"></div>
                  </div>
                </div>
                <div class="column pict02">
                  <div class="columns prodItem p-2 is-flex-wrap-wrap" data-product-document="${productListURL[index]}"></div>
                </div>
              </div>
              <div id="cadBlockList" class="cadbim ${showPictures}">Searching.....</div>
              <div class="specifications ${showSpecTable}" data-product-specification="${productListURL[index]}"></div>
              </div>
            </div>`;

        // get the NHP verification token
        browser.runtime
          .sendMessage({
            text: `${productListURL[index]}`,
            message: "NHP-TOKEN",
            verification: "",
          })
          .then((getToken) => {
            VERIFICATIONTOKEN = getToken.nhpToken.__RequestVerificationToken;
            // console.log(
            //   "TOKEN-->",
            //   getToken.nhpToken.__RequestVerificationToken
            // );
          });

        browser.runtime
          .sendMessage({
            text: productListURL[index],
            message: "NHP-AU",
            verification: "",
          })
          .then((response) => {
            if (response.message === "NHP-AU") {
              const parser = new DOMParser();
              const doc = parser.parseFromString(response.html, "text/html");

              // get the JSON data embedded in the script tag that builds the whole website.
              const findScript = doc.getElementById("__NEXT_DATA__");
              const getScriptText = findScript.innerText;
              const pageJSON = JSON.parse(getScriptText);
              // console.log(`pageJSON : ${productListURL[index]}`, pageJSON);

              const prodbrand =
                pageJSON.props.pageProps.layoutData.sitecore.context
                  .commerceContext.brand;

              const prodgroup =
                pageJSON.props.pageProps.layoutData.sitecore.context
                  .commerceContext.productGroup;

              const componentProp = pageJSON.props.pageProps.componentProps;
              const propsArray = Object.entries(componentProp);
              propsArray.forEach((el) => el.shift());
              const productPanelArray = propsArray.filter(function (array) {
                return array.some(function (item) {
                  return item.componentName === "product-panel";
                });
              });

              const breadcrumbArray = propsArray.filter(function (array) {
                return array.some(function (item) {
                  return item.componentName === "breadcrumb";
                });
              });
              const LevelsArray = breadcrumbArray[0][0].breadcrumbs;
              const LEVEL1 = LevelsArray[2].text;
              const LEVEL2 = LevelsArray[3].text;
              const LEVEL3 = LevelsArray[4].text;

              const specificationsArray = propsArray.filter(function (array) {
                return array.some(function (item) {
                  return item.componentName === "product-tabs";
                });
              });

              let specificationsX =
                specificationsArray[0][0].fields.controlTabs[0] ?? [];

              if (specificationsX.name === "Specifications") {
                specificationsX =
                  specificationsArray[0][0].fields.specTableData;
              }

              const productBrand = productPanelArray[0][0].fields.brand.value;
              const productRange =
                productPanelArray[0][0].fields.productRange.value;
              const productName =
                productPanelArray[0][0].fields.productName.value;

              document.querySelector(
                `#results .reportView .report-information[data-report-information="${productListURL[index]}"]`
              ).innerHTML = `
                      <div class="report-info-column1">ITEM NUMBER</div>
                      <div class="report-info-column2">${productListURL[index]}</div>
                      <div class="report-info-column1">DESCRIPTION</div>
                      <div class="report-info-column2">${doc.title}</div>
                      <div class="report-info-column1">BRAND</div>
                      <div class="report-info-column2">${productBrand}</div>
                      <div class="report-info-column1">PRODUCT GROUP</div>
                      <div class="report-info-column2">${productRange}</div>
                      <div class="report-info-column1">STOCK STATUS</div>
                      <div class="report-info-column2 report-stock-status">
                        <span class="fa-lg">
                          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_OSmW{transform-origin:center;animation:spinner_T6mA .75s step-end infinite}@keyframes spinner_T6mA{8.3%{transform:rotate(30deg)}16.6%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.3%{transform:rotate(120deg)}41.6%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.3%{transform:rotate(210deg)}66.6%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.3%{transform:rotate(300deg)}91.6%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}</style><g class="spinner_OSmW"><rect x="11" y="1" width="2" height="5" opacity=".14"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86"></rect><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)"></rect></g></svg>
                        </span>
                      </div>
                      <div class="report-info-column1">WEBSITE (AUS)</div>
                      <div class="report-info-column2"><a href="https://www.nhp.com.au/product/${productListURL[index]}">https://www.nhp.com.au/product/${productListURL[index]}</a></div>
                      <div class="report-info-column1">LEVEL 1</div>
                      <div class="report-info-column2">${LEVEL1}</div>
                      <div class="report-info-column1">LEVEL 2</div>
                      <div class="report-info-column2">${LEVEL2}</div>
                      <div class="report-info-column1">LEVEL 3</div>
                      <div class="report-info-column2">${LEVEL3}</div>
                      <div class="report-info-column1">ETIM CLASS</div>
                      <div class="report-info-column2 etimClass"><i>No ETIM Classification<i></div>
                `;

              document.querySelector(
                `#results .productView .prodView [data-id="${productListURL[index]}"] .brand`
              ).innerText = `${productBrand} - ${productRange}`;

              document.querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .brand`
              ).innerText = `${productBrand} - ${productRange}`;

              document.querySelector(
                `#results .tableView [data-id="${productListURL[index]}"] .brand`
              ).innerText = `${productBrand} - ${productRange}`;

              let existing =
                doc.title != "404 ERROR"
                  ? "has-text-primary"
                  : "has-text-danger";

              document
                .querySelector(
                  `#results .productView .prodView [data-id="${productListURL[index]}"] .title`
                )
                .classList.add(`${existing}`);

              document.querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .brand+.subtitle`
              ).innerText = `${doc.title}`;

              document.querySelector(
                `#results .reportView [data-report-id="${productListURL[index]}"] .subtitle`
              ).innerText = `${LEVEL1} > ${LEVEL2} > ${LEVEL3}`;

              document.querySelector(
                `#results .tableView [data-id="${productListURL[index]}"] .brand+.subtitle`
              ).innerText = `${doc.title}`;

              if (specificationsX.length > 0) {
                let specificationsSection = document.querySelector(
                  `.specifications[data-product-specification="${productListURL[index]}"]`
                );

                let reportSpecificationData = "";

                let findETIMClass = specificationsX.find(
                  (item) => item.heading === "Component Type (ETIM Class)"
                );
                let reportETIMClass = findETIMClass
                  ? findETIMClass.cells[0].value
                  : "Not Found";

                document.querySelector(
                  `.reportView [data-report-information="${productListURL[index]}"] .etimClass`
                ).innerText = reportETIMClass;

                let reportSpecDimensions = document.querySelector(
                  `.reportView [data-report-specification-dimensions="${productListURL[index]}"]`
                );

                let reportSpecMechanical = document.querySelector(
                  `.reportView [data-report-specification-mechanical="${productListURL[index]}"]`
                );

                let reportSpecConstruction = document.querySelector(
                  `.reportView [data-report-specification-construction="${productListURL[index]}"]`
                );

                let reportSpecElectrical = document.querySelector(
                  `.reportView [data-report-specification-electrical="${productListURL[index]}"]`
                );

                let reportSpecEnvironment = document.querySelector(
                  `.reportView [data-report-specification-environment="${productListURL[index]}"]`
                );

                specificationsX.forEach((specs) => {
                  reportSpecificationData += `<div class="block specData"><div class="specCategory">${specs.heading}</div><div class="spec-grid">`;
                  if (specs.heading === "Dimensions") {
                    reportSpecDimensions.innerHTML = `<p class="card-header-title mb-0 pl-0">${specs.heading}</p>`;
                  }
                  if (specs.heading === "Mechanical") {
                    reportSpecMechanical.innerHTML = `<p class="card-header-title mb-0 pl-0">${specs.heading}</p>`;
                  }
                  if (specs.heading === "Construction") {
                    reportSpecConstruction.innerHTML = `<p class="card-header-title mb-0 pl-0">${specs.heading}</p>`;
                  }
                  if (specs.heading === "Electrical") {
                    reportSpecElectrical.innerHTML = `<p class="card-header-title mb-0 pl-0">${specs.heading}</p>`;
                  }
                  if (specs.heading === "Environment") {
                    reportSpecEnvironment.innerHTML = `<p class="card-header-title mb-0 pl-0">${specs.heading}</p>`;
                  }
                  let documentFragment = document.createDocumentFragment();
                  let specHeadingElement = document.createElement("div");
                  specHeadingElement.classList.add("specHeader");
                  specHeadingElement.innerHTML = `<div class="specHeading has-text-white has-background-info-dark is-size-7">${specs.heading}<div>`;
                  documentFragment.appendChild(specHeadingElement);
                  specs.cells.forEach((cell) => {
                    let specPropertyElement = document.createElement("div");
                    specPropertyElement.classList.add("specProperty");
                    specPropertyElement.innerHTML = `<div class="specLabel has-text-danger is-size-7">${cell.label}</div><div class="specValue has-text-dark is-size-7">${cell.value}</div>`;
                    specHeadingElement.append(specPropertyElement);
                    reportSpecificationData += `<div class="report-spec-grid"><div class="report-spec-label">${cell.label}</div><div class="report-spec-value">${cell.value}</div></div>`;
                    if (specs.heading === "Dimensions") {
                      reportSpecDimensions.innerHTML += `<div class="report-spec-grid"><div class="report-spec-label">${cell.label}</div><div class="report-spec-value">${cell.value}</div></div`;
                    }
                    if (specs.heading === "Mechanical") {
                      reportSpecMechanical.innerHTML += `<div class="report-spec-grid"><div class="report-spec-label">${cell.label}</div><div class="report-spec-value">${cell.value}</div></div`;
                    }
                    if (specs.heading === "Construction") {
                      reportSpecConstruction.innerHTML += `<div class="report-spec-grid"><div class="report-spec-label">${cell.label}</div><div class="report-spec-value">${cell.value}</div></div`;
                    }
                    if (specs.heading === "Electrical") {
                      reportSpecElectrical.innerHTML += `<div class="report-spec-grid"><div class="report-spec-label">${cell.label}</div><div class="report-spec-value">${cell.value}</div></div`;
                    }
                    if (specs.heading === "Environment") {
                      reportSpecEnvironment.innerHTML += `<div class="report-spec-grid"><div class="report-spec-label">${cell.label}</div><div class="report-spec-value">${cell.value}</div></div`;
                    }
                  });
                  specificationsSection.appendChild(specHeadingElement);
                  reportSpecificationData += `</div></div>`;
                });

                // document.querySelector(
                //   `.reportView [data-report-specifications="${productListURL[index]}"]`
                // ).innerHTML = reportSpecificationData;
              }

              const productGeneralArray = {
                range: productRange,
                description: productName,
                specifications: specificationsX,
                brand: productBrand,
                itemNumber: productListURL[index],
              };

              return productGeneralArray;
            } else {
              document.querySelector(
                "#results .normalView"
              ).innerHTML += `<div class="p-2 bd-highlight has-background-warning-light">CONNECTION ERROR : ${productListURL[index]}</div>`;
            }
          })
          .then((aa0) => {
            let itemBrandRange = `${aa0.itemNumber}|${aa0.brand}|${aa0.range}`;
            return browser.runtime
              .sendMessage({
                text: `${itemBrandRange}`,
                message: "NHP-AU-ASSETS",
                verification: "",
              })
              .then((responseAssets) => {
                const assetsArray = responseAssets.jason.assets;

                const productPhotosArray = assetsArray.filter((prodphoto) => {
                  return (
                    prodphoto.type == "Photo" &&
                    prodphoto.subtype != "Product - Photo - Group Family 3DF"
                  );
                });

                productPhotosArray.sort(
                  (a, b) => a.subtypePriority - b.subtypePriority
                );

                const diagramArray = assetsArray.filter((diagram) => {
                  return diagram.type == "Diagram";
                });
                const logoArray = assetsArray.filter((logo) => {
                  return logo.type == "Logo";
                });
                const datasheetArray = assetsArray.filter((datasheet) => {
                  return datasheet.type == "Datasheet";
                });

                const documentsArray = assetsArray.filter((document) => {
                  return (
                    document.mediaType == "Document" &&
                    document.type != "Datasheet"
                  );
                });

                documentsArray.sort((a, b) => {
                  if (a.type < b.type) {
                    return -1;
                  }
                  if (a.type > b.type) {
                    return 1;
                  }
                  return 0;
                });

                const CADorBIMArray = assetsArray.filter((cadbim) => {
                  return cadbim.mediaType == "CAD or BIM";
                });

                aa0.photos = productPhotosArray;
                aa0.diagram = diagramArray;
                aa0.documents = documentsArray;
                aa0.datasheet = datasheetArray;
                aa0.logo = logoArray;
                aa0.cadbim = CADorBIMArray;

                // console.log(aa0.diagram);

                let DocumentList = "";
                documentsArray.forEach((docu) => {
                  let documentPath = docu.assetVariants.filter((pic) => {
                    return pic.name === "Original";
                  });
                  DocumentList += `<tr class="is-size-7">
                  <th>${docu.type}</th>
                  <td><a href="https://www.nhp.com.au${documentPath[0].url}" target="_blank">${docu.fileName}</a></td> 
                  <td>-</td> 
                  <td>${docu.displayOrder}</td> 
                  </tr>`;
                });

                let DataSheetList = "";
                datasheetArray.forEach((data) => {
                  let datasheetPath = data.assetVariants.filter((pic) => {
                    return pic.name === "Original";
                  });
                  DataSheetList += `<tr class="is-size-7">
                  <th>${data.type}</th>
                  <td><a href="https://www.nhp.com.au${datasheetPath[0].url}" target="_blank">${data.fileName}</a></td> 
                  <td>-</td> 
                  <td>${data.displayOrder}</td> 
                  </tr>`;
                });

                let PhotoList = "";
                let dataList = "";
                productPhotosArray.forEach((photo) => {
                  let picture = photo.assetVariants.filter((pic) => {
                    return pic.name === "SmallPNG";
                  });
                  let photoPath = photo.assetVariants.filter((pic) => {
                    return pic.name === "ExtraLargePNG";
                  });
                  dataList += `${aa0.itemNumber},https://www.nhp.com.au${picture[0].url},${aa0.brand},${aa0.range}<br>`;
                  // console.log(
                  //   `${aa0.itemNumber},https://www.nhp.com.au${picture[0].url}`
                  // );
                  PhotoList += `<tr class="is-size-7">
                  <th>${photo.type}</th>
                  <td><a href="https://www.nhp.com.au${photoPath[0].url}" target="_blank">${photo.fileName}</a></td> 
                  <td>${photo.representativephoto}</td> 
                  <td>${photo.displayOrder}</td> 
                  </tr>`;
                });

                let DiagramList = "";
                let diagramSVG = "";
                diagramArray.forEach((diag) => {
                  let diagPath = diag.assetVariants.filter((pic) => {
                    return pic.name === "Original";
                  });
                  DiagramList += `<tr class="is-size-7">
                  <th>${diag.type}</th>
                  <td><a href="https://www.nhp.com.au${diagPath[0].url}" target="_blank">${diag.fileName}</a></td> 
                  <td>${diag.representativephoto}</td> 
                  <td>${diag.displayOrder}</td> 
                  </tr>`;

                  diagramSVG += `<a href="https://www.nhp.com.au${diagPath[0].url}" target="_blank">${diag.fileName}</a>`;
                });
                if (diagramArray.length == 0) {
                  document
                    .querySelector(
                      `[data-diagramsvg="${productListURL[index]}"]`
                    )
                    .remove();
                  document.querySelector(
                    `.diagramView [data-id="${productListURL[index]}"] .nodiagram`
                  ).innerText = "*** No Diagram Available ***";
                }

                // document.querySelector(
                //   `#results .diagramView [data-id="${productListURL[index]}"] .diagramsvg`
                // ).innerHTML = `${diagramSVG}`;

                let LogoList = "";
                logoArray.forEach(
                  (logo) =>
                    (LogoList += `<tr class="is-size-7">
                  <th>${logo.type}</th>
                  <td>${logo.fileName}</td> 
                  <td>${logo.representativephoto}</td> 
                  <td>${logo.displayOrder}</td> 
                  </tr>`)
                );

                let CADBIMList = "";
                CADorBIMArray.forEach((data) => {
                  let cadPath = data.assetVariants.filter((pic) => {
                    return pic.name === "Original";
                  });
                  CADBIMList += `<tr class="is-size-7">
                  <th>${data.type}</th>
                  <td><a href="https://www.nhp.com.au${cadPath[0].url}" target="_blank">${data.fileName}</a></td> 
                  <td>-</td> 
                  <td>${data.displayOrder}</td> 
                  </tr>`;
                });

                document.querySelector(
                  `#results .copyCSV`
                ).innerHTML += `${dataList}`;

                document.querySelector(
                  `#results .tableView [data-id="${productListURL[index]}"] .assetTable table`
                ).innerHTML = `${PhotoList}
                          ${DiagramList}
                          ${DocumentList}
                          ${DataSheetList}
                          ${CADBIMList}
                          ${LogoList}`;

                // document.querySelector(
                //   `#results .normalView [data-id="${productListURL[index]}"] .assetTable table`
                // ).innerHTML = `${PhotoList}
                //           ${DiagramList}
                //           ${DocumentList}
                //           ${DataSheetList}
                //           ${CADBIMList}
                //           ${LogoList}`;

                let CADblocksList = "";
                CADorBIMArray.forEach((cadblock) => {
                  let cadOriginal = cadblock.assetVariants.filter((pic) => {
                    return pic.name === "Original";
                  });
                  CADblocksList += `<a href="https://www.nhp.com.au${cadOriginal[0].url}" target="_blank"><p class="is-family-monospace is-size-7 mb-0 ml-6 cadTextColor">${cadblock.fileName}</p></a>`;
                });

                document.querySelector(
                  `#results .normalView [data-id="${productListURL[index]}"] .cadbim`
                ).innerHTML = `${CADblocksList}`;

                return aa0;
              });
          })
          .then((aaa) => {
            let PhotoList = "";
            aaa.photos.forEach(
              (photo) =>
                (PhotoList += `<tr class="is-size-7">
              <th>${photo.type}</th>
              <td>${photo.fileName}</td> 
              <td>${photo.representativephoto}</td> 
              <td>${photo.displayOrder}</td> 
              </tr>`)
            );

            let picSize =
              biggerPictures === false ? "is-128x128" : "is-200x200";

            let PhotoProducts = "";
            aaa.photos.forEach((photo) => {
              let representative =
                photo.representativephoto === "Yes" ? "Representative" : "";
              PhotoProducts += `<a href="${photo.fileName}" target="_blank"><figure class="image m-2 is128x128 ${picSize}" data-tooltip="${photo.fileName}">
              <img src="Rhombus.gif" /><figcaption>${representative}</figcaption>
              </figure></a>`;
            });

            document
              .querySelector(
                `#results .productView .prodView [data-product-photo="${productListURL[index]}"] figure`
              )
              .setAttribute("data-tooltip", `${aaa.photos[0].fileName}`);

            document.querySelector(
              `#results .normalView [data-id="${productListURL[index]}"] [data-product-photo="${productListURL[index]}"]`
            ).innerHTML = `${PhotoProducts}`;

            // console.log(productListURL[index], aaa);

            aaa.photos.forEach((photo, qq) => {
              // let picSize =
              //   biggerPictures === false ? "is-128x128" : "is-200x200";
              let picture = photo.assetVariants.filter((pic) => {
                return pic.name === "SmallPNG";
              });

              let pictureBiggest = photo.assetVariants.filter((pic) => {
                return pic.name === "ExtraLargePNG";
              });
              // let representative =
              //   photo.representativephoto === "Yes" ? "Representative" : "";
              browser.runtime
                .sendMessage({
                  text: `https://www.nhp.com.au${picture[0].url}`,
                  message: "NHP-PHOTO",
                  verification: "",
                })
                .then((response2) => {
                  // const { url } = response2;
                  // let prodItem = document.createElement("figure");
                  // prodItem.classList.add("image", "m-2", "is-128x128", picSize);
                  // prodItem.setAttribute("data-tooltip", photo.fileName);
                  // prodItem.innerHTML = `<img src="${response2.url}" /><figcaption>${representative}</figcaption>`;
                  // let zzz = document.querySelector(
                  //   `[data-product-photo="${productListURL[index]}"]`
                  // );
                  // zzz.appendChild(prodItem);
                  let zaz = document.querySelector(
                    `.normalView [data-product-photo="${productListURL[index]}"] [data-tooltip="${photo.fileName}"] img`
                  );
                  zaz.setAttribute("src", `${response2.url}`);

                  let zcz = zaz.closest("a");
                  zcz.setAttribute(
                    "href",
                    `https://www.nhp.com.au${pictureBiggest[0].url}`
                  );

                  if (qq == 0) {
                    let zbz = document.querySelector(
                      `.prodView [data-product-photo="${productListURL[index]}"] [data-tooltip="${photo.fileName}"] img`
                    );
                    zbz.setAttribute("src", `${response2.url}`);

                    if (photo.representativephoto == "Yes") {
                      document.querySelector(
                        `.reportView [data-report-photo="${productListURL[index]}"]`
                      ).innerHTML = `<div class="report-repImage">REPRESENTATIVE PRODUCT PHOTO SHOWN</div><img src="${response2.url}" >`;
                    } else {
                      document.querySelector(
                        `.reportView [data-report-photo="${productListURL[index]}"]`
                      ).innerHTML = `<img src="${response2.url}" >`;
                    }

                    // let zdz = zbz.closest("a");
                    // console.log("zdz", zdz, qq);
                    // zdz.setAttribute(
                    //   "href",
                    //   `https://www.nhp.com.au${pictureBiggest[0].url}`
                    // );
                  }
                });
            });
            return aaa;
          })
          .then((aa2) => {
            let isNoDiagrams = aa2.diagram.length == 0 ? true : false;

            if (isNoDiagrams) {
              document
                .querySelector(
                  `.reportView [data-report-id="${productListURL[index]}"] #report-2a`
                )
                .remove();
              // move the specification daa around since there is no diagrams
              const elementToMove = document.querySelector(
                `.reportView [data-report-id="${productListURL[index]}"] #report-3b`
              );
              const newParent = document.querySelector(
                `.reportView [data-report-id="${productListURL[index]}"] #report-2`
              );
              newParent.appendChild(elementToMove);
              document
                .querySelector(
                  `.reportView [data-report-id="${productListURL[index]}"] #report-3`
                )
                .remove();
            }

            if (aa2.diagram.length == 1) {
              document
                .querySelector(
                  `.reportView [data-report-other="${productListURL[index]}"]`
                )
                .parentElement.remove();
            }

            aa2.diagram.forEach((diagram) => {
              let picSize =
                biggerPictures === false ? "is-128x128" : "is-200x200";
              let diagramSize = diagram.assetVariants.filter((pic) => {
                return pic.name === "SmallPNG";
              });
              let diagramOriginal = diagram.assetVariants.filter((pic) => {
                return pic.name === "Original";
              });

              browser.runtime
                .sendMessage({
                  text: `https://www.nhp.com.au${diagramSize[0].url}`,
                  message: "NHP-PHOTO",
                  verification: "",
                })
                .then((response2b) => {
                  const { url } = response2b;
                  let prodItem = document.createElement("figure");
                  prodItem.classList.add("image", "m-2", "is-128x128", picSize);
                  prodItem.setAttribute("data-tooltip", diagram.fileName);
                  prodItem.innerHTML = `<a href="https://www.nhp.com.au${diagramOriginal[0].url}" target="_blank"><img src="${response2b.url}" /><figcaption class="diag">Diagram</figcaption></a>`;
                  // console.log(response2b);
                  // console.log(diagram);
                  // console.log(
                  //   ">>>>>>>",
                  //   productListURL[index],
                  //   "-",
                  //   diagramOriginal[0].url
                  // );
                  // let disvg = document.querySelector(
                  //   `.diagramView [data-diagramsvg="${productListURL[index]}"] img`
                  // );

                  let disvg = document.querySelector(
                    `.diagramView [data-diagramsvg="${productListURL[index]}"]`
                  );

                  disvg.innerHTML += `<a href="https://www.nhp.com.au${diagramOriginal[0].url}" target="_blank" title="https://www.nhp.com.au${diagramOriginal[0].url}"><img src="https://www.nhp.com.au${diagramOriginal[0].url}"></a>`;

                  // document.querySelector(
                  //   `.reportView [data-report-dimensional="${productListURL[index]}"]`
                  // ).innerHTML += `<p class="card-header-title">${diagram.damHierarchy}</p>
                  // <img src="https://www.nhp.com.au${diagramOriginal[0].url}">`;

                  if (diagram.damHierarchy === "Dimensional Diagram") {
                    document
                      .querySelector(
                        `.reportView [data-report-dimensional="${productListURL[index]}"] span`
                      )
                      .remove();
                    document.querySelector(
                      `.reportView [data-report-dimensional="${productListURL[index]}"]`
                    ).innerHTML += `<p class="card-header-title mb-0 pl-0">${diagram.damHierarchy}</p>
                    <img src="https://www.nhp.com.au${diagramOriginal[0].url}">`;
                  } else {
                    document.querySelector(
                      `.reportView [data-report-other="${productListURL[index]}"]`
                    ).innerHTML = `<p class="card-header-title mb-0 pl-0">${diagram.damHierarchy}</p>
                    <img src="https://www.nhp.com.au${diagramOriginal[0].url}">`;
                  }

                  // disvg.setAttribute(
                  //   "src",
                  //   `https://www.nhp.com.au${diagramOriginal[0].url}`
                  // );
                  // let disvghref = document.querySelector(
                  //   `.diagramView [data-diagramsvg="${productListURL[index]}"] a`
                  // );
                  // disvghref.setAttribute(
                  //   "href",
                  //   `https://www.nhp.com.au${diagramOriginal[0].url}`
                  // );
                  // disvghref.setAttribute(
                  //   "title",
                  //   `https://www.nhp.com.au${diagramOriginal[0].url}`
                  // );
                  let zzz = document.querySelector(
                    `[data-product-diagram="${productListURL[index]}"]`
                  );
                  zzz.appendChild(prodItem);
                });
            });
            return aa2;
          })
          .then((aa3) => {
            aa3.datasheet.forEach((datasheet) => {
              let picSize =
                biggerPictures === false ? "is-128x128" : "is-200x200";
              let datasheetSize = datasheet.assetVariants.filter((pic) => {
                return pic.name === "SmallPNG";
              });
              let datasheetOriginal = datasheet.assetVariants.filter((pic) => {
                return pic.name === "Original";
              });
              browser.runtime
                .sendMessage({
                  text: `https://www.nhp.com.au${datasheetSize[0].url}`,
                  message: "NHP-PHOTO",
                  verification: "",
                })
                .then((response2c) => {
                  const { url } = response2c;
                  let prodItem = document.createElement("figure");
                  prodItem.classList.add("image", "m-2", "is-128x128", picSize);
                  prodItem.setAttribute("data-tooltip", datasheet.fileName);
                  prodItem.innerHTML = `<a href="https://www.nhp.com.au${datasheetOriginal[0].url}" target="_blank"><img src="${response2c.url}" /><figcaption class="dsheet">Data Sheet</figcaption></a>`;
                  let zzz = document.querySelector(
                    `[data-product-datasheet="${productListURL[index]}"]`
                  );
                  zzz.appendChild(prodItem);
                });
            });
            return aa3;
          })
          .then((aa4) => {
            if (aa4.logo.length == 0) {
              document.querySelector(
                `.reportView [data-report-id="${productListURL[index]}"] .media-left.logo`
              ).innerHTML = `<div class="report-no-logo">MISSING LOGO</div>`;
            }
            aa4.logo.forEach((logo) => {
              let picSize =
                biggerPictures === false ? "is-128x128" : "is-200x200";
              let logoSize = logo.assetVariants.filter((pic) => {
                return pic.name === "SmallPNG";
              });
              document.querySelector(
                `.reportView [data-report-id="${productListURL[index]}"] .media-left.logo`
              ).innerHTML = `<img src="https://www.nhp.com.au${logo.url}">`;
              browser.runtime
                .sendMessage({
                  text: `https://www.nhp.com.au${logoSize[0].url}`,
                  message: "NHP-PHOTO",
                  verification: "",
                })
                .then((response2d) => {
                  const { url } = response2d;
                  let prodItem = document.createElement("figure");
                  prodItem.classList.add("image", "m-2", "is-128x128", picSize);
                  prodItem.setAttribute("data-tooltip", logo.fileName);
                  prodItem.innerHTML = `<a href="https://www.nhp.com.au${logoSize[0].url}" target="_blank"><img src="${response2d.url}"/><figcaption class="lgo">LOGO</figcaption></a>`;
                  let zzz = document.querySelector(
                    `[data-product-logo="${productListURL[index]}"]`
                  );
                  zzz.appendChild(prodItem);
                });
            });
            return aa4;
          })
          .then((bbb) => {
            if (bbb.documents.length > 0) {
              bbb.documents.forEach((pdf) => {
                let picSize =
                  biggerPictures === false ? "is-128x128" : "is-200x200";
                let pdfSize = pdf.assetVariants.filter((pic) => {
                  return pic.name === "MediumPNG";
                });
                let pdfOriginal = pdf.assetVariants.filter((pic) => {
                  return pic.name === "Original";
                });
                browser.runtime
                  .sendMessage({
                    text: `https://www.nhp.com.au${pdfSize[0].url}`,
                    message: "NHP-PHOTO",
                    verification: "",
                  })
                  .then((response3) => {
                    const { url } = response3;
                    let docItem = document.createElement("figure");
                    docItem.classList.add(
                      "image",
                      "m-2",
                      "is-128x128",
                      picSize
                    );
                    docItem.setAttribute("data-tooltip", pdf.fileName);
                    docItem.innerHTML = `<a href="https://www.nhp.com.au${pdfOriginal[0].url}" target="_blank"><img src="${response3.url}" /><figcaption class="docpdf">${pdf.type}</figcaption></a>`;
                    let www = document.querySelector(
                      `[data-product-document="${productListURL[index]}"]`
                    );
                    www.appendChild(docItem);
                  });
              });
            }
            return bbb;
          })
          .then((ccc) => {
            getBrand = document.querySelector(
              `#results .normalView [data-id="${productListURL[index]}"] .brand`
            ).innerText;
            return ccc;
          })
          .then((ddd) => {
            browser.runtime
              .sendMessage({
                text: `${productListURL[index]}`,
                message: "NHP-ACCESSORIES",
                verification: "",
              })
              .then((accessoryObject) => {
                // console.log("NHP-ACCESSORIES xxxxxxxxxxxxxxxxxxxxxxxxxxxx");
                // console.log(accessoryObject);
                if (accessoryObject.jason.total_item > 0) {
                  let showAccTable = showAccessory === true ? "" : "is-hidden";

                  let accessoryDIV = document.createElement("div");
                  accessoryDIV.classList.add("accessories", showAccTable);
                  accessoryDIV.setAttribute(
                    "data-accessorytable",
                    productListURL[index]
                  );
                  let temp =
                    "<table><thead><tr><th>ACCESSORY</th><th>GROUP</th><th>DESCRIPTION</th></tr></thead><tbody>";
                  accessoryObject.jason.content.product.value.forEach((qw) => {
                    // console.log(qw.sku, qw.custom_etim_class, qw.name);
                    temp += `<tr><td class="accessoryTitle">${qw.sku}</td><td>${qw.custom_etim_class}</td><td>${qw.custom_display_name}</td></tr>`;
                  });
                  accessoryDIV.innerHTML = `${temp}</tbody></table>`;
                  targetDiv = document.querySelector(
                    `div[data-product-specification="${productListURL[index]}"]`
                  );
                  targetDiv.parentNode.insertBefore(accessoryDIV, targetDiv);
                }
                return ddd;
              });
          })
          .then((eee) => {
            // console.log(
            //   `${productListURL[index]} eee NHP-STOCK-STATUS token = `,
            //   eee
            // );
            browser.runtime
              .sendMessage({
                text: `${productListURL[index]}`,
                message: "NHP-STOCK-STATUS",
                verification: VERIFICATIONTOKEN,
              })
              .then((responseStatus) => {
                // console.log(
                //   responseStatus.jason.ChildProducts[0].StockStatusLabel
                // );

                let NHPstockstatusAU =
                  responseStatus.jason.ChildProducts[0].StockStatusLabel ===
                  "In Stock"
                    ? "in-stock"
                    : "out-stock";
                document
                  .querySelector(
                    `#results .normalView [data-id="${productListURL[index]}"] .stock-status`
                  )
                  .classList.add(`${NHPstockstatusAU}`);

                document.querySelector(
                  `.reportView .report-information[data-report-information="${productListURL[index]}"] .report-stock-status`
                ).innerHTML = `<span>${responseStatus.jason.ChildProducts[0].StockStatusLabel}</span>`;
                document.querySelector(
                  `#results .normalView [data-id="${productListURL[index]}"] .stock-status`
                ).innerHTML = `<span>${responseStatus.jason.ChildProducts[0].StockStatusLabel}</span>`;
              });
          })
          .catch((error) => {
            // console.log("SCRIPT 2NHP AU PRODUCT PAGE ERROR");

            document.querySelector(
              `#results .copyCSV`
            ).innerHTML += `${productListURL[index]},-,-,- <br>`;

            document
              .querySelector(
                `#results .productView .prodView .card[data-id="${productListURL[index]}"]`
              )
              .classList.add(`has-background-danger-light`);

            document
              .querySelector(
                `#results .productView .prodView [data-id="${productListURL[index]}"] .title`
              )
              .classList.add(`has-text-danger`);

            document.querySelector(
              `#results .productView .prodView [data-id="${productListURL[index]}"] .title`
            ).innerHTML = `<p class="is-size-6 is-family-monospace">[NOT FOUND]</p> ${productListURL[index]}`;

            document
              .querySelector(
                `#results .productView .prodView [data-product-photo="${productListURL[index]}"]`
              )
              .remove();

            document
              .querySelector(
                `#results .normalView .card[data-id="${productListURL[index]}"]`
              )
              .classList.add(`has-background-danger-light`);

            document
              .querySelector(
                `#results .diagramView .card[data-id="${productListURL[index]}"]`
              )
              .classList.add(`has-background-danger-light`);

            document
              .querySelector(
                `#results .tableView .card[data-id="${productListURL[index]}"]`
              )
              .classList.add(`has-background-danger-light`);

            document
              .querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .title`
              )
              .classList.add(`has-text-danger`);

            document
              .querySelector(
                `#results .diagramView [data-id="${productListURL[index]}"] .title`
              )
              .classList.add(`has-text-danger`);

            document
              .querySelector(
                `#results .tableView [data-id="${productListURL[index]}"] .title`
              )
              .classList.add(`has-text-danger`);

            document.querySelector(
              `#results .normalView [data-id="${productListURL[index]}"] .title`
            ).innerHTML = `<span class="is-size-6 is-family-monospace">[NOT FOUND]</span> ${productListURL[index]}`;

            document.querySelector(
              `#results .diagramView [data-id="${productListURL[index]}"] .title`
            ).innerHTML = `<span class="is-size-6 is-family-monospace">[NOT FOUND]</span> ${productListURL[index]}`;

            document.querySelector(
              `#results .tableView [data-id="${productListURL[index]}"] .title`
            ).innerHTML = `<span class="is-size-6 is-family-monospace">[NOT FOUND]</span> ${productListURL[index]}`;

            document
              .querySelector(
                `#results .diagramView [data-id="${productListURL[index]}"] .diagramsvg`
              )
              .remove();

            document
              .querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .brand`
              )
              .remove();

            document
              .querySelector(
                `#results .tableView [data-id="${productListURL[index]}"] .brand`
              )
              .remove();

            document
              .querySelector(
                `#results .tableView [data-id="${productListURL[index]}"] .subtitle`
              )
              .remove();

            document
              .querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .subtitle`
              )
              .remove();

            document
              .querySelector(
                `#results .tableView [data-id="${productListURL[index]}"] .assetTable`
              )
              .remove();

            document
              .querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .pictures`
              )
              .remove();

            document
              .querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .cadbim`
              )
              .remove();

            document
              .querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .specifications`
              )
              .remove();

            document
              .querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .fa-globe`
              )
              .classList.add(`has-text-danger`);

            document
              .querySelector(
                `#results .diagramView [data-id="${productListURL[index]}"] .fa-globe`
              )
              .classList.add(`has-text-danger`);

            document
              .querySelector(
                `#results .tableView [data-id="${productListURL[index]}"] .fa-globe`
              )
              .classList.add(`has-text-danger`);

            document
              .querySelector(
                `#results .normalView [data-id="${productListURL[index]}"] .stock-status span`
              )
              .remove();
            // console.error(error);
            // console.log(totalCount);
          });
      }
    }
  }
});

function clearSelectionList() {
  document.querySelector("#results .prodView").innerHTML = "";
  document.querySelector("#results .normalView").innerHTML = "";
  document.querySelector("#results .copyCSV").innerHTML = "";
  document.querySelector("#results .diagramView").innerHTML = "";
  document.querySelector("#results .tableView").innerHTML = "";
  document.querySelector("#results .reportView").innerHTML = "";
  document.getElementById("productItems").value = "";
  document.getElementById("reset").style.visibility = "hidden";
  document.getElementById("resultCards").style.visibility = "hidden";
  document.getElementById("btn-print").classList.toggle("is-hidden");
}

function changeImageSizes() {
  document
    .querySelectorAll("figure.image.is-128x128")
    .forEach((image) => image.classList.toggle("is-200x200"));

  document
    .querySelectorAll(".diagramsvg img")
    .forEach((diagram) => diagram.classList.toggle("largeDiagram"));
}

function showSpecificationsTable() {
  document
    .querySelectorAll(".specifications")
    .forEach((specTable) => specTable.classList.toggle("is-hidden"));
}

function showAccessoryTable() {
  document
    .querySelectorAll(".accessories")
    .forEach((accessoryTable) => accessoryTable.classList.toggle("is-hidden"));
}

function showClipboardBox() {
  document
    .querySelectorAll(".copyCSV")
    .forEach((clipboard) => clipboard.classList.toggle("is-hidden"));
}

function backgroundColor() {
  document
    .querySelectorAll("figure.image.is-128x128")
    .forEach((image) => image.classList.toggle("back-gold"));
}

function viewTable() {
  document
    .querySelectorAll(".assetTable")
    .forEach((aTable) => aTable.classList.toggle("is-hidden"));
  document
    .querySelectorAll(".pictures")
    .forEach((pictures) => pictures.classList.toggle("is-hidden"));
  document
    .querySelectorAll(".cadbim")
    .forEach((cadbim) => cadbim.classList.toggle("is-hidden"));
}

function viewProduct() {
  document
    .querySelectorAll(".productView")
    .forEach((a) => a.classList.remove("is-hidden"));
  document
    .querySelectorAll(".normalView")
    .forEach((b) => b.classList.add("is-hidden"));
  document
    .querySelectorAll(".diagramView")
    .forEach((c) => c.classList.add("is-hidden"));
}

function viewDiagram() {
  document
    .querySelectorAll(".productView")
    .forEach((a) => a.classList.add("is-hidden"));
  document
    .querySelectorAll(".normalView")
    .forEach((b) => b.classList.add("is-hidden"));
  document
    .querySelectorAll(".diagramView")
    .forEach((c) => c.classList.remove("is-hidden"));
}

// EXPERIMENTAL - uses the actual 'Discover' search from NHP website
let auSiteSearchInput = document.getElementById("auSiteSearch");
auSiteSearchInput.addEventListener("change", function () {
  console.log("CHANGE", this.value, this.value == "");
  if (this.value == "") {
    document.querySelector(".experimental .container.is-fluid").innerHTML = "";
    return;
  }
  browser.runtime
    .sendMessage({
      text: this.value,
      message: "NHP-AU-SINGLE-SEARCH",
      verification: "",
    })
    .then((response) => {
      console.log(response);
      document.getElementById("resultCards").style.visibility = "visible";
      let experimental = document.querySelector(".experimental .container");
      experimental.innerHTML = ``;

      let newHTML = `<div class="title has-text-centered">NHP Search Bar Integration</div><div class="grid is-col-min-8">`;
      response.forEach((x) => {
        let isObsolute =
          x.custom_web_product_status === "Obsolete" ? true : false;
        let obsoleteDIV =
          isObsolute === true ? `<div class="obsolete">OBSOLETE</div>` : ``;
        let obsoleteCLASS = isObsolute === true ? `has-text-danger` : ``;
        let obsoleteCLASSheader =
          isObsolute === true ? `has-background-danger-light` : ``;
        let newCard = `<div class="cell"><a href="https://www.nhp.com.au${x.product_url}" target="_blank"><div class="card singleSearch is-flex is-flex-direction-column is-align-items-center">`;
        let header = `<header class="card-header ${obsoleteCLASSheader} width100 is-flex-direction-column is-align-items-center"><p class="card-header-title">${x.sku}</p></header>`;
        let content = `<div class="media-content is-flex is-flex-direction-column is-align-items-center"><p class="subtitle has-text-link is-7">${x.description}</p><p class="subtitle ${obsoleteCLASS} ml-3 mr-3 is-italic is-7">${x.custom_display_name}</p></div>`;

        let image = `<div class="card-image">${obsoleteDIV}<figure class="image imgSearchSize"><img src="https://www.nhp.com.au${x.image_url}" /></figure></div>`;
        newHTML += newCard + header + content + image + "</div></a></div>";
      });
      experimental.innerHTML = newHTML + "</div>";
    });
});
