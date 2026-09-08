import { Field, ObjectType, Int } from '@nestjs/graphql'
import { GraphQLISODateTime } from '@nestjs/graphql'
import { DrivingLicenseDeprivationStatus } from './enums'

@ObjectType()
export class DrivingLicenseDeprivation {
  @Field(() => GraphQLISODateTime)
  dateFrom!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTo?: Date

  @Field(() => DrivingLicenseDeprivationStatus, { nullable: true })
  status?: DrivingLicenseDeprivationStatus

  @Field({ nullable: true })
  name?: string

  @Field(() => Int, { nullable: true })
  type?: number

  @Field({
    nullable: true,
    description:
      'Whether the license holder will need to retake/reapply for their license once this deprivation period ends',
  })
  retakeRequired?: boolean

  @Field({
    description:
      'Whether this deprivation is currently in effect, based on dateFrom/dateTo',
  })
  active!: boolean
}
