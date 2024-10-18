import createCollectionTemplate from './lib/createCollectionTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export const getFields = () => import('./fields')
export * from './lib/errors'

export default createCollectionTemplate
export type CreateListSchema = z.TypeOf<typeof dataSchema>
