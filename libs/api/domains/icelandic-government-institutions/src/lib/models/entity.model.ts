import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('IcelandicGovernmentInstitutionsEntity')
export class Entity {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string

  @Field({ nullable: true })
  legalId?: string
}
