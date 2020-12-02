import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'

@InputType()
export class MetricInput {
  @Field({ nullable: true })
  @IsEnum(['raw', 'minimal'])
  @IsOptional()
  display: 'raw' | 'minimal' = 'minimal'

  @Field(() => String)
  @IsString()
  index!: string
}
