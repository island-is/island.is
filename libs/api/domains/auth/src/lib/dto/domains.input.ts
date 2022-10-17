import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDomainsInput')
export class DomainsInput {
  @Field(() => String)
  lang = 'is'
}
