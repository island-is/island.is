import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class Person {
  @Field()
  name!: string

  @Field()
  ssn!: string

  @Field()
  phoneNumber?: string

  @Field()
  email?: string

  @Field()
  homeAddress!: string

  @Field()
  postalCode!: string

  @Field()
  city!: string

  @Field()
  signed!: boolean

  @Field()
  type!: number
}

@InputType()
export class Attachment {
  @Field()
  name!: string

  @Field()
  content!: string
}

@InputType()
export class ExtraData {
  @Field()
  name!: string

  @Field()
  content!: string
}
@InputType()
export class UploadDataInput {
  @Field(() => [Person])
  persons!: Person[]

  @Field(() => Attachment)
  attachment!: Attachment

  @Field()
  uploadDataName!: string

  @Field()
  uploadDataId?: string

  @Field(() => ExtraData)
  extraData?: ExtraData
}

export enum PersonType {
  Plaintiff,
  CounterParty,
  Child,
  CriminalRecordApplicant,
}
