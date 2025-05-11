import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: false, // ❗️ Less secure (accessible via JavaScript)
    sameSite: "Lax", // ✅ Works more broadly across devices
    secure: false,
  });

  return token;
};
