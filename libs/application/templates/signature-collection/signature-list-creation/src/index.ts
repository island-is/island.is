import CreateListTemplate from './lib/CreateListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export const getFields = () => import('./fields')

export default CreateListTemplate
export type SignatureListSchema = z.TypeOf<typeof dataSchema>
