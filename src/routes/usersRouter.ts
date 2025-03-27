import { Router } from "express";

import { usersController } from "../controllers/usersController";

const router = Router();

router.post("/doesUsernameExist", usersController.doesUsernameExist);

router.post("/deactivateUserAdmin", usersController.deactivateUserAdmin);

router.post("/activateUserAdmin", usersController.activateUserAdmin);

router.post("/registerUserAdmin", usersController.registerUserAdmin);

router.post("/deleteUserAdmin", usersController.deleteUserAdmin);

router.post("/editUserAdmin", usersController.editUserAdmin);

router.post("/getUserDetail", usersController.getUserDetail);

router.post("/loginWithUsername", usersController.loginWithUsername);

router.post("/getEmailWithUsername", usersController.getEmailWithUsername);

router.post("/getAllUsers", usersController.getAllUsers);

export default router;
