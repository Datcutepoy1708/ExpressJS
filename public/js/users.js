// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
   listBtnAddFriend.forEach(button => {
      button.addEventListener("click", () => {
         button.closest(".box-user").classList.add("add");

         const userId = button.getAttribute("btn-add-friend");
         socket.emit("CLIENT_ADD_FRIEND", userId);
      })
   })
}
// Hết chức năng gửi yêu cầu

// Chức năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
   listBtnCancelFriend.forEach(button => {
      button.addEventListener("click", () => {
         button.closest(".box-user").classList.remove("add");

         const userId = button.getAttribute("btn-cancel-friend");
         socket.emit("CLIENT_CANCEL_FRIEND", userId);
      })
   })
}
// Hết chức năng hủy yêu cầu

// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
   listBtnRefuseFriend.forEach(button => {
      button.addEventListener("click", () => {
         button.closest(".box-user").classList.add("refuse");

         const userId = button.getAttribute("btn-refuse-friend");
         socket.emit("CLIENT_REFUSE_FRIEND", userId);
      })
   })
}
// Hết chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
   listBtnAcceptFriend.forEach(button => {
      button.addEventListener("click", () => {
         button.closest(".box-user").classList.add("accepted");

         const userId = button.getAttribute("btn-accept-friend");
         socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      })
   })
}
// Hết chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
   const badgeUserAccept = document.querySelector("[badge-user-accept]");
   const userId = badgeUserAccept.getAttribute("badge-users-accept");

   if (userId == data.userId) {
      badgeUserAccept.innerHTML = data.lengthAcceptFriends;
   }
})
//SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
   // Trang lời mời kết bạn
   const dataUsersAccept = document.querySelector("[data-users-accept]");
   if (dataUsersAccept) {
      const userId = dataUsersAccept.getAttribute("data-users-accept");
      if (userId == data.userId) {
         // Vẽ user ra giao diện
         const newBoxUser = document.createElement("div");
         newBoxUser.classList.add("col-6");
         newBoxUser.setAttribute("user-id", data.infoUserA._id);
         newBoxUser.innerHTML = `
         <div class="box-user">
          <div class="inner-avatar">
            <img src="https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg" alt=${data.infoUserA.fullName}>
          </div>
          <div class="inner-info">
           <div class="inner-name">${data.infoUserA.fullName}</div>
           <div class="inner-buttons">
            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserA._id}>Kết bạn </button>
            <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoUserA._id}>Hủy</button>
            <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend="" disabled="">Đã chấp nhận</button>
          </div>
           </div>
        </div>
      `
      }
      dataUsersAccept.appendChild(newBoxUser);
   }


   // trang danh sách người dùng
   const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
   if (dataUserNotFriend) {
      const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
      if (userId == data.userId) {
         //Xóa A khỏi danh sách của B
         const boxUserRemove = dataUserNotFriend.querySelector(`[user-id ="${data.infoUserA._id}"]`);
         if (boxUserRemove) {
            dataUserNotFriend.removeChild(boxUserRemove)
      }
      }
   }
      // trang danh sách ng dùng

      // Xóa lời mời kết bạn
      const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
      btnRefuseFriend.addEventListener("click", () => {
         btnRefuseFriend.closest(".box-user").classList.add("refuse");
         const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");
         socket.emit("CLIENT_REFUSE_FRIEND", userId);
      })
      // Xóa lời mời kết bạn

      // Chấp nhận lời mời kết bạn
      const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
      btnAcceptFriend.addEventListener("click", () => {
         btnAcceptFriend.closest(".box-user").classList.add("accepted");
         const userId = btnAcceptFriend.getAttribute("btn-accept-friend");
         socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      })
      // Chấp nhận lời mời kết bạn

   })
//SERVER_RETURN_INFO_ACCEPT_FRIEND

//SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
   const dataUsersAccept = document.querySelector("[data-users-accept]");
   const userId = dataUsersAccept.getAttribute("data-users-accept");
   if (userId == data.userId) {
      // xÓA A khỏi danh sách
      const boxUserRemove = dataUsersAccept.querySelector(`[user-id ="${data.userIdA}"]`);
      if (boxUserRemove) {
         dataUsersAccept.removeChild(boxUserRemove)
      }
   }
})
//SERVER_RETURN_USER_ID_CANCEL_FRIEND


//SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE",(data)=>{
   const dataUserFriend=document.querySelector("[data-users-friend]");
   if(dataUserFriend){
      const boxUser=dataUserFriend.querySelector(`[user-id="${user.id}"]`);
      if(boxUser){
         boxUser.querySelector("[status]").setAttribute("status","online");
      }
   }
})
//SERVER_RETURN_USER_ONLINE

//SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE",(data)=>{
   const dataUserFriend=document.querySelector("[data-users-friend]");
   if(dataUserFriend){
      const boxUser=dataUserFriend.querySelector(`[user-id="${user.id}"]`);
      if(boxUser){
         boxUser.querySelector("[status]").setAttribute("status","offline");
      }
   }
})
////SERVER_RETURN_USER_OFFLINE