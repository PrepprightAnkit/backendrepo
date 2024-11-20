import { Router } from "express";
import { registerCompany } from "../controllers/company.register.js";
const router = Router();

router.route("/registerCompany").post(

    registerCompany);

export default router; // Default export
