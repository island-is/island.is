import { IsString } from 'class-validator'

export class FindSignatureListByTagDto {
  @IsString()
  tag!: string
}
