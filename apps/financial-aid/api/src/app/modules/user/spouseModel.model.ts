import { HasSpouseApplied } from '@island.is/financial-aid/shared/lib'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SpouseModel implements HasSpouseApplied {
  @Field()
  readonly hasApplied!: boolean

  @Field()
  readonly hasFiles!: boolean
}
