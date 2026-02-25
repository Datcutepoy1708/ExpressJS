const mongoose = require("mongoose");
const objectOrder = new mongoose.Schema(
    {
       cart_id:String,
       userInfo: {
        fullName:String,
        phone:String,
        address:String
       },
       products: [
        {
            product_id: String,
            price: Number,
            disCountPercentage: Number,
            quantity: Number,
        }
       ],
       deleted: {
        type:Boolean,
        default:false
       },
       deletedBy: {
        account_id:String,
        deletedAt:Date
       },
       editedBy: [{
        account_id:String,
        editedAt: {
            type:Date,
            default:Date.now
        }
       }],
       status : {
        type:String,
        default:"inactive"
       }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', objectOrder, "orders");

module.exports = Order;