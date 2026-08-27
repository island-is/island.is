import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DrivingLicenseQualitySignature')
export class QualitySignature {
  @Field()
  hasQualitySignature!: boolean

  @Field({ nullable: true })
  dataUri?: string
}
