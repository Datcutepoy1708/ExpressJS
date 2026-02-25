const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");
// [POST] /cart/add/:productID
module.exports.addPost = async (req, res) => {
    const cartID = req.cookies.cartID;
    const productID = req.params.productID;
    const quantity = parseInt(req.body.quantity);
    const cart = await Cart.findOne({
        _id: cartID
    })

    const exitsProductInCart = cart.products.find(item => item.product_id == productID);
    if (exitsProductInCart) {
        const newQuantity = quantity + exitsProductInCart.quantity;
        await Cart.updateOne(
            {
                _id: cartID,
                'products.product_id': productID
            }, {
            'products.$.quantity': newQuantity
        }
        )
    } else {
        const objectCart = {
            product_id: productID,
            quantity: quantity
        }

        await Cart.updateOne({ _id: cartID }, { $push: { products: objectCart } });
    }

    req.flash("success", "Thêm mới sản phẩm vào giỏ hàng");

    // Sửa lại phần redirect
    const referer = req.get('Referer') || `/admin/detail/${productID}`;
    res.redirect(referer);
}

module.exports.index = async (req, res) => {
    const cartID = req.cookies.cartID;
    const cart = await Cart.findOne({
        _id: cartID
    })
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productID = item.product_id;
            const productInfo = await Product.findOne({
                _id: productID,
            })
            productInfo.priceNew = productsHelper.priceNewProduct(productInfo)
            item.productInfo = productInfo;
            item.totalPrice = item.quantity * productInfo.priceNew
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}

// [GET] /delete/:productID
module.exports.delete = async (req, res) => {
    const cartID = req.cookies.cartID;
    const productID = req.params.productID;
    await Cart.updateOne({ _id: cartID }, {
        "$pull": { products: { "product_id": productID } }
    });

    req.flash("success", "Đã xóa thành công");
    const referer = req.get('Referer') || `/cart`;
    res.redirect(referer);
}

// [GET] /update/:productID/:quantity
module.exports.update = async (req, res) => {
    const cartID = req.cookies.cartID;
    const productID = req.params.productID;
    const quantity = req.params.quantity;
    await Cart.updateOne(
        {
            _id: cartID,
            'products.product_id': productID
        }, {
        'products.$.quantity': quantity
    }
    );
    req.flash("success", "Đã cập nhật số lượng");
    const referer = req.get('Referer') || `/admin/detail/${productID}`;
    res.redirect(referer);
}