import logger from "../utils/logger.js";

const sendEmail = async (data) => {

  logger(`Sending Email To ${data.email}`);

  return true;

};

export default sendEmail;