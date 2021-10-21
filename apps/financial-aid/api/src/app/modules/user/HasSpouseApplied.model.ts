import { HasSpouseApplied } from '@island.is/financial-aid/shared/lib'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HasSpouseAppliedModel implements HasSpouseApplied {
  @Field()
  readonly HasApplied!: boolean
}
