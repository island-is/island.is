import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyDesign')
export class Design {
  @Field(() => Date, { nullable: true })
  applicationNumber?: Date

  @Field(() => String, { nullable: true })
  hid?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  specification?: string | null
}
