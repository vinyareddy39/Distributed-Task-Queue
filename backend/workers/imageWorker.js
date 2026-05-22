import processImage from "../services/imageService.js";

const imageWorker = async (task) => {

  await processImage(task.data);

};

export default imageWorker;