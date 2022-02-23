import { CreateFilesResponse } from '@island.is/financial-aid/shared/lib'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CreateFilesModel implements CreateFilesResponse {
  @Field()
  readonly success!: boolean
}
