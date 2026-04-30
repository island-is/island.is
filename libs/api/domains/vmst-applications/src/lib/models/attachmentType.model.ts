import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstAttachmentType')
export class VmstAttachmentType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  english?: string | null
}

@ObjectType('VmstAttachmentTypeList')
export class VmstAttachmentTypeList {
  @Field(() => Boolean, { nullable: true })
  success?: boolean

  @Field(() => String, { nullable: true })
  errorMessage?: string | null

  @Field(() => [VmstAttachmentType], { nullable: true })
  attachmentTypes?: VmstAttachmentType[] | null
}
