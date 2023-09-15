import { Field, InputType } from '@nestjs/graphql'

@InputType('AuthDomainInput')
export class DomainInput {
  @Field(() => String)
  lang = 'is'

  @Field(() => String)
  domain!: string
}
