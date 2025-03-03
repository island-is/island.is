import { States } from '../enums'

export const checkIsEditable = (state: string) => {
  return state === States.DRAFT || state === States.EDIT
}
