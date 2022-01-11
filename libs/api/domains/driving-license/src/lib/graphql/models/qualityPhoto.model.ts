import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class QualityPhoto {
  @Field(() => ID)
  nationalId!: string

  @Field()
  success!: boolean

  @Field()
  hasQualityPhoto!: boolean

  @Field({ nullable: true })
  qualityPhotoDataUri?: string
}
