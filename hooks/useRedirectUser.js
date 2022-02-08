import { verifyToken } from "../lib/jwt";

const useRedirectUser = (context) => {
  const token = context.req?.cookies?.token;
  const userId = verifyToken(token);

  return { token, userId };
};

export default useRedirectUser;
