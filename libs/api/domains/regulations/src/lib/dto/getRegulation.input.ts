import { ISODate, RegName } from '@island.is/clients/regulations'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetRegulationInput {
  @Field()
  @IsString()
  viewType!: 'current' | 'diff' | 'original' | 'd'

  @Field()
  @IsString()
  name!: string // RegName

  @Field({ nullable: true })
  @IsOptional()
  date?: string // ISODate

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isCustomDiff?: boolean

  @Field({ nullable: true })
  @IsOptional()
  earlierDate?: string // ISODate | 'original'
}
