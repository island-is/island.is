import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator'

export const MAX_CATEGORIES_PER_REQUEST = 500

const CATEGORY_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

export class CategoryLabelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Heilbrigðismál' })
  is!: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Health' })
  en?: string
}

export class BlockedCategoryDto {
  @ApiProperty({
    description: 'Key of the blocked category, {senderId}-{category}',
    example: '1234567890-heilbrigdismal',
  })
  key!: string

  @ApiProperty({
    description: 'National id of the notification sender',
    example: '1234567890',
  })
  senderId!: string

  @ApiProperty({
    description: 'Slugified Icelandic category label',
    example: 'heilbrigdismal',
  })
  category!: string

  @ApiProperty({ type: CategoryLabelDto })
  categoryLabel!: CategoryLabelDto
}

export class UnblockCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'National id of the notification sender',
    example: '1234567890',
  })
  senderId!: string

  @IsString()
  @MaxLength(100)
  @Matches(CATEGORY_PATTERN, { message: 'category is not valid' })
  @ApiProperty({
    description: 'Slugified Icelandic category label',
    example: 'heilbrigdismal',
  })
  category!: string
}

export class BlockCategoryDto extends UnblockCategoryDto {
  @ValidateNested()
  @Type(() => CategoryLabelDto)
  @ApiProperty({ type: CategoryLabelDto })
  categoryLabel!: CategoryLabelDto
}

export class BlockCategoriesDto {
  @IsArray()
  @ArrayMaxSize(MAX_CATEGORIES_PER_REQUEST)
  @ValidateNested({ each: true })
  @Type(() => BlockCategoryDto)
  @ApiProperty({ type: [BlockCategoryDto] })
  categories!: BlockCategoryDto[]
}

export class UnblockCategoriesDto {
  @IsArray()
  @ArrayMaxSize(MAX_CATEGORIES_PER_REQUEST)
  @ValidateNested({ each: true })
  @Type(() => UnblockCategoryDto)
  @ApiProperty({ type: [UnblockCategoryDto] })
  categories!: UnblockCategoryDto[]
}
