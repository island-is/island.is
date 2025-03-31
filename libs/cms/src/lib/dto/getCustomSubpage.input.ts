import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CustomPageUniqueIdentifier as CustomPageUniqueIdentifierEnum } from '@island.is/shared/types'
import { CacheField } from '@island.is/nest/graphql'

@InputType()
export class GetCustomSubpageInput {
  @Field(() => String)
  parentPageId!: string

  @CacheField(() => CustomPageUniqueIdentifierEnum, { nullable: true })
  parentPageUniqueIdentifier?: CustomPageUniqueIdentifierEnum

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'

  @Field(() => String)
  slug!: string
}
