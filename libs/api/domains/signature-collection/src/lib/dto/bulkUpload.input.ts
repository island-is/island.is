import { IsArray, IsNumber, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class BulkUploadUser {
  @Field()
  @IsNumber()
  pageNumber!: number

  @Field()
  @IsArray()
  nationalId!: string
}

@InputType()
export class SignatureCollectionListBulkUploadInput {
  @Field()
  @IsString()
  listId!: string

  @Field(() => [BulkUploadUser])
  @IsArray()
  upload!: BulkUploadUser[]
}
