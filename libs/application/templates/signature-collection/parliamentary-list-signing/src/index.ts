import createCollectionTemplate from './lib/signListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export * from './lib/errors'

export default createCollectionTemplate
export type CreateListSchema = z.TypeOf<typeof dataSchema>
