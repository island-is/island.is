import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { EndorsementListDtoTagsEnum } from '../../../gen/fetch'
import { MetadataInput } from './metadata.input'

registerEnumType(EndorsementListDtoTagsEnum, {
  name: 'EndorsementListDtoTagsEnum',
})

@InputType()
export class CreateEndorsementListDto {
  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [MetadataInput])
  endorsementMetadata!: MetadataInput[]

  @Field(() => [EndorsementListDtoTagsEnum])
  tags!: EndorsementListDtoTagsEnum[]

  @Field(() => graphqlTypeJson, { nullable: true })
  meta!: object | null

  @Field(() => Date)
  closedDate!: Date

  @Field(() => Date)
  openedDate!: Date

  @Field()
  adminLock!: boolean
}
