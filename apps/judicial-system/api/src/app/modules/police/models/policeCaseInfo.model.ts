import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PoliceCaseInfo {
  @Field(() => ID)
  readonly caseNumber!: string
  @Field(() => String, { nullable: true })
  readonly crimeScene?: string
  @Field(() => Date, { nullable: true })
  readonly crimeDate?: Date
}
