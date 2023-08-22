import { Individual, RelationshipItem } from '../../gen/fetch'

export type GetIndividualRelationships = Omit<Individual, 'relationships'> & {
  relationships: Pick<RelationshipItem, 'name' | 'nationalId' | 'type'>[]
}
