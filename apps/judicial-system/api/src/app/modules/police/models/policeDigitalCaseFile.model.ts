import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PoliceDigitalCaseFile {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly name!: string

  @Field(() => String)
  readonly policeCaseNumber!: string

  @Field(() => String, { nullable: true })
  readonly displayDate?: string
}
