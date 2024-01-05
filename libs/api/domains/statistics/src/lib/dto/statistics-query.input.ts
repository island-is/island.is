import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional } from 'class-validator'

@InputType('StatisticsQueryInput')
export class StatisticsQueryInput {
  @IsArray()
  @Field(() => [String])
  sourceDataKeys!: string[]

  @Field({ nullable: true })
  dateFrom?: Date

  @Field({ nullable: true })
  dateTo?: Date

  @Field({ nullable: true })
  numberOfDataPoints?: number

  @Field({ nullable: true })
  interval?: number
}
