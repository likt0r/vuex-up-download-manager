import { GetterTypes } from "constants";
export const getters = {
  [GetterTypes.uploadJobs]: (state) => state.uploadJobs,
  [GetterTypes.getUploadJob]: (state) => (id) =>
    state.uploadJobs.find((entry) => entry.id === id),
  [GetterTypes.getUploadJobProgress]: (state) => (id) => {
    const { progress } = state.uploadJobs.find((entry) => entry.id === id);
    const result =
      progress && progress.total
        ? Math.round((100 * progress.loaded) / progress.total)
        : 0;

    return result;
  },
  [GetterTypes.uploadPipelineProgress]: (state) => {
    const { total, loaded } = state.uploadJobs
      .filter(
        ({ status }) => status !== STATUS.HALTED || status !== STATUS.ERROR
      )
      .reduce(
        (acc, { progress }) => {
          acc.total += progress.total;
          acc.loaded += progress.loaded ? progress.loaded : 0;
          return acc;
        },
        { total: 0, loaded: 0 }
      );

    return total && state.uploadPipelineActive
      ? Math.round((100 * loaded) / total)
      : 0;
  },
  [GetterTypes.active]: (state) => {
    state.uploadJobs.forEach(({ status }) => {
      if (
        status === STATUS.RUNNING ||
        status === STATUS.WAITING ||
        status === STATUS.processing
      ) {
        return true;
      }
      return false;
    });
  },
  [GetterTypes.runningJobs]: (state) =>
    state.uploadJobs.filter((job) => job.status === STATUS.RUNNING),
  [GetterTypes.waitingJobs]: (state) =>
    state.uploadJobs.filter((job) => job.status === STATUS.WAITING),
  [GetterTypes.processingJobs]: (state) =>
    state.uploadJobs.filter((job) => job.status === STATUS.PROCESSING),
  [GetterTypes.activeJobs]: (state) =>
    state.uploadJobs.filter(
      (job) =>
        job.status === STATUS.processing ||
        job.status === STATUS.WAITING ||
        job.status === STATUS.RUNNING
    ),
  [GetterTypes.uploadPipelineActive]: (state) => state.uploadPipelineActive,
};
