import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicationsApplicantRequestedAttachment')
export class VmstApplicationsApplicantRequestedAttachment {
  @Field()
  id!: string

  @Field({ nullable: true })
  dataRequestId?: string

  @Field(() => String, { nullable: true })
  attachmentId?: string | null

  @Field()
  attachmentTypeId!: string
}
