import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class QualityPhotoAndSignature {
  @Field(() => Boolean)
  hasPhoto!: boolean

  @Field(() => String, { nullable: true })
  photoDataUri?: string | null

  @Field(() => Boolean)
  hasSignature!: boolean

  @Field(() => String, { nullable: true })
  signatureDataUri?: string | null
}
