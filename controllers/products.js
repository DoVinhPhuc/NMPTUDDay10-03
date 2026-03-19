const Inventory = require('../schemas/inventory');
const Product = require('../schemas/products'); // Tuỳ thuộc vào tên file của bạn

exports.createProduct = async (req, res) => {
    try {
        // ... logic tạo product của bạn
        const newProduct = await Product.create(req.body);

        // Tự động tạo Inventory tương ứng
        await Inventory.create({
            product: newProduct._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};