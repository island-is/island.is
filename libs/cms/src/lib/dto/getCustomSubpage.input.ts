import { IsString } from 'class-validator'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CustomPageUniqueIdentifier } from '@island.is/shared/types'

registerEnumType(CustomPageUniqueIdentifier, {
  name: 'CustomPageUniqueIdentifier',
})

@InputType()
export class GetCustomSubpageInput {
  @Field(() => String)
  parentPageId!: string

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => String)
  slug!: string
}
