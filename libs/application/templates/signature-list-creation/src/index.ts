import SignatureListTemplate from './lib/SignatureListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export const getFields = () => import('./fields/')

export default SignatureListTemplate
export type SignatureListSchema = z.TypeOf<typeof dataSchema>
