import SignListTemplate from './lib/SignListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export default SignListTemplate
export type SignListSchema = z.TypeOf<typeof dataSchema>
