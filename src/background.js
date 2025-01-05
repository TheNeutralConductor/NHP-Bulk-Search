browser.runtime.onMessage.addListener((request) => {
  const { text } = request;
  const { message } = request;
  const { verification } = request;
  let cacheBuster = new Date().getTime();

  if (message === "NHP-TOKEN") {
    return fetch("https://www.nhp.com.au/api/antiforgerytoken/get", {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Request-Id": "|278a893abdfd4c79b646849d1b47783b.51fd75509c9b44a1",
        traceparent: "00-278a893abdfd4c79b646849d1b47783b-51fd75509c9b44a1-01",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
      referrer: "https://www.nhp.com.au",
      method: "GET",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((token) => {
        // console.log("NHP-TOKEN-FINISHED", text, token);
        return { nhpToken: token, message: message };
      });
  }

  // returns 20 items
  let TOTALITEMS = 50;
  if (message === "NHP-AU-SINGLE-SEARCH") {
    return fetch("https://www.nhp.com.au/api/search/products", {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-GPC": "1",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
      referrer: "https://www.nhp.com.au/",
      body: `searchTerm=${text}&noofItems=${TOTALITEMS}&discoverParams%5BDiscoverSuggestionParameter%5D=%7B%22keyphrase%22%3A%7B%22max%22%3A${TOTALITEMS}%7D%7D&discoverParams%5BDiscoverRequestForParameter%5D=%5B%22query%22%5D&page%5Blocale_country%5D=au&page%5Blocale_language%5D=en&page%5Breferrer%5D=&page%5Btitle%5D=NHP+Australia+-+Specialists+in+electrical+and+automation+products%2C+systems+and+solutions.&browser%5Buser_agent%5D=Godzirra%2F5.0+(Windows+NT+10.0%3B+Win64%3B+x64%3B+rv%3A133.0)+Gecko%2F20100101+Firefroth%2F133.0`,
      method: "POST",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((auSearch) => {
        return auSearch.content.product.value;
      });
  }

  if (message === "NHP-AU") {
    return fetch(
      `https://www.nhp.com.au/product/${text}?cacheBuster=${cacheBuster}`,
      { cache: "no-store" }
    )
      .then((response) => response.text())
      .then((html) => {
        // console.log(`***** ${text} PRODUCT PAGE FOUND ***********`);
        // console.log(html);
        return { html: html, message: message };
      })
      .catch((error) => {
        console.log(`${text} NHP AU PRODUCT PAGE ERROR`);
        console.error(error);
        return { html: "AU", message: "NETWORK ERROR" };
      });
  }

  if (message === "NHP-AU-ASSETS") {
    let arrayChunks = text.split("|");
    return fetch("https://www.nhp.com.au/assets/search/", {
      credentials: "include",
      headers: {
        "User-Agent": "RedRooster/1.0 (Chips, Coke, lunchtime deal)",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        Priority: "u=4",
      },
      referrer: `https://www.nhp.com.au/product/${arrayChunks[0]}`,
      body: `{\"linkIds\":[\"${arrayChunks[0]}-AU\",\"${arrayChunks[1]}-${arrayChunks[2]}\"],\"locale\":\"AU\"}`,
      method: "POST",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((jason) => {
        // console.log(`${text} PRODUCT AU ASSET PAGE FOUND `);
        // console.log(jason);
        return { jason: jason, message: message };
      })
      .catch((error) => {
        console.log(`${text} ERROR`);
        console.error(error);
        return { jason: "AU", message: `${text} NHP-AU-ASSETS NETWORK ERROR` };
      });
  }

  if (message === "NHP-PHOTO") {
    return fetch(`${text}`)
      .then((response) => {
        // console.log(`NHP PHOTO **************************`, text);
        // console.log(response);
        if (response.ok) {
          return response.blob();
        } else {
          console.log("NHP ERROR FETCH IMAGE");
          console.error("Error fetching image");
        }
      })
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        return { url: objectURL, message: "xxxx" };
      })
      .catch((error) => {
        console.log("NHP FAILURE ERROR TO FETCH IMAGE");
        console.error(error);
      });
  }

  if (message === "NHP-ACCESSORIES") {
    return fetch("https://nhpprod.discover.nhp.com.au/api/search-rec/3", {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcGlLZXkvNDViZGJkMGMiLCJzY29wZSI6eyIyMDMyNzA1NTEiOlsiNmJ4OHFwZ3Q5ZyJdfSwic3RhZ2UiOiJwcm9kIiwicmVnaW9uIjoiYXAtc291dGhlYXN0LTIiLCJqdGkiOiIzYTgwZGM4OC1jMGU4LTRlMTMtYWIxOS1jMmNlMzJkZWY3M2UiLCJpYXQiOjE3MzA1OTU3MTEsImV4cCI6MTczMDY4MjcxMX0.4hL0-Foeolr-F6f15O2pXbw098NzjXLEHV24H7Rvp8Y",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
      referrer: "https://www.nhp.com.au/",
      body: `{\"data\":{\"widget\":{\"rfkid\":\"rfkid_recommended_accessories\"},\"n_item\":100,\"context\":{\"page\":{\"locale_country\":\"AU\",\"locale_language\":\"en\",\"product_group\":\"${text}\"},\"user\":{\"uuid\":\"\"},\"browser\":{\"user_agent\":\"\"}},\"content\":{\"product\":{}}}}`,
      method: "POST",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((jason) => {
        // console.log(`${text} ACCESSORIES SUCCESS `);
        // console.log(jason);
        return { jason: jason, message: message };
      })
      .catch((error) => {
        console.log(`${text} ACCESSORY ERROR`);
        console.error(error);
        return { jason: "AU", message: `${text} ACCESSORIES ERROR` };
      });
  }

  if (message === "NHP-STOCK-STATUS") {
    // console.log(`${text} STOCK STATUS SEND - ${verification}`);
    return fetch(
      "https://www.nhp.com.au/api/cxa/NhpCatalog/GetProductPriceAndStockStatus",
      {
        credentials: "include",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded",
          "Request-Id": "|cd919a3600b04f5b94a09459a0827ee7.ee351f31619f45ef",
          traceparent:
            "00-cd919a3600b04f5b94a09459a0827ee7-ee351f31619f45ef-01",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "same-origin",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          Priority: "u=4",
        },
        referrer: "https://www.nhp.com.au/",
        body: `ItemIds%5B0%5D=${text}&__RequestVerificationToken=${verification}`,
        method: "POST",
        mode: "cors",
      }
    )
      .then((response) => response.json())
      .then((jason) => {
        // console.log(`${text} STOCK STATUS SUCCESS - ${verification}`);
        // console.log(jason);
        return { jason: jason, message: message };
      })
      .catch((error) => {
        console.log(`${text} STOCK STATUS ERROR - ${verification}`);
        console.error(error);
        return {
          jason: "AU",
          message: `${text} STOCK STATUS ERROR with verification - ${verification}`,
        };
      });
  }
});
