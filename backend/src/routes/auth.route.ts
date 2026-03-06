import { Router } from "express";
import { RegisterControllerUser, getMeController, loginUserController, logoutUserController  } from "../controllers/auth.controller";
import { authUser } from "../middlewares/auth.middleware";
const authRouter = Router();

/**
 * @route POST api/auth/register     
 * @access Public   
 */
authRouter.post("/register", RegisterControllerUser);

/**
 * @route POST api/auth/login
 * @access Public   
 */
authRouter.post("/login", loginUserController);

/** 
 * @route GET api/auth/logout
 * @access Public   
 */
authRouter.get("/logout", logoutUserController);

/**
 * @route GET api/auth/get-me
 * @access Private  
 */
authRouter.get("/get-me", authUser, getMeController);

export default authRouter;