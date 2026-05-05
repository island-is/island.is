import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicantRequestedAttachment')
export class VmstApplicantRequestedAttachment {
  @Field()
  id!: string

  @Field({ nullable: true })
  dataRequestId?: string

  @Field(() => String, { nullable: true })
  attachmentId?: string | null

  @Field()
  attachmentTypeId!: string
}
