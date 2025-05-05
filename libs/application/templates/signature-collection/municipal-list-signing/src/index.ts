import SignListTemplate from './lib/SignListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export * from './lib/errors'
export default SignListTemplate
export type SignListSchema = z.TypeOf<typeof dataSchema>
