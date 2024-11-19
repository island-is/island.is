export enum ProcessingState {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ProcessingStatus {
  dbProcessing: ProcessingState
  pushProcessing: ProcessingState
  emailProcessing: ProcessingState
  delegationsProcessing: ProcessingState
}
