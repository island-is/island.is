import { Spouse } from '@island.is/financial-aid/shared/lib'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SpouseModel implements Spouse {
  @Field()
  readonly hasApplied!: boolean

  @Field()
  readonly hasFiles!: boolean
}
