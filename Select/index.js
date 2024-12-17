
const customDropdownImplementation = function () {
  const customDropdown = {
    container: "",
    options: [],
    selectedOptions: [],
    selectionAll: false,
    selectionAllBtn: null,
    selectionAllBtnBool: false,
    multiple: false,
    search: false,
    searchInput: null,
    defaultValue: [],
    formatResult: ({ label, value, params }) => {
      let str = Object.keys(params).map((key) => `data-${key}=${params[key]} `).join(" ")
      return `<div value="${value}" ${str}>${label}</div>`
    },
    formatOption: ({ label, value, params }) => {
      let str = Object.keys(params).map((key) => `data-${key}=${params[key]} `).join(" ")
      return `<div value="${value}" ${str}>${label}</div>`
    },
    formatSelectionAll: value => "All",
    triggerSelectAll: value => value,
    change: value => value,


    initializeDropdown(selector, settings = {}) {
      this.container = document.querySelector(`${selector}`);
      this.container.classList.add("custom-select");
      this.selectedOptions = [];
      this.options = settings.options || this.options;
      this.options.params = this.options.params || {};
      this.defaultValue = settings.defaultValue || this.defaultValue;
      this.selectionAll = settings.selectionAll || this.selectionAll;
      this.container.innerHTML = this.createBaseHTML();
      this.multiple = settings.multiple || this.multiple;
      this.search = settings.search || this.search;
      this.formatResult = settings.formatResult || this.formatResult;
      this.formatOption = settings.formatOption || this.formatOption;
      this.formatSelectionAll = settings.formatSelectionAll || this.formatSelectionAll;
      this.triggerSelectAll = settings.triggerSelectAll || this.triggerSelectAll;
      this.change = settings.change || this.change;
      this.selectionAll && this.populateAllDiv();
      this.search && this.populateSearchBox();
      this.displayOptions(this.options)
      this.selectionAll && this.populateInsideOfAllDiv();
      this.openDropdown();
      if (this.defaultValue.length > 0) this.setValue(this.defaultValue);
      if (this.defaultValue.length === 0) this.setValue([this.options[0]]);
    },

    displayOptions(optionsArray) {
      this.clearOptionsFromHTML();
      if (optionsArray.length > 0) {
        optionsArray.forEach((option) => {
          const formattedHTML = this.formatOption(option);
          this.container.querySelector(".custom-options ul").innerHTML += `<li class="dropdown-items ${option.params.selected ? "activeSelectedOption" : ""}" data-obj="${encodeURIComponent(JSON.stringify(option))}">${formattedHTML}</li>`;
        })
        this.handlingEventListeners();
      }
    },


    handlingEventListeners(selector) {
      const self = this;
      const selectOptionMethod = function (element) {
        const selectedOption = JSON.parse(decodeURIComponent(element.getAttribute("data-obj")));
        if (self.multiple) {
          self.selectedOptions = [...self.selectedOptions, selectedOption];
        } else {
          self.selectedOptions.forEach((option) => option.params.selected = false);
          self.selectedOptions = [selectedOption];
          self.closeDropdown(self.container.querySelector("button.custom-select-trigger"));
        }
      }

      const UnselectOptionMethod = function (element) {
        const selectedResult = JSON.parse(decodeURIComponent(element.getAttribute("data-obj")));
        if (self.multiple) {
          self.selectedOptions = self.selectedOptions.map((option) => {
            if (selectedResult && option.value == selectedResult.value) {
              option.params.selected = false;
            } else {
              return option
            }
          }).filter((option) => option != undefined)
        }
      }

      const options = this.container.querySelectorAll(".dropdown-items");
      options.forEach(element => {
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!element.classList.contains("activeSelectedOption")) {
            selectOptionMethod(element);
          } else {
            UnselectOptionMethod(element);
          }
          self.emptySearchInput();
          self.setValue(self.selectedOptions);
        })
      });




      //Deselecting Events
      const selectedResults = this.container.querySelectorAll(".selected-item");
      selectedResults.forEach((resultElement) => {
        resultElement.querySelector(".deselectOption")?.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          const selectedResult = JSON.parse(decodeURIComponent(e.target.parentElement.getAttribute("data-obj")));
          self.selectedOptions = self.selectedOptions.map((option) => {
            if (option.value == selectedResult.value) {
              option.params.selected = false;
            } else {
              return option
            }
          }).filter((option) => option != undefined);
          self.emptySearchInput();
          self.setValue(self.selectedOptions);
          self.selectionAllBtnBool = false;
          self.selectionAll && self.populateInsideOfAllDiv();
        })
      })

      //All Event
      if (this.selectionAllBtn === null && this.selectionAll && this.multiple) {
        this.selectionAllBtn = this.container.querySelector(".custom-options .allSelectionOption");
        this.selectionAllBtn.addEventListener("click", function (e) {
          debugger;
          e.preventDefault();
          e.stopPropagation();
          self.selectionAllBtnBool = !self.selectionAllBtnBool ? true : false;
          if (!self.selectionAllBtnBool) {
            self.selectedOptions.forEach((option) => option.params.selected = false);
            self.selectedOptions = [];
            self.setValue(self.selectedOptions);
          } else {
            self.setValue(self.options);
          }
          self.populateInsideOfAllDiv();
          self.triggerSelectAll(self.selectionAllBtnBool);
        })
      }

      if (this.multiple) {
        // Selecting element for only single item
        this.container.querySelectorAll(".selected-item").forEach((item) => {
          item.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
          })
        })
      }

      //Search Functionality
      if (this.search && !this.searchInput) {
        let typingTime;
        const self = this;
        this.searchInput = this.container.querySelector(".custom-options .searchSelectBox .searchInputBox");
        this.searchInput.addEventListener("input", function (e) {
          e.preventDefault();
          clearTimeout(typingTime);
          typingTime = setTimeout(() => {
            self.hideSearchResultError();
            if (self.searchInput.value.length > 0) {
              const newOptions = self.options.filter((option) => {
                if (option?.label?.toLowerCase().indexOf(self.searchInput.value.toLowerCase()) > -1) {
                  return option;
                }
              })
              if (newOptions.length === 0) self.showSearchResultError();
              self.showSearchButton();
              self.selectionAll && self.hideSelectionAllBtn();
              self.displayOptions(newOptions);
            } else {
              self.hideSearchButton();
              self.selectionAll && self.showSelectionAllBtn();
              self.displayOptions(self.options);
            }
          }, 300)

        })

        const button = this.container.querySelector(".custom-options .searchSelectBox button");
        button.addEventListener("click", () => {
          self.emptySearchInput();
          self.selectionAll && self.showSelectionAllBtn();
          self.displayOptions(self.options);
        })

      }

    },

    setValue(selectedValues = []) {
      this.clearSelectedValuesFromHTML();
      if (selectedValues.length > 0) {
        this.container.querySelector(".custom-select-trigger").classList.remove("paddingOneRem");
        const selectedIds = selectedValues.map((obj) => obj?.value);
        this.selectedOptions = this.options.map((option) => {
          const index = selectedIds.findIndex((id) => option.value == id);
          option.params.selected = false;
          if (index !== -1) {
            option.params.selected = true;
            return option;
          }
        }).filter((option) => option != undefined);
        this.selectedOptions.forEach((option) => {
          const formattedHTML = this.formatResult(option) + `${this.populateCrossIfNeeded()}`;
          this.container.querySelector(".custom-select-trigger div").innerHTML += `<span class="selected-item ${this.multiple ? 'bg-gray' : ''}" data-obj="${encodeURIComponent(JSON.stringify(option))}">${formattedHTML}</span>`;
        })
        this.selectionAllBtnBool = this.options.length === this.selectedOptions.length ? true : false;
        this.multiple && this.selectionAll && this.populateInsideOfAllDiv();
      } else {
        this.container.querySelector(".custom-select-trigger").classList.add("paddingOneRem");
      }
      this.change(this.selectedOptions);
      this.displayOptions(this.options);
      return this.selectedOptions;
    },

    getValue() {
      return this.selectedOptions;
    },

    clearSelectedValuesFromHTML() {
      this.container.querySelector(".custom-select-trigger div").innerHTML = "";
    },

    clearOptionsFromHTML() {
      this.container.querySelector(".custom-options ul").innerHTML = "";
    },

    createBaseHTML() {
      return (
        `<button class="custom-select-trigger">
          <div class="selected-items-options"></div>
        </button>
        <div class="dropdown_custom_menu custom-options listOfSearchFtlters">
          <ul class="listOptions"> </ul>
        </div>
        `
      )
    },

    openDropdown() {
      const self = this;
      const button = this.container.querySelector("button.custom-select-trigger");
      button.addEventListener("click", function (e) {
        e.stopPropagation();
        if (self.options.length > 0 && !button.classList.contains("active")) {
          self.closeOtherDropdown(button);
          button.classList.add("active");
          self.container.querySelector(".custom-options").classList.add("show-options");
          setTimeout(() => self.search && self.searchInput.focus({ focusVisible: true }), 50);
        } else {
          button.classList.remove("active");
          self.closeDropdown(button);
        }
      })

      document.addEventListener("click", (event) => {
        if (!this.container.contains(event.target)) {
          self.closeDropdown(button);
        }
      });

    },

    closeDropdown(element) {
      this.container.querySelector(".custom-options").classList.remove("show-options");
      element.classList.remove("active");
    },

    closeOtherDropdown(element) {
      document.querySelectorAll(".custom-select").forEach((dropdown) => {
        if (dropdown.getAttribute("id") !== this.container.getAttribute("id")) {
          dropdown.querySelector(".custom-options")?.classList.remove("show-options");
          dropdown.querySelector(".custom-select-trigger").classList.remove("active");
        }
      })
    },

    populateAllDiv() {
      let HTML = "";
      HTML = `
        <div class="allSelectionOption">
        </div>
        `;
      this.container.querySelector(".custom-options").insertAdjacentHTML("afterbegin", HTML);
    },

    populateInsideOfAllDiv() {
      let HTML = this.formatSelectionAll(this.selectionAllBtnBool);
      this.container.querySelector(".allSelectionOption").innerHTML = HTML;
      this.selectionAllBtnBool ? this.addActiveClassInAllDiv() : this.removeActiveClassInAllDiv();
    },

    addActiveClassInAllDiv() {
      this.container.querySelector(".allSelectionOption").classList.add("activeSelectedOption")
    },

    removeActiveClassInAllDiv() {
      this.container.querySelector(".allSelectionOption").classList.remove("activeSelectedOption")
    },

    populateCrossIfNeeded() {
      return this.multiple ? `<div class="deselectOption icon-cancel"></div>` : "";
    },

    populateSearchBox() {
      let HTML = (`<div class="searchSelectBox">
          <input type="text" class="searchInputBox">
          <button type="button" style="display:none" class="clearButton">&times;</button>
          <div class="noResultError" style="display:none">No Result Found</div>
        </div>`);
      this.container.querySelector(".custom-options").insertAdjacentHTML("afterbegin", HTML);
    },

    hideSelectionAllBtn() {
      this.selectionAllBtn.style.display = "none";
    },

    showSelectionAllBtn() {
      this.selectionAllBtn.style.display = "block";
    },

    hideSearchButton() {
      this.container.querySelector(".custom-options .searchSelectBox button").style.display = "none";
    },

    showSearchButton() {
      this.container.querySelector(".custom-options .searchSelectBox button").style.display = "block";
    },

    hideSearchResultError() {
      this.container.querySelector(".custom-options .searchSelectBox .noResultError").style.display = "none";
    },

    showSearchResultError() {
      this.container.querySelector(".custom-options .searchSelectBox .noResultError").style.display = "block";
    },

    emptySearchInput() {
      if (this.search) {
        this.searchInput.value = "";
        this.hideSearchButton();
        this.hideSearchResultError();
      }
    }

  }

  return customDropdown;
}

const useCustomDropdown = function (selector, settings) {
  const customDropdownObj = customDropdownImplementation();
  if (selector) customDropdownObj.initializeDropdown(selector, settings);
  return customDropdownObj;
}


export default useCustomDropdown;










