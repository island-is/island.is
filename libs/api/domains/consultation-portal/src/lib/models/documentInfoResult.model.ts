import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalDocumentInfoResult')
export class DocumentInfoResult {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String, { nullable: true })
  link?: string | null

  @Field(() => String, { nullable: true })
  fileName?: string | null

  @Field(() => String, { nullable: true })
  fileType?: string | null

  @Field(() => Number, { nullable: true })
  size?: number
}
