import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IslykillSettings {
  @Field({ description: 'National ID' })
  nationalId!: string

  @Field({ description: 'Email', nullable: true })
  email?: string

  @Field({ description: 'Mobile phonenumber', nullable: true })
  mobile?: string

  @Field({ description: 'Bank info', nullable: true })
  bankInfo?: string

  @Field({ description: 'Datetime of last login', nullable: true })
  lastLogin?: string

  @Field({ description: 'Datetime of next to last login', nullable: true })
  nextLastLogin?: string

  @Field({
    description: 'Datetime of last time Íslykill was changed',
    nullable: true,
  })
  lastPassChange?: string

  @Field({ description: 'Does the user allow "nudges"', nullable: true })
  canNudge?: boolean

  @Field({
    description: 'Can the user only login via certificate, not via Íslykill',
    nullable: true,
  })
  onlyCert?: boolean

  @Field({
    description: 'Datetime of when user was last asked about "nudging"',
    nullable: true,
  })
  nudgeLastAsked?: string

  @Field({
    description: 'No user with requested ssn found in request',
    nullable: true,
  })
  noUserFound?: boolean
}
