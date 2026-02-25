const Order = require("../../models/orders.model");
const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination");
const productHelper = require("../../helpers/product");
const searchHelpers = require("../../helpers/Search");
const filterStatusHelpers = require("../../helpers/filterStatus");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelpers(req.query);
    let find = {
        deleted: false
    };
    const countOrders = await Order.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    },
        req.query,
        countOrders
    )
    const objectSearch = searchHelpers(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }
    let sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"
    }
    const orders = await Order.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    // Lấy tên sản phẩm
    const productIds = [];
    orders.forEach(order => {
        if (order.products && order.products.length > 0) {
            order.products.forEach(product => {
                if (product.product_id && !productIds.includes(product.product_id)) {
                    productIds.push(product.product_id)
                }
            })
        }
    })
    const products = await Product.find({
        _id: { $in: productIds },
        deleted: false
    }).select('id title')
    const productMap = {}
    products.forEach(product => {
        productMap[product._id.toString()] = product.title
    })
    const ordersWithProductNames = orders.map(order => ({
        ...order._doc,
        products: order.products ? order.products.map(product => ({
            ...product._doc,
            productName: productMap[product.product_id] || "Sản phẩm không tồn tại"
        })) : []
    }))
    // Lấy tên sản phẩm

    // Tính tiền sản phẩm
    const discountIds = [];
    orders.forEach(order => {
        if (order.products && order.products.length > 0) {
            order.products.forEach(product => {
                if (product.product_id && !discountIds.includes(product.product_id)) {
                    discountIds.push(product.product_id)
                }
            })
        }
    })
    const discounts = await Product.find({
        _id: { $in: discountIds },
        deleted: false
    }).select('id discountPercentage')
    const discountMap = {}
    discounts.forEach(discount => {
        discountMap[discount._id.toString()] = discount.discountPercentage || 0
    })

    const finalOrder = ordersWithProductNames.map(order => {
        let total = 0;
        const productsWithPrice = order.products.map(product => {
            const discount = discountMap[product.product_id] || 0;
            const productForHelper = {
                price: product.price,
                discountPercentage: discount
            }
            const priceNew = productHelper.priceNewProduct(productForHelper);
            const finalPrice = parseFloat(priceNew) * product.quantity;
            total += finalPrice;

            return {
                ...product,
                priceNew: parseFloat(priceNew),
                finalPrice: finalPrice
            }
        })
        return {
            ...order,
            products: productsWithPrice,
            total: total.toFixed(2)
        }
    })

    // Tính tiền sản phẩm
    res.render("admin/pages/order/index", {
        pageTitle: "Danh sách đơn hàng",
        orders: finalOrder,
        filterStatus: filterStatus,
        pagination: objectPagination
    })
}

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params._id;
    await Order.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công");
    const referer = req.get('Referer') || '/admin/order';
    res.redirect(referer);
}

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Order.updateMany({ _id: { $in: ids } }, { status: "active" })
            req.flash("success", "Cập nhật đơn hàng thành công")
            break
        case "inactive":
            await Order.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            req.flash("error", "Cập nhật đơn hàng không thành công")
            break
        case "delete-all":
            await Order.updateMany({ _id: { $in: ids } }, { deleted: true })
            req.flash("success", "Đã xóa đơn hàng thành công")
            break
        default:
            break;

    }
    const referer = req.get('Referer') || '/admin/order';
    res.redirect(referer);
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const order = await Order.findOne(find);
        if (!order) {
            req.flash("error", "Không tìm thấy đơn hàng");
            return res.redirect(`${systemConfig.prefixAdmin}/order`);
        }

        // Lấy danh sách product IDs từ đơn hàng
        const productIds = [];
        if (order.products && order.products.length > 0) {
            order.products.forEach(product => {
                if (product.product_id && !productIds.includes(product.product_id)) {
                    productIds.push(product.product_id);
                }
            });
        }

        // Lấy thông tin sản phẩm (tên, discount, thumbnail) trong 1 lần query
        const products = await Product.find({
            _id: { $in: productIds },
            deleted: false
        }).select('_id title discountPercentage thumbnail');

        // Tạo maps để lookup nhanh
        const productMap = {};
        const discountMap = {};
        const thumbnailMap = {};

        products.forEach(product => {
            const id = product._id.toString();
            productMap[id] = product.title;
            discountMap[id] = product.discountPercentage || 0;
            thumbnailMap[id] = product.thumbnail || "Không tồn tại hình ảnh";
        });

        // Xử lý products trong order với đầy đủ thông tin
        let total = 0;
        const processedProducts = order.products.map(product => {
            const discount = discountMap[product.product_id] || 0;

            // Tính giá mới sau discount
            const productForHelper = {
                price: product.price,
                discountPercentage: discount
            };
            const priceNew = productHelper.priceNewProduct(productForHelper);
            const finalPrice = parseFloat(priceNew) * product.quantity;
            total += finalPrice;

            return {
                ...product._doc,
                productName: productMap[product.product_id] || "Sản phẩm không tồn tại",
                productThumbnail: thumbnailMap[product.product_id] || "Sản phẩm không tồn tại",
                priceNew: parseFloat(priceNew),
                finalPrice: finalPrice
            };
        });

        // Tạo object order hoàn chỉnh
        const finalOrder = {
            ...order._doc,
            products: processedProducts,
            total: total.toFixed(2)
        };

        res.render("admin/pages/order/detail", {
            pageTitle: "Chi tiết đơn hàng",
            order: finalOrder
        });

    } catch (error) {
        console.error('Order detail error:', error);
        req.flash("error", "Chỉnh sửa bị lỗi vui lòng load lại");
        res.redirect(`${systemConfig.prefixAdmin}/order`);
    }
};
module.exports.delete= async(req,res)=> {
    const id=req.params._id;
    await Order.updateOne({_id:id},{deleted:true});
    const referer=req.get('Referer') || '/admin/order';
    res.redirect(referer);
}