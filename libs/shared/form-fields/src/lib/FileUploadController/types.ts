export type S3UploadResponse = {
  url: string
}

export enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

export interface Action {
  type: ActionTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}
