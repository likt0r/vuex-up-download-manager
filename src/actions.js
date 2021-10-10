import shortid from "shortid";
import { axios } from "axios";
import { MutationTypes, ActionTypes } from "constants";
export const actions = {
  [ActionTypes.startUploadPipeline]({ commit, dispatch, getters }) {
    commit(MutationTypes.SET_UPLOAD_PIPELINE_STATUS, {
      active: true,
    });
    getters.uploadJobs
      .filter((job) => job.status === STATUS.HALTED)
      .forEach((job) => {
        dispatch(ActionTypes.startUploadJob, { id: job.id });
      });
  },
  [ActionTypes.addUploadJob]({ commit, state }, { file, params, onDone, url }) {
    const id = shortid.generate();

    commit(MutationTypes.ADD_UPLOAD_JOB, { id, file, params, onDone, url });
    return id;
  },

  async [ActionTypes.startUploadJob](
    { commit, dispatch, state, getters },
    { id }
  ) {
    const { file, params, onDone, url } = getters.getUploadJob(id);
    if (state.uploadPipelineActive) {
      // if already one job is running set status to waiting
      if (state.uploadJobs.find((job) => job.status === STATUS.RUNNING)) {
        commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
          id,
          key: "status",
          value: STATUS.WAITING,
        });
        return;
      }
    }
    const formData = new FormData();
    formData.append("file", file);
    const source = axios.CancelToken.source();
    commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
      id,
      key: "cancel",
      value: source.cancel,
    });
    commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
      id,
      key: "status",
      value: STATUS.RUNNING,
    });
    try {
      const request = await axios.post(url || state.defaultUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        cancelToken: source.token,
        params,
        onUploadProgress: (progressEvent) => {
          commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
            id,
            key: "progress",
            value: progressEvent,
          });
          if (progressEvent.total === progressEvent.loaded) {
            commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
              id,
              key: "status",
              value: STATUS.PROCESSING,
            });
          }
        },
      });
      const response = await request.data;
      commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
        id,
        key: "status",
        value: STATUS.FINISHED,
      });
      if (onDone) {
        onDone({ data: response });
      }
      // call global done listeners
      state.globalDoneListeners.forEach((listener) =>
        listener({ id, data: response })
      );
      return response;
    } catch (error) {
      if (error.message === CANCEL_ERROR_MESSAGE) {
        commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
          id,
          key: "status",
          value: STATUS.HALTED,
        });
      } else {
        commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
          id,
          key: "status",
          value: STATUS.ERROR,
        });
        commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
          id,
          key: "error",
          value: error.message,
        });
        // call global error listeners
        state.globalErrorListeners.forEach((listener) =>
          listener({ id, error })
        );
      }
    } finally {
      if (state.uploadPipelineActive) {
        const nextJob = state.uploadJobs.find(
          (job) => job.status === STATUS.WAITING
        );
        if (nextJob) {
          dispatch(ActionTypes.startUploadJob, { id: nextJob.id });
        } else {
          commit(MutationTypes.SET_UPLOAD_PIPELINE_STATUS, {
            active: false,
          });
          state.pipelineDoneListeners.forEach((listener) => listener());
        }
      }
    }
  },
  [ActionTypes.cancelUploadJob]({ commit, getters }, { id }) {
    const { cancel, status } = getters.getUploadJob(id);
    if (status === STATUS.RUNNING) {
      commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
        id,
        key: "cancel",
        value: null,
      });
      commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
        id,
        key: "progress",
        value: null,
      });

      cancel(CANCEL_ERROR_MESSAGE);
    }
    commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
      id,
      key: "status",
      value: STATUS.HALTED,
    });
  },
  [ActionTypes.deleteUploadJob]({ commit }, { id }) {
    commit(MutationTypes.DELETE_UPLOAD_JOB, { id });
  },
  /**
   *
   * @param {*} store
   * @param {*} listener function({jobId, data})
   */
  [ActionTypes.addGlobalDoneListener]({ commit }, listener) {
    commit(MutationTypes.ADD_LISTENER, {
      key: "globalDoneListeners",
      listener,
    });
  },
  /**
   *
   * @param {*} store
   * @param {*} listener function({jobId, error})
   */
  [ActionTypes.addGlobalErrorListener]({ commit }, listener) {
    commit(MutationTypes.ADD_LISTENER, {
      key: "globalErrorListeners",
      listener,
    });
  },
  /**
   *
   * @param {*} store
   * @param {*} listener function
   */
  [ActionTypes.addPipelineDoneListener]({ commit }, listener) {
    commit(MutationTypes.ADD_LISTENER, {
      key: "pipelineDoneListeners",
      listener,
    });
  },

  [ActionTypes.removeGlobalDoneListener]({ commit }, listener) {
    commit(MutationTypes.REMOVE_LISTENER, {
      key: "globalDoneListeners",
      listener,
    });
  },
  [ActionTypes.removeGlobalErrorListeners]({ commit }, listener) {
    commit(MutationTypes.REMOVE_LISTENER, {
      key: "globalErrorListeners",
      listener,
    });
  },

  [ActionTypes.removePipelineDoneListeners]({ commit }, listener) {
    commit(MutationTypes.REMOVE_LISTENER, {
      key: "pipelineDoneListeners",
      listener,
    });
  },

  [ActionTypes.updateUploadJobParams]({ commit }, { id, params }) {
    commit(MutationTypes.SET_UPLOAD_JOB_ATTRIBUTE, {
      id,
      key: "params",
      value: params,
    });
  },
};
