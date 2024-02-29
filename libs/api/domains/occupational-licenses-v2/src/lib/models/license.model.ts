import {
  Field,
  registerEnumType,
  GraphQLISODateTime,
  ObjectType,
} from '@nestjs/graphql'
import { GenericField } from './genericField.model'

export enum OccupationalLicenseStatusV2 {
  VALID = 'valid',
  INVALID = 'invalid',
  LIMITED = 'limited',
  IN_PROGRESS = 'in-progress',
  REVOKED = 'revoked',
  WAIVED = 'waived',
  UNKNOWN = 'unknown',
}

registerEnumType(OccupationalLicenseStatusV2, {
  name: 'OccupationalLicenseStatusV2',
})

@ObjectType()
export class License {
  @Field()
  licenseId!: string

  @Field()
  licenseNumber!: string

  @Field({ nullable: true })
  issuer?: string

  @Field({ nullable: true })
  issuerTitle?: string

  @Field()
  profession!: string

  @Field({ nullable: true })
  permit?: string

  @Field({ nullable: true })
  licenseHolderName?: string

  @Field({ nullable: true })
  licenseHolderNationalId?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateOfBirth?: Date

  @Field(() => GraphQLISODateTime)
  validFrom!: Date

  @Field({ nullable: true })
  title?: string

  @Field(() => OccupationalLicenseStatusV2)
  status!: OccupationalLicenseStatusV2

  @Field(() => [GenericField], { nullable: true })
  genericFields?: Array<GenericField>
}
