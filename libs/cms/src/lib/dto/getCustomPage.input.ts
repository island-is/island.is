import { IsString } from 'class-validator'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CacheField } from '@island.is/nest/graphql'

enum UniqueIdentifier {
  PensionCalculator = 'PensionCalculator',
}

registerEnumType(UniqueIdentifier, {
  name: 'CustomPageUniqueIdentifier',
})

@InputType()
export class GetCustomPageInput {
  @CacheField(() => UniqueIdentifier)
  uniqueIdentifier!: UniqueIdentifier

  @Field(() => String)
  @IsString()
  lang: ElasticsearchIndexLocale = 'is'
}
