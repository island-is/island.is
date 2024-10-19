import { nxProjectSchema } from '../generated/nx-project-schema'
import { z } from 'zod'

export interface ProjectInfo {
  serviceName: string
  projectPath: string
}

export type NxProjectSchema = z.infer<typeof nxProjectSchema>
export { nxProjectSchema }
