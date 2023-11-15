import { Field, ObjectType } from '@nestjs/graphql'
import { Signature } from './signature.model'



@ObjectType()
export class FailedNationalIds {
  @Field()
  nationalId!: string

  @Field()
  reason?: string

}

@ObjectType()
export class Bulk {
  @Field(() => [Signature])
  success!: Signature[]

  @Field(() => [FailedNationalIds])
  failed!: FailedNationalIds[]

}
