import { ApiProperty } from '@nestjs/swagger'

import { InternalCaseResponse } from './internal/internalCase.response'

class Items {
  @ApiProperty({ type: String })
  label!: string

  @ApiProperty({ type: String })
  value?: string

  @ApiProperty({ type: String, enum: ['email', 'tel'] })
  linkType?: 'email' | 'tel'
}

class Groups {
  @ApiProperty({ type: String })
  label!: string

  @ApiProperty({ type: [Items] })
  items!: Items[]
}

class IndictmentCaseData {
  @ApiProperty({ type: String })
  caseNumber!: string

  @ApiProperty({ type: [Groups] })
  groups!: Groups[]
}

export class CaseResponse {
  @ApiProperty({ type: String })
  caseId!: string

  @ApiProperty({ type: IndictmentCaseData })
  data!: IndictmentCaseData

  static fromInternalCaseResponse(
    res: InternalCaseResponse,
    lang?: string,
  ): CaseResponse {
    const language = lang?.toLowerCase()
    const defendant = res.defendants[0]

    return {
      caseId: res.id,
      data: {
        caseNumber:
          language === 'en'
            ? `Case number ${res.courtCaseNumber}`
            : `Málsnúmer ${res.courtCaseNumber}`,
        groups: [
          {
            label: language === 'en' ? 'Defendant' : 'Varnaraðili',
            items: [
              [language === 'en' ? 'Name' : 'Nafn', defendant.name],
              [
                language === 'en' ? 'National ID' : 'Kennitala',
                defendant.nationalId,
              ],
              [
                language === 'en' ? 'Address' : 'Heimilisfang',
                defendant.address,
              ],
            ].map((item) => ({
              label: item[0] ?? '',
              value: item[1] ?? (language === 'en' ? 'N/A' : 'Ekki skráð'),
            })),
          },
          {
            label: language === 'en' ? 'Defender' : 'Verjandi',
            items: [
              [language === 'en' ? 'Name' : 'Nafn', defendant.defenderName],
              [
                language === 'en' ? 'Email' : 'Netfang',
                defendant.defenderEmail,
                'email',
              ],
              [
                language === 'en' ? 'Phone Nr.' : 'Símanúmer',
                defendant.defenderPhoneNumber,
                'tel',
              ],
            ].map((item) => ({
              label: item[0] ?? '',
              value: item[1] ?? (language === 'en' ? 'N/A' : 'Ekki skráð'),
              linkType: item[2] ?? undefined,
            })),
          },
          {
            label: language === 'en' ? 'Information' : 'Málsupplýsingar',
            items: [
              {
                label: language === 'en' ? 'Type' : 'Tegund',
                value: language === 'en' ? 'Indictment' : 'Ákæra',
              },
              {
                label:
                  language === 'en' ? 'Case number' : 'Málsnúmer héraðsdóms',
                value: res.courtCaseNumber,
              },
              {
                label: language === 'en' ? 'Court' : 'Dómstóll',
                value: res.court.name,
              },
              {
                label: language === 'en' ? 'Judge' : 'Dómari',
                value: res.judge.name,
              },
              {
                label: language === 'en' ? 'Institution' : 'Embætti',
                value: res.prosecutorsOffice.name,
              },
              {
                label: language === 'en' ? 'Prosecutor' : 'Ákærandi',
                value: res.prosecutor.name,
              },
            ],
          },
        ],
      },
    }
  }
}
