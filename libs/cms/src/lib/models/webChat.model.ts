import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { IWebChat } from '../generated/contentfulTypes'

@ObjectType()
export class WebChat {
  @Field(() => ID)
  id!: string

  @CacheField(() => GraphQLJSON)
  configuration!: unknown
}

export const mapWebChat = (webChat: IWebChat): WebChat => {
  return {
    id: webChat.sys.id,
    configuration: webChat.fields.webChatConfiguration ?? {},
  }
}
