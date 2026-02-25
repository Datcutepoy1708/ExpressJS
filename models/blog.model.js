const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const blog= new mongoose.Schema(
    {
        title:String,
        blogs_category_id: {
           type:String,
           default:""
        },
        description: String,
        content:String,
        status:String,
        position:Number,
        thumbnail:String,
        slug: {
            type:String,
            slug:"title",
            unique: true
        },
        featured: String,
        createdBy: {
            account_id:String,
            createdAt: {
                type:Date,
                default:Date.now
            }
        },
        deleted: {
            type:Boolean,
            default:false
        },
        deletedBy: {
            account_id: String,
            deletedAt:Date
        },
        editedBy: [{
            account_id:String,
            editedAt: {
                type:Date,
                default:Date.now
            }
        }]
    },
    {
        timestamps:true,
    }
)

const Blog= mongoose.model('Blog',blog,"blog");

module.exports=Blog;