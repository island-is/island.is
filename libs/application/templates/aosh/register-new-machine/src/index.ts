import RegisterNewMachineTemplate from './lib/RegisterNewMachineTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export { NewMachineAnswers } from './lib/dataSchema'

export * from './utils'
export * from './shared/types'

export default RegisterNewMachineTemplate
