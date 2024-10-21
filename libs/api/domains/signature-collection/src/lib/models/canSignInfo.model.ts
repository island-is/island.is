import { ReasonKey } from '@island.is/clients/signature-collection'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(ReasonKey, { name: 'ReasonKey' })
@ObjectType()
export class CanSignInfo {
  @Field(() => [ReasonKey])
  reasons?: ReasonKey[]

  @Field(() => Boolean)
  success!: boolean
}
