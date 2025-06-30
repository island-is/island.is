import PassportTemplate from './lib/PassportTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default PassportTemplate
export type PassportSchema = z.TypeOf<typeof dataSchema>

export { PassportChargeCodes } from './lib/constants'
export {
  getChargeCode,
  ageCanHaveDiscount,
  isChild,
  isDisabled,
  isElder,
} from './lib/utils'
