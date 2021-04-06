import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetRegulationInput {
  @Field()
  @IsString()
  viewType!: 'original' | 'current' | 'd'
  @Field()
  @IsString()
  name!: string
  @Field({ nullable: true })
  @IsOptional()
  date?: string
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isCustomDiff?: boolean
}
