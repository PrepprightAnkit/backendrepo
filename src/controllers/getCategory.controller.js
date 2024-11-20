import { Category } from '../models/categories.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asynchandler } from '../utils/asynchandler.js';

export const getCategoryById = asynchandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    res.status(200).json(new ApiResponse(200, category, 'Category details retrieved successfully'));
  } catch (err) {
    throw new ApiError(500, err.message);
  }
});
