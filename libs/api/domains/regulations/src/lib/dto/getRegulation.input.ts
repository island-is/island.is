import {
  ISODate,
  RegQueryName,
  RegulationViewTypes,
} from '@island.is/clients/regulations'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsOptional,
  Length,
  Matches,
} from 'class-validator'

const reRegQueryName = /^\d{4}-\d{4}$/

registerEnumType(RegulationViewTypes, {
  name: 'RegulationViewTypes',
})

@InputType()
export class GetRegulationInput {
  @Field(() => RegulationViewTypes)
  @IsEnum(RegulationViewTypes)
  viewType!: RegulationViewTypes

  @Field(() => String)
  @Matches(reRegQueryName)
  name!: RegQueryName

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(10, 10) // Disallow shorter or longer ISODate variants.
  @IsISO8601({ strict: true })
  date?: ISODate

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCustomDiff?: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(10, 10) // Disallow shorter or longer ISODate variants.
  @IsISO8601({ strict: true })
  earlierDate?: ISODate | 'original'
}
