import { magicAdmin } from "../../lib/magin-admin";
import { removeTokenCookie } from "../../lib/cookies";
import { verifyToken } from "../../lib/jwt";

const logout = async (req, res) => {
  if (req.method === "POST") {
    try {
      const token = req.cookies?.token;
      if (!token) {
        return res
          .status(401)
          .json({ status: false, message: "Unauthorized access!" });
      }
      // 1  get data from Token and remove token
      const userId = verifyToken(token);
      removeTokenCookie(res);
      // 2 logout from magic account as well
      await magicAdmin.users.logoutByIssuer(userId);
      // 3 redirect user back to login
      res.writeHead(302, { Location: "/login" });
      res.end();
    } catch (error) {
      console.log(error);
      res.status(401).json({ status: false, message: "User is not logged in" });
    }
  } else {
    res.status(500).json({
      status: false,
      message: "Unhandled route!!!, Please check your method",
    });
  }
};

export default logout;
