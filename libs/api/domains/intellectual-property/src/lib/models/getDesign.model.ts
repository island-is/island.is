import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyDesign')
export class Design {
  @Field({ nullable: true })
  applicationNumber?: Date

  @Field({ nullable: true })
  hid?: string | null

  @Field({ nullable: true })
  status?: string | null

  @Field({ nullable: true })
  specification?: string | null
}
