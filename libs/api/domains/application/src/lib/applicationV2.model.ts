import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ApplicationResponseDtoStatusEnum } from '../../gen/fetch/models/ApplicationResponseDto'
import { ActionCardMetaData } from './application.model'

@ObjectType()
export class ApplicationCard {
  @Field(() => ID)
  id!: string

  @Field(() => Date)
  created!: Date

  @Field(() => Date)
  modified!: Date

  @Field(() => String)
  typeId!: string

  @Field(() => ApplicationResponseDtoStatusEnum)
  status!: ApplicationResponseDtoStatusEnum

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => Number, { nullable: true })
  progress?: number

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => String, { nullable: true })
  org?: string

  @Field(() => String, { nullable: true })
  applicationPath?: string

  @Field(() => String, { nullable: true })
  orgContentfulId?: string

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => ActionCardMetaData, { nullable: true })
  actionCard?: ActionCardMetaData
}
