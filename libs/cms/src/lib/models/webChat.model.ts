import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { IWebChat } from '../generated/contentfulTypes'

@ObjectType()
export class WebChat {
  @Field(() => ID)
  id!: string

  @CacheField(() => GraphQLJSON)
  webChatConfiguration!: unknown
}

export const mapWebChat = (webChat: IWebChat, locale: string): WebChat => {
  return {
    id: webChat.sys.id,
    webChatConfiguration: {
      type: webChat.fields.webChatConfiguration?.type,
      ...webChat.fields.webChatConfiguration?.[
        locale === 'is' ? 'is-IS' : locale
      ],
    },
  }
}
