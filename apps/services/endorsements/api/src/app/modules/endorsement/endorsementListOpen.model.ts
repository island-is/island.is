import { EndorsementTag } from '../endorsementList/endorsementList.model'

// this exists to provide a pruned version of the endorsement list

export class EndorsementListOpen {
  id!: string
  title!: string
  description!: string | null
  tags?: EndorsementTag[]
}
