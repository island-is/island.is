import { Field, ObjectType, ID } from '@nestjs/graphql'
import { EndorsementListOpenTagsEnum } from '../enums/endorsementListOpenTagsEnum'

@ObjectType()
export class EndorsementListOpen {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description!: string | null

  @Field(() => [EndorsementListOpenTagsEnum], { nullable: true })
  tags?: EndorsementListOpenTagsEnum[]

  @Field()
  closedDate!: string

  @Field()
  openedDate!: string
}
