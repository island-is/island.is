import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseIcelandicAlphabetPipe
  implements PipeTransform<string, string>
{
  transform(s: string): string {
    const letters =
      'aábcdðeéfghiíjklmnoópqrstuúvwxyýzþæöAÁBCDÐEÉFGHIÍJKLMNOÓPQRSTUÚVWXYÝZÞÆÖ'

    const icelandicAlphabet = new RegExp(`[${letters}]`, 'gi')

    const val = Object.values(s.match(icelandicAlphabet) ?? {}).join('')

    if (!val) {
      throw new BadRequestException(
        'Validation failed: String did not contain any valid letters.',
      )
    }

    return val
  }
}
