import jwt from "jsonwebtoken";
import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";

const stats = async (req, res) => {
  if (req.method === "POST") {
    try {
      const token = req.cookies?.token;
      const { videoId, favourited, watched = true } = req.body;
      // console.log(token);
      // [x] check token exists or not
      if (!token || !videoId) {
        res
          .status(403)
          .json({ status: false, message: "Invalid token or invalid videoId" });
        return;
      }
      // [x] decode the token using our db secret
      const decodedToken = jwt.verify(
        token,
        process.env.HASURA_GRAPHQL_JWT_SECRET
      );
      // [x] if token valid then fetch for stats record for that specific user
      const userId = decodedToken.issuer;
      const videoInfo = await findVideoIdByUser(token, userId, videoId);
      // console.log(videoInfo);
      // [x] if stats record NOT found then insert a new record
      // [x] if stats record found then update that record
      let newRecord = null;
      if (videoInfo?.length === 0) {
        newRecord = await insertStats(token, {
          favourited,
          watched,
          userId,
          videoId,
        });
      } else {
        newRecord = await updateStats(token, {
          favourited,
          watched,
          userId,
          videoId,
        });
      }

      res.status(200).json({
        status: true,
        message: "Stats created/updated successfully.",
        data: newRecord,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: error?.message });
    }
  } else if (req.method === "GET") {
    try {
      const token = req.cookies?.token;
      const videoId = req.query?.videoId;
      // console.log(token);
      // [x] check token exists or not
      if (!token || !videoId) {
        res
          .status(403)
          .json({ status: false, message: "Invalid token or invalid videoId" });
        return;
      }
      // [x] decode the token using our db secret
      const decodedToken = jwt.verify(
        token,
        process.env.HASURA_GRAPHQL_JWT_SECRET
      );
      // [x] if token valid then fetch for stats record for that specific user
      const userId = decodedToken.issuer;
      const videoInfo = await findVideoIdByUser(token, userId, videoId);
      // console.log(videoInfo);
      res.status(200).json({
        status: true,
        data: videoInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: error?.message });
    }
  } else {
    res.status(500).json({
      status: false,
      message: "Unhandled route!!!, Please check your method",
    });
  }
};

export default stats;
