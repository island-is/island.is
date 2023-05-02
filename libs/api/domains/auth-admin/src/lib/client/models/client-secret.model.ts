import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminClientSecret')
export class ClientSecret {
  @Field(() => ID)
  secretId!: string

  @Field(() => String)
  clientId!: string

  @Field(() => String, { nullable: true })
  decryptedValue?: string
}
