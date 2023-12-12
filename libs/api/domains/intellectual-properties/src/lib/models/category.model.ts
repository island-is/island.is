import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesCategory')
export class Category {
  @Field(() => String, { nullable: true })
  categoryNumber?: string | null

  @Field(() => String, { nullable: true })
  categoryDescription?: string | null
}
