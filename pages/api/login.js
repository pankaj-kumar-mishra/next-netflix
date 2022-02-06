import { magicAdmin } from "../../lib/magin-admin";
import jwt from "jsonwebtoken";
import { createNewUser, isNewUser } from "../../lib/db/hasura";
import { setTokenCookie } from "../../lib/cookies";

const login = async (req, res) => {
  if (req.method === "POST") {
    try {
      // 1 extract didToken from magic login
      const didToken = req.headers?.authorization?.substr(7);
      if (!didToken) {
        res.status(401).json({ status: false, message: "Invalid magic token" });
      }

      // 2 get metadata of user using token
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      // console.log(metadata);

      // 3 generate jwt token for user
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000), // today
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60), // after 7 days
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": metadata.issuer,
          },
        },
        process.env.HASURA_GRAPHQL_JWT_SECRET
      );
      // console.log(token);

      // 4 check user exist in hasura or not, if not create new user.
      const isNewUserRes = await isNewUser(token, metadata.issuer);
      isNewUserRes && (await createNewUser(token, metadata));

      // 5 set token
      setTokenCookie(token, res);

      res.status(200).json({
        status: true,
        message: "User token created/updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: "Something went wrong" });
    }
  } else {
    res.status(500).json({
      status: false,
      message: "Unhandled route!!!, Please check your method",
    });
  }
};

export default login;
