import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateCourseDto {
  @IsUUID()
  @ApiProperty({
    description: 'Column description for university id',
    example: 'Example value for university id',
  })
  universityId!: string

  @IsUUID()
  @ApiProperty({
    description: 'Column description for major id',
    example: 'Example value for major id',
  })
  majorId!: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Column description for extra data',
    example: 'Example value for extra data',
  })
  @ApiPropertyOptional()
  extraData?: string
}
