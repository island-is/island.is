import { Legalentity, RelationshipItem } from '../../gen/fetch'

export type GetLegalEntityRelationshipsResult = Pick<
  Legalentity,
  'name' | 'nationalId'
> & {
  relationships: Pick<RelationshipItem, 'name' | 'nationalId' | 'type'>[]
}
