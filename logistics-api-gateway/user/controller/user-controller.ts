
import express from "express";
import { signUp, login, logout, refreshToken } from "../service/user-service";

const userRouter = express.Router();

userRouter.post("/signup",signUp);
userRouter.post("/login",login);
userRouter.post("/refresh-token",refreshToken);
userRouter.post("/logout",logout);

export default userRouter;