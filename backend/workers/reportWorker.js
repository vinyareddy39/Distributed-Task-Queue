import generateReport from "../services/reportService.js";

const reportWorker = async (task) => {

  await generateReport(task.data);

};

export default reportWorker;