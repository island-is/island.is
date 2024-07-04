import createListTemplate from './lib/createListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export * from './lib/errors'

export default createListTemplate
export type CreateListSchema = z.TypeOf<typeof dataSchema>
