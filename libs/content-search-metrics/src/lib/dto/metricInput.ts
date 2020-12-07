import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'

@InputType()
export class MetricInput {
  @Field({ nullable: true })
  @IsEnum(['raw', 'minimal', 'descriptive'])
  @IsOptional()
  display: 'raw' | 'minimal' | 'descriptive' = 'descriptive'

  @Field(() => String)
  @IsString()
  index!: string
}
