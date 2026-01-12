import {
  UploadFileDeprecated,
  UploadFileStatusDeprecated,
} from '@island.is/island-ui/core'

enum ActionTypes {
  add = 'add',
  remove = 'remove',
  update = 'update',
}

type FileUploadActions =
  | { type: 'add'; payload: { newFiles: UploadFileDeprecated[] } }
  | { type: 'remove'; payload: { fileToRemove: UploadFileDeprecated } }
  | {
      type: 'update'
      payload: {
        file: UploadFileDeprecated
        status: UploadFileStatusDeprecated
        percent: number
      }
    }

export const fileUploadReducer = (
  state: UploadFileDeprecated[],
  action: FileUploadActions,
) => {
  switch (action.type) {
    case ActionTypes.add:
      return state.concat(action.payload.newFiles)

    case ActionTypes.remove:
      return state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )

    case ActionTypes.update:
      return [
        ...state.map((file: UploadFileDeprecated) => {
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
