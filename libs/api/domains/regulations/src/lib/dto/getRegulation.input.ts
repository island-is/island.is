import { ISODate, RegName, RegQueryName } from '@island.is/clients/regulations'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetRegulationInput {
  @Field()
  @IsString()
  viewType!: 'current' | 'diff' | 'original' | 'd'

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
