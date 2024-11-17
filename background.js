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
        return { nhpToken: token, message: message };
      });
  }

  if (message === "NHP-AU") {
    return fetch(
      `https://www.nhp.com.au/product/${text}?cacheBuster=${cacheBuster}`,
      { cache: "no-store" }
    )
      .then((response) => response.text())
      .then((html) => {
        console.log(`***** ${text} PRODUCT PAGE FOUND ***********`);
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
        console.log(`${text} PRODUCT AU ASSET PAGE FOUND `);
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
        console.log("NHP PHOTO **************************");
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
        console.log(`${text} ACCESSORIES SUCCESS `);
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
        console.log(`${text} STOCK STATUS SUCCESS `);
        // console.log(jason);
        return { jason: jason, message: message };
      })
      .catch((error) => {
        console.log(`${text} STOCK STATUS ERROR`);
        console.error(error);
        return { jason: "AU", message: `${text} STOCK STATUS ERROR` };
      });
  }

  // if (message === "ROCKWELL") {
  //   let jsonObject = [];
  //   return fetch(
  //     `https://es-be-ux-search.cloudhub.io/api/ux/v2/search?queryText=${text}&role=rockwell-search&spellingCorrect=true&spellcheckPremium=10&segments=Productsv4&startIndex=0&numResults=10&facets=&languages=en&locales=en_GLOBAL,en-US&sort=bma&collections=Literature,Web,Sample_Code&site=RA`,
  //     {
  //       credentials: "omit",
  //       headers: {
  //         "User-Agent":
  //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  //         Accept: "application/json",
  //         "Accept-Language": "en-US,en;q=0.5",
  //         "Access-Control-Allow-Origin": "true",
  //         client_id: "fb000cbbe476420b9e70be741abd7a63",
  //         client_secret: "Db420ae8BAdD47ADA4E12cE90Fb1b747",
  //         user_email: "search@rockwellautomation.com",
  //         user_id: "gsKVGXxCuUOSFB5j1ezBaA==",
  //         correlation_id: "1f8b30a3-235e-71b8-75d0-3f1e2108d92e",
  //         "Sec-Fetch-Dest": "empty",
  //         "Sec-Fetch-Mode": "cors",
  //         "Sec-Fetch-Site": "cross-site",
  //         Pragma: "no-cache",
  //         "Cache-Control": "no-cache",
  //       },
  //       referrer: "https://www.rockwellautomation.com/",
  //       method: "GET",
  //       mode: "cors",
  //     }
  //   )
  //     .then((response1) => response1.json())
  //     .then((resultJSON) => {
  //       console.log("ROCKWELL FETCH 1 **************************");
  //       console.log(resultJSON);
  //       console.log(
  //         `CATALOG NUMBER : ${resultJSON.response.docs[0].catalogNumber}`
  //       );
  //       console.log(
  //         `DESCRIPTION : ${resultJSON.response.docs[0].technicalDescription}`
  //       );

  //       jsonObject["rockwellTechnicalDescription"] =
  //         resultJSON.response.docs[0].technicalDescription || "- - -";
  //       jsonObject["rockwellImage"] = resultJSON.response.docs[0].image;
  //       jsonObject["rockwellCompatibilityLink"] =
  //         resultJSON.response.docs[0].compatibilityLink || "- - -";
  //       jsonObject["rockwellInstallationGuideLink"] =
  //         resultJSON.response.docs[0].installationGuideLink || "- - -";
  //       jsonObject["rockwellSpecificationLink"] =
  //         resultJSON.response.docs[0].specificationLink || "- - -";
  //       jsonObject["rockwellRepairable"] =
  //         resultJSON.response.docs[0].repairable || "- - -";
  //       jsonObject["rockwellManufacturer"] =
  //         resultJSON.response.docs[0].manufacturer || "- - -";
  //       jsonObject["rockwellShortDescription"] =
  //         resultJSON.response.docs[0].shortDescription[0] || "- - -";

  //       // return resultJSON.response.docs[0].catalogNumber;
  //       // return resultJSON.response.docs[0];
  //       return { catalogNumber: resultJSON.response.docs[0].catalogNumber };
  //     })
  //     .then((data1) => {
  //       return fetch(
  //         `https://configurator.rockwellautomation.com/api/Product/${data1.catalogNumber}`,
  //         {
  //           credentials: "include",
  //           headers: {
  //             "User-Agent":
  //               "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  //             Accept: "application/json, text/plain, */*",
  //             "Accept-Language": "en-US,en;q=0.5",
  //             "x-pstloc": "USA",
  //             "Sec-Fetch-Dest": "empty",
  //             "Sec-Fetch-Mode": "cors",
  //             "Sec-Fetch-Site": "same-origin",
  //             Pragma: "no-cache",
  //             "Cache-Control": "no-cache",
  //           },
  //           referrer: `https://configurator.rockwellautomation.com/configurator/${data1.catalogNumber}/details`,
  //           method: "GET",
  //           mode: "cors",
  //         }
  //       )
  //         .then((response2) => response2.json())
  //         .then((resultJSON2) => {
  //           console.log(
  //             `https://productadvisor-api.rockwellautomation.com/Product/GetDetailedProduct?catalogNumber=${data1}&type=RaiseExactMatchCatalogNumber`
  //           );
  //           console.log("ROCKWELL FETCH 2 **************************");
  //           console.log(resultJSON2);

  //           let rockwellDocumentsArray = [];
  //           resultJSON2.summary.AllDocuments.forEach((element) => {
  //             rockwellDocumentsArray.push({
  //               docCategory: element.FileType,
  //               type: element.docClass,
  //               name: element.name,
  //               title: element.title,
  //               format: element.formats[0].format,
  //               urlLink: element.formats[0].pages[0],
  //             });
  //             // console.log(
  //             //   `ROCKWELL DOCUMENT - NAME: ${element.name} - TITLE: ${element.title}`
  //             // );
  //           });
  //           jsonObject.rockwellCatNumber = jsonObject["rockwellCatNumber"] =
  //             resultJSON2.summary.Product;
  //           jsonObject["rockwellProductName"] = resultJSON2.summary.ProductName;
  //           jsonObject["rockwellDescription"] = resultJSON2.summary.Description;
  //           jsonObject["rockwellLifeCycle"] =
  //             resultJSON2.summary.ProdLifeCycleStatus;
  //           jsonObject["rockwellDocuments"] = rockwellDocumentsArray;
  //           jsonObject["rockwellDocuments2"] = resultJSON2.summary.Documents;
  //           jsonObject["rockwellAccessories"] = resultJSON2.summary.Accessories;
  //           jsonObject["rockwellDetails"] = resultJSON2.summary.Details;
  //           jsonObject["rockwellRepPhoto"] = resultJSON2.summary.RepPhoto;
  //           jsonObject["rockwellProductType"] = resultJSON2.summary.ProductType;
  //           jsonObject["rockwellQty"] = resultJSON2.summary.Qty;
  //           jsonObject["rockwellUPC"] = resultJSON2.summary.UPC;
  //           jsonObject["rockwellPGC"] = resultJSON2.summary.PGC;
  //           jsonObject["rockwellDS"] = resultJSON2.summary.DS;
  //           jsonObject["rockwellListPrice"] =
  //             resultJSON2.summary.ListPriceFormatted;

  //           // jsonObject = {
  //           //   rockwellCatNumber: resultJSON2.summary.Product,
  //           //   rockwellProductName: resultJSON2.summary.ProductName,
  //           //   rockwellDescription: resultJSON2.summary.Description,
  //           //   rockwellLifeCycle: resultJSON2.summary.ProdLifeCycleStatus,
  //           //   rockwellDocuments: rockwellDocumentsArray,
  //           //   rockwellDocuments2: resultJSON2.summary.Documents,
  //           //   rockwellAccessories: resultJSON2.summary.Accessories,
  //           //   rockwellDetails: resultJSON2.summary.Details,
  //           //   rockwellRepPhoto: resultJSON2.summary.RepPhoto,
  //           //   rockwellProductType: resultJSON2.summary.ProductType,
  //           //   rockwellQty: resultJSON2.summary.Qty,
  //           //   rockwellUPC: resultJSON2.summary.UPC,
  //           //   rockwellPGC: resultJSON2.summary.PGC,
  //           //   rockwellDS: resultJSON2.summary.DS,
  //           //   rockwellListPrice: resultJSON2.summary.ListPriceFormatted,
  //           // };
  //           return jsonObject;
  //         })
  //         .then((jsobj) => {
  //           return { search: jsobj, message: "ROCKWELL-SUCCESS" };
  //         });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       return { search: "", message: "ROCKWELL-FAIL" };
  //     });
  // }
});

// browser.runtime.onMessage.addListener((request) => {
//   const { text } = request;
//   const { message } = request;
//   const numberOfItems = 500;

//   if (message === "AU-SEARCH") {
//     return fetch("https://www.nhp.com.au/api/search/products", {
//       credentials: "include",
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
//         Accept: "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.5",
//         "Content-Type": "application/json",
//         "Request-Id": "|0954860e1bc3432685e87af4182309cc.6dec3921da2a4674",
//         traceparent: "00-0954860e1bc3432685e87af4182309cc-6dec3921da2a4674-01",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-origin",
//         Pragma: "no-cache",
//         "Cache-Control": "no-cache",
//       },
//       referrer:
//         "https://www.nhp.com.au/products/power-distribution-and-protection/circuit-protection/miniature-circuit-breakers",
//       body: `{\"searchTerm\":\"${text}\",\"noOfItems\":${numberOfItems}}`,
//       method: "POST",
//       mode: "cors",
//     })
//       .then((response) => response.json())
//       .then((jason) => {
//         return { json: jason, message: message };
//       });
//   }

//   if (message === "NHP-PHOTO") {
//     return fetch(`${text}`)
//       .then((response) => {
//         if (response.ok) {
//           return response.blob();
//         } else {
//           console.log("NHP ERROR FETCH IMAGE");
//           console.error("Error fetching image");
//         }
//       })
//       .then((blob) => {
//         const objectURL = URL.createObjectURL(blob);
//         return { url: objectURL, message: "xxxx" };
//       })
//       .catch((error) => {
//         console.log("NHP FAILURE ERROR TO FETCH IMAGE");
//         console.error(error);
//       });
//   }
// });
