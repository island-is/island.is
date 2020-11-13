import { IsString } from 'class-validator'
import { Field, ObjectType } from '@nestjs/graphql'
import { XroadIdentifier } from '@island.is/api-catalogue/types'

@ObjectType()
export class XroadInfo implements XroadIdentifier {
  @Field((type) => String)
  @IsString()
  instance!: string

  @Field((type) => String)
  @IsString()
  memberClass!: string

  @Field((type) => String)
  @IsString()
  memberCode!: string

  @Field((type) => String)
  @IsString()
  subsystemCode!: string

  @Field((type) => String)
  @IsString()
  serviceCode!: string
}
