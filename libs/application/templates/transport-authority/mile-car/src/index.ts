import { MileCar } from './lib/dataSchema'
import mileCarTemplate from './lib/mileCarTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type MileCarAnswers = MileCar

export default mileCarTemplate
