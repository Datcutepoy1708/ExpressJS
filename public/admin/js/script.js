// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {

    let url = new URL(window.location.href);

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}

// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    })
}
// End FormSearch

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
    let url = new URL(window.location.href)
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);

            window.location.href = url.href;
        })
    });
}
//End Pagination

// Check Box Multi
const checkBoxMulti = document.querySelector("[checkbox-multi]")
if (checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']")
    const inputsId = checkBoxMulti.querySelectorAll("input[name='id']")
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
}
// Check Box Multi

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkBoxMulti = document.querySelector("[checkbox-multi]");
        const inputChecked = checkBoxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;

        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn chắc chắn muốn xóa hết không");
            if (!isConfirm) {
                return;
            }
        }

        if (inputChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputChecked.forEach(input => {
                const id = input.getAttribute("value");

                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;

                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }

            })
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Vui long chon it nhat 1 ban ghi");
        }
    })
}
// End Form Change Multi

//  Show Alert
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time)
    console.log(showAlert);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
// End Show Alert

// Upload Image
const uploatImage = document.querySelector("[upload-image]");
if (uploatImage) {
    const uploatImageInput = document.querySelector("[upload-image-input]");
    const uploatImagePreview = document.querySelector("[upload-image-preview]");
    uploatImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploatImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End upload image

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);
    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey,sortValue] = value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    })
    sortClear.addEventListener("click", ()=> {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href=url.href
    })

    // them selected cho options
    const sortKey=url.searchParams.get("sortKey");
    const sortValue=url.searchParams.get("sortValue");
    if(sortKey && sortValue){
        const stringSort=`${sortKey}-${sortValue}`;
        const optionSelected = sort.querySelector(`option[value='${stringSort}']`)
        optionSelected.selected=true;
    }
}
// End Sort

//Sort-Category
const sortCategory = document.querySelector("[sort-category]");
if (sortCategory) {
    let url = new URL(window.location.href);
    const sortSelect = sortCategory.querySelector("[sort-select]");
    const sortClear = sortCategory.querySelector("[sort-clear]");
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey,sortValue] = value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    })
    sortClear.addEventListener("click", ()=> {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href=url.href
    })

    // them selected cho options
    const sortKey=url.searchParams.get("sortKey");
    const sortValue=url.searchParams.get("sortValue");
    if(sortKey && sortValue){
        const stringSort=`${sortKey}-${sortValue}`;
        const optionSelected = sortCategory.querySelector(`option[value='${stringSort}']`)
        optionSelected.selected=true;
    }
}
// End Sort-Category
 