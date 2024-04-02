import { UploadFile, UploadFileStatus } from '@island.is/island-ui/core'

enum ActionTypes {
  add = 'add',
  remove = 'remove',
  update = 'update',
}

type FileUploadActions =
  | { type: 'add'; payload: { newFiles: UploadFile[] } }
  | { type: 'remove'; payload: { fileToRemove: UploadFile } }
  | {
      type: 'update'
      payload: { file: UploadFile; status: UploadFileStatus; percent: number }
    }

export default function fileUploadReducer(
  state: UploadFile[],
  action: FileUploadActions,
) {
  switch (action.type) {
    case ActionTypes.add:
      return state.concat(action.payload.newFiles)

    case ActionTypes.remove:
      return state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )

    case ActionTypes.update:
      return [
        ...state.map((file: UploadFile) => {
          if (file.name === action.payload.file.name) {
            file.status = action.payload.status
            file.percent = action.payload.percent
          }
          return file
        }),
      ]
    default:
      throw new Error()
  }
}
