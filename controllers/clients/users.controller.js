const User = require("../../models/users.model");
const usersSocket = require("../../sockets/client/users.socket");

module.exports.notFriend = async (req, res) => {

    //Socket
    usersSocket(res);
    //Socket
    const userId = res.locals.user.id
    const myUser = await User.findOne({
        _id: userId
    })
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } }
        ],
        status: "active",
        deleted: false
    }).select("avatar fullName")
    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sách người dùng",
        users: users
    })
}

module.exports.request = async (req, res) => {

    // Socket
    usersSocket(res);
    //Socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    })
    const requestFriends = myUser.requestFriends;
    const users = await User.find({
        _id: { $in: requestFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName")

    res.render("client/pages/users/request", {
        pageTitle: "Lời mời đã gửi",
        users: users
    })
}

module.exports.accept = async (req, res) => {

    // Socket
    usersSocket(res);
    //Socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    })
    const acceptFriends = myUser.acceptFriends;
    const users = await User.find({
        _id: { $in: acceptFriends },
        status: "active",
        deleted: false
    }).select("id avatar fullName")

    res.render("client/pages/users/accept", {
        pageTitle: "Lời mời đã nhận",
        users: users
    })
}
module.exports.friend = async (req, res) => {
    // Socket
    usersSocket(res);
    //Socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    })
    const FriendList = myUser.friendList;
    const FriendListId=FriendList.map(item=>item.user_id)
    const users = await User.find({
        _id: { $in: FriendListId },
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline")

    users.forEach(user=>{
        const infoUser= FriendList.find(item=>item.user_id==user.id)
        user.roomChatId=infoUser.room_chat_id;
    })

    res.render("client/pages/users/friend", {
        pageTitle: "Lời mời đã nhận",
        users: users
    })
}