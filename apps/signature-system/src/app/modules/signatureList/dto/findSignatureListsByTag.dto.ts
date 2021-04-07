import { IsEnum } from 'class-validator'
import { SignatureTag } from '../signatureList.model'

export class FindSignatureListByTagDto {
  @IsEnum(SignatureTag)
  tag!: SignatureTag
}
