// DELETE ITMES
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item")
    const path = formDeleteItem.getAttribute("data-path")
    buttonDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này không ? ");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
}

// Permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
        let permissions = [];
        const rows = tablePermissions.querySelectorAll("[data-name]");
        rows.forEach(row => {
            const inputs = row.querySelectorAll("input")
            const name = row.getAttribute("data-name");
            if (name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({ id: id, permissions: [] })
                })
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if (checked) {
                        permissions[index].permissions.push(name);
                    }
                })
            }
        })

        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permissions);
            formChangePermissions.submit()
        }
    })
}
// End Permissions

// Permission Data Default 
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermissions = document.querySelector("[table-permissions]");
    records.forEach((record, index) => {
        const permissions = record.permissions;
        permissions.forEach(permission => {
            // FIX: Loại bỏ khoảng trắng trong selector
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            if (row) { // Thêm kiểm tra null để tránh lỗi
                const input = row.querySelectorAll("input")[index];
                if (input) { // Thêm kiểm tra null
                    input.checked = true;
                }
            } else {
                console.warn(`Không tìm thấy row với data-name="${permission}"`);
            }
        })
    })
}
// End Permission Data Default