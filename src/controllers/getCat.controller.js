import { Category } from '../models/categories.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asynchandler } from '../utils/asynchandler.js';

export const getCat = asynchandler(async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
        console.log('no cat');
      throw new ApiError(404, 'No categories found');
    }
    res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
  } catch (err) {
    console.log('no cat');
    throw new ApiError(500, err.message);
    
  }
});
