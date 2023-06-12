import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyTrademark')
export class Trademark {
  @Field({ nullable: true })
  text?: string | null

  @Field({ nullable: true })
  type?: string | null

  @Field({ nullable: true })
  status?: string | null

  @Field({ nullable: true })
  applicationDate?: Date | null

  @Field({ nullable: true })
  vmId?: string | null
}
