import videoTestData from "../data/youtube-videos.json";

const BASE_URL = "youtube.googleapis.com/youtube/v3";

const fetchVideos = async (url) => {
  const response = await fetch(
    `https://${BASE_URL}/${url}&maxResults=10&key=${process.env.YOUTUBE_API_KEY}`
  );
  return await response.json();
};

export const getCommonVideos = async (url) => {
  try {
    // const resData = await fetchVideos(url);
    const resData = process.env.DEVELOPMENT
      ? videoTestData
      : await fetchVideos(url);

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
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
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

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(URL);
};
