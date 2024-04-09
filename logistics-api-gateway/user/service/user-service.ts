import User from "../model/user-model";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const generateDefaultSecret = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 32; // 32 characters

  let secret = "";
  for (let i = 0; i < length; i++) {
    secret += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return secret;
};

const jwt = jsonwebtoken;
const jwtSecret = process.env.secret || generateDefaultSecret();

//user id and user's role is passed with token
export const generateToken = (user_id: any) => {
  return jwt.sign({ user_id }, process.env.secret as string, {
    expiresIn: "3h",
  });
};

//Sign up
export const signUp = async (req: any, res: any) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({
      message:
        "Signing up failed, please try again later.",
    });
  }

  if (existingUser) {
    return res.status(422).json({ message: "User already exists." });
  }
  
  const newUser = new User({
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  await newUser.save();

  return res.status(201).json({ message: "User signed up successfully." });
};

//Login
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  let loggedInUser;

  try {
    loggedInUser = await User.findOne({ email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logging in failed, please try again later." });
  }

  if (!loggedInUser) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isValidPassword = await bcrypt.compare(password, loggedInUser.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = generateToken(loggedInUser._id);

   // Set token as a cookie
   res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);

  return res.status(200).json({ token, user_id: loggedInUser._id });
};

//Refresh token
export const refreshToken = async (req: any, res: any) => {
  const { user_id } = req.body;

  const token = generateToken(user_id);

  return res.status(200).json({ token, user_id });
};

// Logout and delete token
export const logout = (req: any, res: any) => {
    let userid = req.body.user_id;
    const cookies = req.headers.cookie;
  
    // Check if cookies are present
    if (!cookies) {
      return res.status(400).json({ message: "No cookies found" });
    }
  
    // Extracting token from the cookies
    const cookieArray = cookies.split("=");
  
    // Check if the cookieArray has enough elements
    if (cookieArray.length < 2) {
      return res.status(400).json({ message: "Invalid cookie format" });
    }
  
    const previousToken = cookieArray[1];
  
    // If token is not found return this response
    if (!previousToken) {
      return res.status(400).json({ message: "Couldn't find token" });
    }
  
    // Verifying token using secret key from the environmental variables
    jwt.verify(String(previousToken), process.env.secret as string, (err) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Authentication failed" }); // If not verified return this error
      }
  
      // If token is verified return this success message as response
      res.clearCookie(`${userid}`);
      req.cookies[`${userid}`] = ""; // <-- Error likely occurring here
      return res.status(200).json({ message: "Successfully Logged Out" });
    });
};

  

//Oauth login
