// import videoData from "../data/youtube-videos.json";

const BASE_URL = "youtube.googleapis.com/youtube/v3";

export const getCommonVideos = async (searchQuery) => {
  try {
    const response = await fetch(
      `https://${BASE_URL}/${searchQuery}&maxResults=10&key=${process.env.YOUTUBE_API_KEY}`
    );
    const resData = await response.json();
    if (resData?.error) {
      console.error("Youtube API error", resData.error);
      return [];
    }

    // ?  {return {}} || ({})
    return resData.items.map((item) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        id,
        title: snippet?.title,
        imgUrl: snippet?.thumbnails?.default.url,
        //   imgUrl: item?.snippet?.thumbnails?.high.url,// * on production we use high quality image
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getVideos = (query) => {
  const URL = `search?part=snippet&q=${query}&type=video`;
  return getCommonVideos(URL);
};

export const getPopularVideos = (regionCode = "US") => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=${regionCode}`;
  return getCommonVideos(URL);
};
