import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { generateSendApplicationEmail } from './emailGenerators'
import {
  createSignaturesExcelFile,
  Signature,
} from './utils/createSignaturesExcelFile'

const mockSignatures: Signature[] = [
  {
    signaturee: '0000000000',
  },
  {
    signaturee: '1111111111',
  },
  {
    signaturee: '2222222222',
  },
  {
    signaturee: '3333333333',
  },
]

@Injectable()
export class PartyLetterService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async sendApplication({ application }: TemplateApiModuleActionProps) {
    const signaturesFileBuffer = await createSignaturesExcelFile({
      signatures: mockSignatures,
    })
    await this.sharedTemplateAPIService.sendEmail(
      generateSendApplicationEmail(signaturesFileBuffer),
      application,
    )
  }
}
