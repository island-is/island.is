import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { SearchIndexes } from '@island.is/api/content-search'

@InputType()
export class SyncInput {
  @Field(() => SearchIndexes)
  @IsString()
  locale: keyof typeof SearchIndexes

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  token: string
}
