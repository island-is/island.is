import { Field, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { EndorsementMetadataSignedTagsEnum } from '../enums/endorsementMetadataSignedTags.enum'

@ObjectType()
export class EndorsementMetadata {
  @Field({ nullable: true })
  fullName!: string | null

  @Field(() => graphqlTypeJson, { nullable: true })
  address!: object | null

  @Field({ nullable: true })
  invalidated!: boolean | null

  @Field({ nullable: true })
  bulkEndorsement!: boolean | null

  @Field(() => [EndorsementMetadataSignedTagsEnum], { nullable: true })
  signedTags!: EndorsementMetadataSignedTagsEnum[] | null
}
