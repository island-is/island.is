import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderLawyerChoices')
export class Choice {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  label?: string
}

@ObjectType('LawAndOrderLawyer')
export class Lawyer {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  nationalId?: string
}

@ObjectType('LawAndOrderLawyers')
export class Lawyers {
  @Field(() => [Lawyer], { nullable: true })
  lawyers?: Array<Lawyer>

  @Field(() => [Choice], { nullable: true })
  choices?: Array<Choice>
}
