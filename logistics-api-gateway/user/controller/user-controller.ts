
import express from "express";
import { signUp, login, logout, refreshToken, checkToken } from "../service/user-service";

const userRouter = express.Router();

userRouter.post("/signup",signUp);
userRouter.post("/login",login);
userRouter.post("/refresh-token",refreshToken);
userRouter.post("/logout",logout);
userRouter.post("/checkToken",checkToken);

export default userRouter;