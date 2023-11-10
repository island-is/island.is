import SignListTemplate from './lib/SignListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export default SignListTemplate
export type SignatureListSchema = z.TypeOf<typeof dataSchema>
