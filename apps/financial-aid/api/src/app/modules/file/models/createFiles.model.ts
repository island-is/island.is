import { Field, ObjectType } from '@nestjs/graphql'

import { CreateFilesResponse } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class CreateFilesModel implements CreateFilesResponse {
  @Field()
  readonly success!: boolean
}
