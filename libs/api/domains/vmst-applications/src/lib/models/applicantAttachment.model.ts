import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicationsApplicantAttachment')
export class VmstApplicationsApplicantAttachment {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  typeId?: string | null

  @Field()
  name!: string

  @Field()
  contentType!: string

  @Field()
  created!: string

  @Field(() => String, { nullable: true })
  downloadServiceUrl?: string | null
}
