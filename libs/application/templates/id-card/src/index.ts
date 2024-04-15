import IdCardTemplate from './lib/IdCardTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')
// export const getFields = () => import('./forms')

export default IdCardTemplate
export type PassportSchema = z.TypeOf<typeof dataSchema>
