import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

export const module = {
  state: () => ({
    uploadJobs: [],
    defaultUrl: undefined,
    uploadPipelineActive: false,
    globalDoneListeners: [],
    globalErrorListeners: [],
    pipelineDoneListeners: [],
  }),
  mutations,
  actions,
  getters,
};
