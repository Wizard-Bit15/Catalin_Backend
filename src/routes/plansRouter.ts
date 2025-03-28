import { Router } from "express";

import { plansController } from "../controllers/plansController";

const router = Router();

router.post("/getAllPlans", plansController.getAllPlans);

export default router;
