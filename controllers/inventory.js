const Inventory = require('../schemas/inventory');

// Get all
exports.getAllInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json({ success: true, data: inventories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get by ID
exports.getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy Inventory' });
        }
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Add stock
exports.addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!quantity || quantity <= 0) return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });

        const inventory = await Inventory.findOneAndUpdate(
            { product },
            { $inc: { stock: quantity } },
            { new: true, runValidators: true }
        );
        
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory cho Product này' });
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Remove stock
exports.removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!quantity || quantity <= 0) return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });

        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory' });
        
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Stock hiện tại không đủ để giảm' });
        }

        inventory.stock -= quantity;
        await inventory.save();
        
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Reservation
exports.reservation = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!quantity || quantity <= 0) return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });

        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory' });
        
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Stock không đủ để reserve' });
        }

        inventory.stock -= quantity;
        inventory.reserved += quantity;
        await inventory.save();

        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Sold
exports.sold = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!quantity || quantity <= 0) return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });

        const inventory = await Inventory.findOne({ product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory' });
        
        if (inventory.reserved < quantity) {
            return res.status(400).json({ message: 'Số lượng reserved không đủ để bán' });
        }

        inventory.reserved -= quantity;
        inventory.soldCount += quantity;
        await inventory.save();

        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};