import { Legalentity, RelationshipItem } from '../../gen/fetch'

export type GetLegalEntity = Pick<Legalentity, 'name' | 'nationalId'> & {
  relationships: Pick<RelationshipItem, 'name' | 'nationalId'>[]
}
