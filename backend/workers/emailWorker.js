import sendEmail from "../services/emailService.js";

const emailWorker = async (task) => {

  await sendEmail(task.data);

};

export default emailWorker;