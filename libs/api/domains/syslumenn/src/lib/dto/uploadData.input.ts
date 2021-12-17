import { IsNumber, IsOptional } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

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
export class UploadDataInput {
  @Field(() => [Person])
  persons!: Person[]

  @Field(() => Attachment)
  attachment!: Attachment

  @Field()
  applicationType!: string

  @Field()
  extraData!: { [key: string]: string }
  
  @Field()
  uploadDataName!: string

  @Field()
  uploadDataId?: string
}

export enum PersonType {
  Plaintiff,
  CounterParty,
  Child,
  CriminalRecordApplicant,
}