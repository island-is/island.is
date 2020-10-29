import { IsString } from 'class-validator'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PageInfo {
  @Field((type) => String, { nullable: true })
  @IsString()
  nextCursor: string
}
