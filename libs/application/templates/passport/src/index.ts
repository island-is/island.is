import PassportTemplate from './lib/PassportTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export * from './lib/messages'

export default PassportTemplate
export type PassportSchema = z.TypeOf<typeof dataSchema>
