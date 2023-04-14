import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalPostEmailCommand')
export class PostEmailCommand {
  @Field(() => String, { nullable: true })
  email?: string | null
}
