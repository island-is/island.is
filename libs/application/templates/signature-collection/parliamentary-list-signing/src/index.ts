import signCollectionTemplate from './lib/signListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export * from './lib/errors'

export default signCollectionTemplate
export type SignListSchema = z.TypeOf<typeof dataSchema>
