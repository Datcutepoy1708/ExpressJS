const Users = require("../../models/users.model");
const RoomChat=require("../../models/rooms-chat.models");
module.exports = async (res) => {
    _io.once('connection', (socket) => {
        // Người dùng gửi yêu cầu kết bạn
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // THêm id của A vào phần acceptsFriends của B
            const exitsUserAInB = await Users.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (!exitsUserAInB) {
                await Users.updateOne({
                    _id: userId
                }, {
                    $push: {
                        acceptFriends: myUserId
                    }
                })
            }
            // userId của ông B

            // Thêm id của B vào phần requestFriends của A
            const exitsUserBInA = await Users.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (!exitsUserBInA) {
                await Users.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        requestFriends: userId
                    }
                })
            }
            // Lấy độ dài acceptFriend của  B và trả về cho B
            const infoUserB = await Users.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            const infoUserA = await Users.findOne({
                _id: myUserId
            }).select("id avatar fullName")

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            });
        })

        // Lấy thông tin của A trả về cho B


        // Người dùng hủy yêu cầu kết bạn
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Xóa id của A vào phần acceptsFriends của B
            const exitsUserAInB = await Users.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (exitsUserAInB) {
                await Users.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        acceptFriends: myUserId
                    }
                })
            }
            // userId của ông B

            // Thêm id của B vào phần requestFriends của A
            const exitsUserBInA = await Users.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (exitsUserBInA) {
                await Users.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        requestFriends: userId
                    }
                })
            }

            const infoUserB = await Users.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });
            // Lấy userId của A để trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId,
                useIdA: myUserId
            });
        })

        //Người dùng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Xóa id của A vào phần acceptsFriends của B
            const exitsUserAInB = await Users.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if (exitsUserAInB) {
                await Users.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        acceptFriends: userId
                    }
                })
            }
            // userId của ông B

            // Thêm id của B vào phần requestFriends của A
            const exitsUserBInA = await Users.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if (exitsUserBInA) {
                await Users.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        requestFriends: myUserId
                    }
                })
            }

        })

        // Khi người dùng chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Thêm {user_id,room_chat_id} của A vào trong friendlist của B
            // Xóa id của A vào phần acceptsFriends của B


            const exitsUserAInB = await Users.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            const exitsUserBInA = await Users.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            // Tạo phòng chat
            let roomChat;
            if(exitsUserAInB&&exitsUserBInA){
               roomChat=new RoomChat({
                 typeRoom:"friend",
                 users:[
                    {
                        user_id:userId,
                        role:"superAdmin"

                    },
                    {
                        user_id:myUserId,
                        role:"superAdmin"
                    }
                 ]
               })
               await roomChat.save();
            }
            //Tạo phòng chat

            if (exitsUserAInB) {
                await Users.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {
                        acceptFriends: userId
                    }



                })
            }

            // Thêm {user_id,room_chat_id} của B vào trong friendlist của A
            // Xóa id của B vào phần acceptsFriend của A

            if (exitsUserBInA) {
                await Users.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {
                        requestFriends: myUserId
                    }



                })
            }

        })
    })

}