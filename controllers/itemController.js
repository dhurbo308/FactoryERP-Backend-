import Item from "../models/Item.js";

// GET all items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new item
export const createItem = async (req, res) => {
  try {
    const { itemId, name, category, unit, price } = req.body;

    if (!itemId || !name || !category || !unit || price === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Item.findOne({ itemId });

    if (exists) {
      return res.status(400).json({ message: "Item ID already exists" });
    }

    const newItem = await Item.create({
      itemId,
      name,
      category,
      unit,
      price,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Item.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
