import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CasePoliceDigitalCaseFile {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly caseId!: string

  @Field(() => String)
  readonly policeCaseNumber!: string

  @Field(() => String)
  readonly policeDigitalFileId!: string

  @Field(() => String)
  readonly policeExternalVendorId!: string

  @Field(() => String)
  readonly name!: string

  @Field(() => String, { nullable: true })
  readonly displayDate?: string

  @Field(() => Int, { nullable: true })
  readonly orderWithinChapter?: number
}
