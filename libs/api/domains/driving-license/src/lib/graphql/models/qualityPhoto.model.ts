import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType('DrivingLicenseQualityPhoto')
export class QualityPhoto {
  @Field()
  hasQualityPhoto!: boolean

  @Field({ nullable: true })
  dataUri?: string
}
