import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { SectionDisplayOrderDto } from './sectionDisplayOrder.dto'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

@InputType('FormSystemUpdateSectionsDisplayOrder')
export class UpdateSectionsDisplayOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SectionDisplayOrderDto)
  @IsArray()
  @ApiProperty({ type: [SectionDisplayOrderDto] })
  @Field(() => [SectionDisplayOrderDto])
  sectionsDisplayOrderDto!: SectionDisplayOrderDto[]
}

@InputType('FormSystemUpdateSectionsDisplayOrderInput')
export class UpdateSectionsDisplayOrderInput {
  @Field(() => UpdateSectionsDisplayOrderDto)
  updateSectionsDisplayOrderDto!: UpdateSectionsDisplayOrderDto
}
