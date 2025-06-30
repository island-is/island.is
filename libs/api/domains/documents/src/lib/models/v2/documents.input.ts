import {
  Field,
  GraphQLISODateTime,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator'

export enum DocumentPageSort {
  Date = 'Date', // Date is document date
  Publication = 'Publication', // Publication is document publication date (default)
  Category = 'Category',
  Type = 'Type',
  Sender = 'Sender',
  Subject = 'Subject',
}

export enum DocumentPageOrder {
  Ascending = 'Ascending',
  Descending = 'Descending',
}

registerEnumType(DocumentPageSort, { name: 'DocumentsV2PageSort' })
registerEnumType(DocumentPageOrder, { name: 'DocumentsV2PageOrder' })

@InputType('DocumentsV2DocumentsInput')
export class DocumentsInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  readonly senderNationalId?: Array<string>

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  readonly dateFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  readonly dateTo?: Date

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  readonly categoryIds?: Array<string>

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly typeId?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly subjectContains?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly bookmarked?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly archived?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly opened?: boolean

  @Field(() => DocumentPageSort, {
    nullable: true,
    defaultValue: 'Publication',
  })
  @IsOptional()
  @IsEnum(DocumentPageSort)
  readonly sortBy?: DocumentPageSort

  @Field(() => DocumentPageOrder, {
    nullable: true,
    defaultValue: 'Descending',
  })
  @IsOptional()
  @IsEnum(DocumentPageOrder)
  readonly order?: DocumentPageOrder

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  readonly page?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  readonly pageSize?: number
}
