import { IsArray, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'



export class ViewTemplateDto {
  

  @IsString()
  @ApiProperty(({example:"HNIPP.FJARSYSLAN.NEW_STATUS_MESSAGE"}))
  templateId!: string

  // @IsString()
  // @ApiProperty(({example:"is-IS"}))
  // locale!: string

  @IsArray()
  @ApiProperty({example:["arg1","arg2"]})
  @IsOptional()
  args?: [string]

}