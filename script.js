import useCustomDropdown from "./Select/main.js"

//Sites

const options = [
  { label: "Northstar Club 1", value: 1, params: { siteName: "Northstar Club 1", siteColor: "red", siteId: 1 } },
  { label: "Boat Rentals", value: 2, params: { siteName: "Boat Rentals", siteColor: "orange", siteId: 2 } },
  { label: "Northstar Club 3", value: 3, params: { siteName: "Northstar Club 3", siteColor: "lime", siteId: 3 } },
  { label: "Northstar Club 4", value: 4, params: { siteName: "Northstar Club 4", siteColor: "blue", siteId: 4 } },
]


// const selectDropdown = document.querySelector(".SearchSiteDropdown");
// options.forEach((option) => {
//   const HTML = `<option value="${option.siteId}">${option.siteName}</option>`
//   selectDropdown.innerHTML += HTML;
// })


// const siteSelect = useCustomDropdown("#custom-dropdown-one", {
//   formatResult: function ({ label, value, params }) {
//     return (`
//         <span class="siteColorBox" style="background-color: ${params.siteColor}"></span>
//         <span class="filterSiteSelectedName">${params.siteName}</span>
//       `)

//   },
//   formatOption: function ({ label, value, params }) {
//     return (`
//         <a class="dropdown-item" href="#">
//           <span class="site_details">
//             <span class="siteColorBox" style="background-color: ${params.siteColor}"></span>
//             <span class="item-site-name">${params.siteName}</span>
//           </span>
//           <input type="checkbox" ${params.selected && "checked"} />
//         </a>
//    `)
//   },
//   formatSelectionAll: function (selectionAllBtnBool) {
//     return (`
//       <a href="#">
//         <span class="site_details">
//         <span class="item-site-name">All</span>
//         </span>
//         <input type="checkbox" ${selectionAllBtnBool && "checked"} />
//       </a>
//       `)
//   },
//   triggerSelectAll: function (bool) {
//   },
//   change: function (selectedOptions) {
//   },
//   options,
//   uniqueKey: "siteId",
//   selectionAll: true,
//   multiple: true,
//   defaultValue: [{ label: "Northstar Club 1", value: 1 }],
//   search: true,
// });


const dropdownOne = useCustomDropdown("#custom-dropdown-one", {
  change: function (selectedOptions) {
  }, options,
});

const dropdownTwo = useCustomDropdown("#custom-dropdown-two", {
  options, multiple: true,
});

const dropdownThree = useCustomDropdown("#custom-dropdown-three", {
  options, multiple: true, search: true
});

const dropdownFour = useCustomDropdown("#custom-dropdown-four", {
  options, multiple: true, search: true,
  formatResult: function ({ label, value, params }) {
    return (`
          <div class="siteItem">
              <span class="site_details">
                <span class="siteColorBox" style="background-color: ${params.siteColor}"></span>
                <span class="item-site-name">${params.siteName}</span>
              </span>
            </div>
          `)
  },
  formatOption: function ({ label, value, params }) {
    return (`
            <div class="siteItem">
              <span class="site_details">
                <span class="siteColorBox" style="background-color: ${params.siteColor}"></span>
                <span class="item-site-name">${params.siteName}</span>
              </span>
              <input type="checkbox" ${params.selected && "checked"} />
            </div>
       `)
  },
});


const dropdownFive = useCustomDropdown("#custom-dropdown-five", {
  options, multiple: true, selectionAll: true,
});







