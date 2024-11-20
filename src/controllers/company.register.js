import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Company } from "../models/company.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerCompany = asynchandler(async (req, res) => {
    // Destructure fields from request body
    const {
        username,
        email,
        name,
        phoneNo,
        emailAddress,
        teamSize,
        manager,
        companyName,
        companyPhoneNo,
        companyEmailAddress,
        contactPerson
    } = req.body;

    // Validate presence of required fields
    if (
        [username, email, name, phoneNo, emailAddress, teamSize, manager, companyName, companyPhoneNo, companyEmailAddress].some(field => !field || (typeof field === "string" && field.trim() === "")) ||
        !contactPerson ||
        !contactPerson.name ||
        !contactPerson.phoneNo ||
        !contactPerson.emailAddress
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await Company.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Create company object
    const company = await Company.create({
        username,
        email,
        bulkPurchases: [{
            teamSize,
            manager,
            companyName,
            companyPhoneNo,
            companyEmailAddress,
            contactPerson: {
                name: contactPerson.name,
                phoneNo: contactPerson.phoneNo,
                emailAddress: contactPerson.emailAddress
            }
        }]
    });

    // Find created user to confirm
    const createdUser = await Company.findById(company._id);

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Respond with success
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export {
    registerCompany,
};
