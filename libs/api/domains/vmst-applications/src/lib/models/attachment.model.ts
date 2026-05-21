import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicationsAttachment')
export class VmstApplicationsAttachment {
  @Field()
  id!: string

  @Field()
  name!: string

  @Field()
  contentType!: string

  @Field(() => String, { nullable: true })
  data?: string | null

  @Field(() => Int, { nullable: true })
  size?: number | null
}
