import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  if (token) {
    const decodedToken = jwt.verify(
      token,
      process.env.HASURA_GRAPHQL_JWT_SECRET
    );

    const userId = decodedToken?.issuer;
    return userId;
  }
  return null;
};
