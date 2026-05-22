const retryHandler = async (task) => {

  if (task.retryCount < 3) {

    task.retryCount += 1;

    task.status = "pending";

    await task.save();

    console.log("Retrying Task...");

  } else {

    task.status = "failed";

    await task.save();

    console.log("Task Permanently Failed");

  }

};

export default retryHandler;