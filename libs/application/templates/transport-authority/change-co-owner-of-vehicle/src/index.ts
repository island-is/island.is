import template from './lib/ChangeCoOwnerOfVehicleTemplate'
import { ChangeCoOwnerOfVehicle } from './lib/dataSchema'

export const getFields = () => import('./fields/')

export * from './lib/messages'

export type ChangeCoOwnerOfVehicleAnswers = ChangeCoOwnerOfVehicle

export * from './utils'

export default template
