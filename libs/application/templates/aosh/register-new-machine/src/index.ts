import RegisterNewMachineTemplate from './lib/RegisterNewMachineTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export type { NewMachineAnswers } from './lib/dataSchema'

export * from './utils'
export * from './shared/types'

export default RegisterNewMachineTemplate
