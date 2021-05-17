import { formatISO } from 'date-fns' // eslint-disable-line no-restricted-imports

import { Injectable } from '@nestjs/common'

import { CourtClientService } from '@island.is/judicial-system/court-client'
import { CaseType } from '@island.is/judicial-system/types'

@Injectable()
export class CourtService {
  constructor(private readonly courtClientService: CourtClientService) {}

  createCustodyCourtCase(policeCaseNumber: string): Promise<string> {
    return this.courtClientService.createCustodyCase({
      basedOn: 'Rannsóknarhagsmunir',
      sourceNumber: policeCaseNumber,
    })
  }

  createCourtCase(
    type: CaseType,
    policeCaseNumber: string,
    isExtension: boolean,
  ): Promise<string> {
    return this.courtClientService.createCase({
      caseType: 'R - Rannsóknarmál',
      subtype:
        type === CaseType.CUSTODY
          ? isExtension
            ? 'Framlenging gæsluvarðhalds'
            : 'Gæsluvarðhald'
          : isExtension
          ? 'Framlenging farbanns'
          : 'Farbann',
      status: 'Skráð',
      receivalDate: formatISO(new Date(), { representation: 'date' }),
      basedOn: 'Rannsóknarhagsmunir',
      sourceNumber: policeCaseNumber,
    })
  }
}
