import { isSpouseResponse } from '@island.is/financial-aid/shared/lib'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class isSpouseRes implements isSpouseResponse {
  @Field()
  readonly res!: boolean
}
