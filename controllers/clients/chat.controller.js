const Chat = require("../../models/chat.model");
const User = require("../../models/users.model");
const Chatsocket = require("../../sockets/client/chat.socket");
module.exports.index = async (req, res) => {
     
    const roomChatId=req.params.roomChatId;
    // Socket IO
    Chatsocket(req,res);
    // End Socket IO
    // Lấy ra data 
    const chats = await Chat.find({
        room_chat_id:roomChatId,
        deleted: false
    })
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");

        chat.infoUser = infoUser
    }

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    });
}