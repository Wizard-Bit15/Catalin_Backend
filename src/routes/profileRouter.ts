import { Router } from "express";

import { profileController } from "../controllers/profileController";

const router = Router();

router.post("/getProfile", profileController.getProfileDetail);

export default router;
