import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicantRequestedAttachment')
export class VmstApplicantRequestedAttachment {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  dataRequestId?: string

  @Field(() => String, { nullable: true })
  attachmentId?: string | null

  @Field(() => String, { nullable: true })
  attachmentTypeId?: string
}
