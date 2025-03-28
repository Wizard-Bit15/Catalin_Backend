import { Router } from "express";

import { productsController } from "../controllers/productsController";

const router = Router();

router.post("/getAllProducts", productsController.getAllProducts);

export default router;
