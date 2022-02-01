import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DigitalBook {
  @Field({ nullable: true })
  id?: string | null

  @Field({ nullable: true })
  licenseCategory?: string | null

  @Field({ nullable: true })
  createdOn?: string | null

  @Field({ nullable: true })
  status?: number

  @Field({ nullable: true })
  isExpired?: boolean

  @Field({ nullable: true })
  statusName?: string | null

  @Field({ nullable: true })
  studentSsn?: string | null

  @Field({ nullable: true })
  studentName?: string | null

  @Field({ nullable: true })
  studentZipCode?: number | null

  @Field({ nullable: true })
  studentAddress?: string | null

  @Field({ nullable: true })
  studentEmail?: string | null

  @Field({ nullable: true })
  studentPrimaryPhoneNumber?: string | null

  @Field({ nullable: true })
  studentSecondaryPhoneNumber?: string | null

  @Field({ nullable: true })
  teacherSsn?: string | null

  @Field({ nullable: true })
  teacherName?: string | null

  @Field({ nullable: true })
  schoolSsn?: string | null

  @Field({ nullable: true })
  schoolName?: string | null

  @Field({ nullable: true })
  isDigital?: boolean
}

@ObjectType()
export class DigitalBookResponse {
  @Field({ nullable: true })
  data?: DigitalBook
}
