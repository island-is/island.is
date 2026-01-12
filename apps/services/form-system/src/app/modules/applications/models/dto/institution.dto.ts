import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";
import {IsArray, IsString} from "class-validator";

export class InstitutionDto {
  @ApiProperty()
  @Expose()
  @IsString()
  nationalId!: string

  @ApiProperty()
  @Expose()
  @IsString()
  slug!: string

  @ApiProperty()
  @Expose()
  @IsString()
  contentfulId!: string

  @ApiProperty()
  @Expose()
  @IsArray()
  @IsString({ each: true })
  applicationTypes!: string[]
}
