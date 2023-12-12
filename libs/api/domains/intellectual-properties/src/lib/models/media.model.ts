import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesMedia')
export class Media {
  @Field(() => String, { nullable: true })
  mediaPath?: string | null

  @Field(() => String, { nullable: true })
  mediaType?: string | null
}
