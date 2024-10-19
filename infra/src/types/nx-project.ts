import schema from '../generated/nx-project-schema'
import { z } from 'zod'

export type NxProjectSchema = z.infer<typeof schema>
