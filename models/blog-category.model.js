const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const blogCategorySchema = new mongoose.Schema(
    {
        title: String,
        parent_id: {
            type: String,
            default: ""
        },
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title", // ăn theo title
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        editedBy: [{
            account_id: String,
            editedAt: {
                type: Date,
                default: Date.now
            }
        }],
        deletedAt: Date
    },
    {
        timestamps: true,
    }
);

const blogCategory = mongoose.model('blogCategory', blogCategorySchema, "blog-category");

module.exports = blogCategory;