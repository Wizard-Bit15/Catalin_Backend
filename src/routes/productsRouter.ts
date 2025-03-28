import { Router } from "express";

import { productsController } from "../controllers/productsController";

const router = Router();

router.post("/getAllProducts", productsController.getAllProducts);

router.post("/editProduct", productsController.editProduct);

router.post("/addProduct", productsController.addProduct);

export default router;
