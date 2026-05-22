import logger from "../utils/logger.js";

const processImage = async (data) => {

  logger(`Processing Image: ${data.imageName} at ${data.imagePath || "no path"}`);

  return true;

};

export default processImage;