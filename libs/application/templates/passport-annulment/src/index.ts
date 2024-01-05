import PassportAnnulmentTemplate from './lib/PassportAnnulmentTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export default PassportAnnulmentTemplate
export type PassportAnnulmentSchema = z.TypeOf<typeof dataSchema>
