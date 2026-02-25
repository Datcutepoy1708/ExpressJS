// Tính năng hiển thị thông báo
// Cài thư viện : express-flash
// CÀI THÊM cookie-parser và express-sesion
// thêm thư viện slug : tác dụng cho người dùng bt đường dẫn này để làm gì ( thư viện mongoose-slug-updater)
// upload ảnh : Cài thêm thư viện multer
// Mã hóa mật khẩu : Sử dụng thư viện md5
// Thư viện chuyển đổi thời gian : momentjs.com
// Thư viện để gửi mã OTP qua mail : nodemailer
// Chat realtime : npm i socket.io
// Chèn nhiều ảnh: file-upload-with-preview
// Khi click vào ảnh phóng to: tìm hiểu view.js
// Cài đặt câu lệnh : 

// Bài tập :
// làm trang xem chi tiết danh mục sản phẩm => xong
// làm trang xóa danh mục sản phẩm => Xong
// làm trang xem chi tiết nhóm quyền => Xong 
// xóa nhóm quyền  =>xong

//Bài tập

// tự làm phần đổi trạng thái tài khoản => xong
// tự làm phần chi tiết tài khoản => xong
// tự làm phần xóa tài khoản => Xong

// Bài tập 

//  làm phần chỉnh sửa Danh mục sản phẩm sẽ lưu được logs thông tin người sửa. => Xong
//  làm phần chỉnh sửa Nhóm quyền sẽ lưu được logs thông tin người sửa. =>Xong
// Quản lý danh mục bài viết => Xong
// Quản lý bài viết  => Xong


/*
cách ngăn chặn cái người dùng sử dụng PostMan để gửi thông tin lên
trong hàm controller tạo hàm 
const permissions= res.locals.role.permissions
if(permissions.include("product.....")){
Có quyền
}
else {
    không có quyền
}
*/

// phân quyền quản lý đơn hàng => Xong
// Quản lý đơn hàng=> Xong

// Thêm mục phân quyền cho Cài đặt chung =>xong

