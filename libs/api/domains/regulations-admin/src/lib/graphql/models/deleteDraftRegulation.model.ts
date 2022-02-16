import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteDraftRegulationModel {
  @Field(() => String)
  id!: string
}
