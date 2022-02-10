import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DigitalBook {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  licenseCategory?: string

  @Field({ nullable: true })
  createdOn?: string

  @Field({ nullable: true })
  status?: number

  @Field({ nullable: true })
  isExpired?: boolean

  @Field({ nullable: true })
  statusName?: string

  @Field({ nullable: true })
  studentSsn?: string

  @Field({ nullable: true })
  studentName?: string

  @Field({ nullable: true })
  studentZipCode?: number

  @Field({ nullable: true })
  studentAddress?: string

  @Field({ nullable: true })
  studentEmail?: string

  @Field({ nullable: true })
  studentPrimaryPhoneNumber?: string

  @Field({ nullable: true })
  studentSecondaryPhoneNumber?: string

  @Field({ nullable: true })
  teacherSsn?: string

  @Field({ nullable: true })
  teacherName?: string

  @Field({ nullable: true })
  schoolSsn?: string

  @Field({ nullable: true })
  schoolName?: string

  @Field({ nullable: true })
  isDigital?: boolean
}

@ObjectType()
export class DigitalBookResponse {
  @Field({ nullable: true })
  data?: DigitalBook
}
