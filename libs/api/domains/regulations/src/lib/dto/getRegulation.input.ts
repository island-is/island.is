import {
  ISODate,
  RegQueryName,
  RegulationViewTypes,
} from '@island.is/clients/regulations'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'

registerEnumType(RegulationViewTypes, {
  name: 'RegulationViewTypes',
})
@InputType()
export class GetRegulationInput {
  @Field(() => RegulationViewTypes)
  @IsEnum(RegulationViewTypes)
  viewType!: RegulationViewTypes

  @Field(() => String)
  @IsString()
  name!: RegQueryName

  @Field(() => String, { nullable: true })
  @IsOptional()
  date?: ISODate

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isCustomDiff?: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  earlierDate?: ISODate | 'original'
}
