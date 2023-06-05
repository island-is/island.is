import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Person } from './nationalRegistryPerson.model'

@ObjectType('NationalRegistryV3DomicilePopulace')
export class DomicilePopulace {
  @Field(() => ID)
  legalDomicileId!: string

  @Field(() => [Person], {
    nullable: true,
  })
  populace?: Array<Person>
}
