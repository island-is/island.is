import { Tag } from './tag'

export type ProgramTag = {
  id: string
  programId: string
  tagId: string
  details: Tag
  created: Date
  modified: Date
}
