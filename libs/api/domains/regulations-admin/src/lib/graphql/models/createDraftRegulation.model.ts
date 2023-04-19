import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreateDraftRegulationModel {
  @Field(() => String)
  id!: string
}
