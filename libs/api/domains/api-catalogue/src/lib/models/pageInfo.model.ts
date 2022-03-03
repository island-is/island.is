import { Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ObjectType()
export class PageInfo {
  @Field((type) => String, { nullable: true })
  @IsString()
  nextCursor!: string | null
}
