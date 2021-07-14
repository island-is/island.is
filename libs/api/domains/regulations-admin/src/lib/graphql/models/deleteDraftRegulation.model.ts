import { Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ObjectType()
export class DeleteDraftRegulationModel {
  @Field()
  @IsString()
  id!: string
}
