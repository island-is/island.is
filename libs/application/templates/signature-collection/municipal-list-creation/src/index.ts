import createCollectionTemplate from './lib/createCollectionTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export default createCollectionTemplate
export type CreateListSchema = z.TypeOf<typeof dataSchema>
