const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    thumbnail: String,
    stock: Number,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", // ăn theo title
      unique: true
    },
    featured: String,
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    editedBy: [{
      account_id: String,
      editedAt: {
        type: Date,
        default: Date.now
      }
    }],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;