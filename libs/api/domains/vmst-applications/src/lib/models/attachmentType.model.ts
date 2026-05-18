import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicationsAttachmentType')
export class VmstApplicationsAttachmentType {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  english?: string | null
}

@ObjectType('VmstApplicationsAttachmentTypeList')
export class VmstApplicationsAttachmentTypeList {
  @Field({ nullable: true })
  success?: boolean

  @Field(() => String, { nullable: true })
  errorMessage?: string | null

  @Field(() => [VmstApplicationsAttachmentType], { nullable: true })
  attachmentTypes?: VmstApplicationsAttachmentType[] | null
}
