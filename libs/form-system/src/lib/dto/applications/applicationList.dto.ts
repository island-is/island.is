import { ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationDto } from './application.dto'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemApplicationList')
export class ApplicationListDto {
  @ApiPropertyOptional({ type: [ApplicationDto] })
  @Field(() => [ApplicationDto], { nullable: true })
  applications?: ApplicationDto[]

  @ApiPropertyOptional()
  @Field(() => Number, { nullable: true })
  total?: number
}
