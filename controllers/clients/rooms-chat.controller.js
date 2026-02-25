const User= require("../../models/users.model");
const RomChat=require("../../models/rooms-chat.models");

module.exports.index = async(req,res)=> {
    const userId= res.locals.user.id;
    const listRoomChat= await RomChat.find({
        "users.user_id":userId,
        typeRoom:"group",
        deleted:false
    })
    res.render("client/pages/rooms-chat/index",{
        pageTitle: "Danh sách phòng",
        listRoomChat:listRoomChat
    })
}
module.exports.create=async(req,res)=>{
    const listFriend = res.locals.user.friendList;
    for(const friend of listFriend){
        const infoFriend=await User.findOne({
            _id:friend.user_id
        }).select("fullName avatar");

        friend.infoFriend=infoFriend;
    }

    res.render("client/pages/rooms-chat/create",{
        pageTitle:"Tạo phòng chat",
        listFriend:listFriend
    })
}
module.exports.createPost=async(req,res)=> {
    const title=req.body.title;
    const userId=req.body.usersId;


    const dataChat = {
        title: title,
        typeRoom: "group",
        users:[]
    }
    userId.forEach(userId=>{
        dataChat.users.push({
            user_id:userId,
            role:"user"
        })
    })

    dataChat.users.push({
        user_id:res.locals.user.id,
        role: "superAdmin"
    })
    const room =new RomChat(dataChat);
    await room.save();
    res.redirect(`/chat/${room.id}`);

}