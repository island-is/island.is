/**
 * Task types for the payment worker. Used when recording and querying payment_worker_event.
 * Extend this when adding new worker tasks.
 */
export const WorkerTaskType = {
  CreateFjsCharge: 'create_fjs_charge',
} as const

export type WorkerTaskTypeValue =
  typeof WorkerTaskType[keyof typeof WorkerTaskType]
