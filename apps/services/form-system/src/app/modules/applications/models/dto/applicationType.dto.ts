import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";
import {IsString} from "class-validator";

export class ApplicationTypeDto {
  @ApiProperty()
  @Expose()
  @IsString()
  id!: string

  @ApiProperty()
  @Expose()
  @IsString()
  name?: string
}
