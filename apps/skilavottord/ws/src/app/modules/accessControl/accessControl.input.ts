import { Field, InputType } from '@nestjs/graphql'

import { Role } from '../auth'

@InputType()
export class CreateAccessControlInput {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => Role)
  role!: Role

  // TODO: get from samgongustofa
  @Field({ nullable: true })
  partnerId?: string
}

@InputType()
export class UpdateAccessControlInput {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field(() => Role)
  role!: Role

  // TODO: get from samgongustofa
  @Field({ nullable: true })
  partnerId?: string
}

@InputType()
export class DeleteAccessControlInput {
  @Field()
  nationalId!: string
}
