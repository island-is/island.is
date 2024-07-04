import { IsString } from 'class-validator'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CustomPageUniqueIdentifier as CustomPageUniqueIdentifierEnum } from '@island.is/shared/types'
import { CacheField } from '@island.is/nest/graphql'

export const CustomPageUniqueIdentifier = CustomPageUniqueIdentifierEnum

registerEnumType(CustomPageUniqueIdentifierEnum, {
  name: 'CustomPageUniqueIdentifier',
})

@InputType()
export class GetCustomPageInput {
  @CacheField(() => CustomPageUniqueIdentifierEnum)
  uniqueIdentifier!: CustomPageUniqueIdentifierEnum

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}
