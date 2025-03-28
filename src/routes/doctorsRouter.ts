import { Router } from "express";

import { doctorsController } from "../controllers/doctorsController";

const router = Router();

router.post("/getAllDoctors", doctorsController.getAllDoctors);

router.post("/editDoctor", doctorsController.editDoctor);

router.post("/addDoctor", doctorsController.addDoctor);

export default router;
