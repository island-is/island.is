import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesMedia')
export class Media {
  @Field(() => String, { nullable: true })
  mediaPath?: string

  @Field(() => String, { nullable: true })
  mediaType?: string
}
