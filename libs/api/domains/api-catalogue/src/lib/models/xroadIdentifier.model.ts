import { IsString } from 'class-validator'
import { Field, ObjectType } from '@nestjs/graphql'
import { XroadIdentifier as IXroadIdentifier } from '@island.is/api-catalogue/types'

@ObjectType()
export class XroadIdentifier implements IXroadIdentifier {
  @Field(() => String)
  @IsString()
  instance!: string

  @Field(() => String)
  @IsString()
  memberClass!: string

  @Field(() => String)
  @IsString()
  memberCode!: string

  @Field(() => String)
  @IsString()
  subsystemCode!: string

  @Field(() => String)
  @IsString()
  serviceCode?: string
}
