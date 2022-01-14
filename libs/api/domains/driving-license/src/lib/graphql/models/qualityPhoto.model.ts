import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class QualityPhoto {
  @Field()
  hasQualityPhoto!: boolean

  @Field({ nullable: true })
  qualityPhotoDataUri?: string

  @Field({ nullable: true })
  errorMessage!: string
}
