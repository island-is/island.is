import { MileCar } from './lib/dataSchema'
import mileCarTemplate from './lib/mileCarTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export * from './lib/messages'

export type MileCarAnswers = MileCar

export default mileCarTemplate
