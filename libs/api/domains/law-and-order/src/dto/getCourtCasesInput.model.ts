import { Field, InputType } from '@nestjs/graphql'

@InputType('LawAndOrderCourtCasesInput')
export class GetCourtCasesInput {
  @Field()
  locale!: 'is' | 'en'
}
