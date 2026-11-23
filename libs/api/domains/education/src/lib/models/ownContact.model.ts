import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationOwnContact')
export class OwnContact {
  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => String, { nullable: true })
  phone?: string | null
}
