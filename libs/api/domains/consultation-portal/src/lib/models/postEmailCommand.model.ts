import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalPostEmailCommand')
@InputType('ConsultationPortalPostEmailCommandInput')
export class PostEmailCommand {
  @Field(() => String, { nullable: true })
  email?: string | null
}
