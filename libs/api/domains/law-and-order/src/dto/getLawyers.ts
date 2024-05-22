import { Field, InputType } from '@nestjs/graphql'

@InputType('LawAndOrderLawyersInput')
export class GetLawyersInput {
  @Field()
  locale!: 'is' | 'en'
}
