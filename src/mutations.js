import { MutationTypes } from "constants";

export const mutations = {
  [MutationTypes.ADD_LISTENER](state, { key, listener }) {
    state[key].push(listener);
  },
  [MutationTypes.REMOVE_LISTENER](state, { key, listener }) {
    state[key] = state[key].filter((l) => l !== listener);
  },
  [MutationTypes.ADD_UPLOAD_JOB](state, job) {
    if (!job.cancel) {
      job.cancel = null;
    }
    job.status = STATUS.HALTED;
    job.progress = {
      total: job.file.size,
      progress: 0,
    };
    job.error = null;
    state.uploadJobs.push(job);
  },
  [MutationTypes.DELETE_UPLOAD_JOB](state, { id }) {
    state.uploadJobs = state.uploadJobs.filter((job) => job.id !== id);
  },

  [MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE](state, { id, key, value }) {
    const job = state.uploadJobs.find((job) => job.id === id);
    Vue.set(job, key, value);
    state.uploadJobs = [...state.uploadJobs];
  },

  [MutationTypes.SET_UPLOAD_PIPELINE_STATUS](state, { active }) {
    state.uploadPipelineActive = active;
  },
};
