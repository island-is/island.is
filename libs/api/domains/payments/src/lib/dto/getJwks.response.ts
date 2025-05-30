import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('PaymentsJwk')
class JwkType {
  @Field(() => String)
  kty!: string

  @Field(() => String)
  n!: string

  @Field(() => String)
  e!: string

  @Field(() => String)
  kid!: string

  @Field(() => String)
  use!: string

  @Field(() => String)
  alg!: string
}

@ObjectType('PaymentsGetJwks')
export class GetJwksResponse {
  @Field(() => [JwkType])
  keys!: JwkType[]
}
