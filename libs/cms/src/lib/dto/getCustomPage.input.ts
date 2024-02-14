import { IsString } from 'class-validator'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CacheField } from '@island.is/nest/graphql'

export enum CustomPageUniqueIdentifier {
  PensionCalculator = 'PensionCalculator',
}

registerEnumType(CustomPageUniqueIdentifier, {
  name: 'CustomPageUniqueIdentifier',
})

@InputType()
export class GetCustomPageInput {
  @CacheField(() => CustomPageUniqueIdentifier)
  uniqueIdentifier!: CustomPageUniqueIdentifier

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}
