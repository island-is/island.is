import { IsString, Length } from 'class-validator'

export class ResourceDto {
  @IsString()
  @Length(10)
  readonly nationalId!: string
}
