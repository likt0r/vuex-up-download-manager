export const CANCEL_ERROR_MESSAGE = "Canceled by user";
export const Status = {
  WAITING: "waiting",
  ERROR: "error",
  RUNNING: "running",
  HALTED: "halted",
  PROCESSING: "processing",
  FINISHED: "finished",
  CANCELED: "canceled",
};

export const MutationTypes = {
  ADD_LISTENER: "ADD_LISTENER",
  REMOVE_LISTENER: "REMOVE_LISTENER",
  ADD_UPLOAD_JOB: "ADD_UPLOAD_JOB",
  DELETE_UPLOAD_JOB: "DELETE_UPLOAD_JOB",
  SET_UPLOAD_JOB_ATTRIBUTE: "SET_UPLOAD_JOB_ATTRIBUTE",
  SET_UPLOAD_PIPELINE_STATUS: "SET_UPLOAD_PIPELINE_STATUS",
};

export const ActionTypes = {
  startUploadPipeline: "startUploadPipeline",
  addUploadJob: "addUploadJob",
  startUploadJob: "startUploadJob",
  cancelUploadJob: "cancelUploadJob",
  deleteUploadJob: "deleteUploadJob",
  addGlobalDoneListener: "addGlobalDoneListener",
  addGlobalErrorListener: "addGlobalErrorListener",
  addPipelineDoneListener: "addPipelineDoneListener",
  removeGlobalDoneListener: "removeGlobalDoneListener",
  removeGlobalErrorListeners: "removeGlobalErrorListeners",
  removePipelineDoneListeners: "removePipelineDoneListeners",
  updateUploadJobParams: "updateUploadJobParams",
};

export const GetterTypes = {
  uploadJobs: "uploadJobs",
  getUploadJob: "getUploadJob",
  getUploadJobProgress: "getUploadJobProgress",
  uploadPipelineProgress: "uploadPipelineProgress",
  active: "active",
  runningJobs: "runningJobs",
  waitingJobs: "waitingJobs",
  processingJobs: "processingJobs",
  activeJobs: "activeJobs",
  uploadPipelineActive: "uploadPipelineActive",
};
