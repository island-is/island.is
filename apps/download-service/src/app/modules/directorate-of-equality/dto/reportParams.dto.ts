import { IsNotEmpty, IsString } from 'class-validator'

export class ReportParamsDto {
  @IsString()
  @IsNotEmpty()
  id!: string
}
