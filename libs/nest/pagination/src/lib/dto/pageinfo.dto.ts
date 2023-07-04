import { ObjectType, Field } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType()
export class PageInfoDto {
  @Field()
  @ApiProperty({ example: true })
  hasNextPage!: boolean

  @Field({ nullable: true })
  @ApiProperty({ example: false })
  hasPreviousPage?: boolean

  @Field({ nullable: true })
  @ApiProperty({
    example: 'WyIwM2JmMWUwOS1hNWEwLTQyNDMtOTAxOC1mY2FhYjg4NTVkMTYiXQ==',
  })
  startCursor?: string

  @Field({ nullable: true })
  @ApiProperty({
    example: 'WyJmODY1MDAzMS03YTFkLTRhOTAtOWI2OC00ODg1YjlkZDZjZDgiXQ==',
  })
  endCursor?: string
}
