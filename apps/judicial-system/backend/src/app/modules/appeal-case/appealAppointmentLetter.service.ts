import type { Response } from 'express'

import { Injectable, NotFoundException } from '@nestjs/common'

import { createAppealAppointmentLetter } from '../../formatters'
import { LawyerRegistryService } from '../lawyer-registry'
import {
  AppealSummonsRepositoryService,
  Case,
  CivilClaimant,
  Defendant,
} from '../repository'
import { buildAppealAppointmentLetter } from './appealAppointmentLetter'

/**
 * Assembles the letter appointing a party's advocate.
 *
 * Two controllers serve the letter - the court of appeals and the prosecution
 * reach it through the ordinary case routes, an advocate through the limited
 * access ones - and the defender zip reuses the same assembly, so it lives
 * here rather than in any of those callers.
 */
@Injectable()
export class AppealAppointmentLetterService {
  constructor(
    private readonly lawyerRegistryService: LawyerRegistryService,
    private readonly appealSummonsRepositoryService: AppealSummonsRepositoryService,
  ) {}

  /**
   * The advocate's firm, which the letter puts under their name. It lives in
   * the lawyer register rather than on the case, and only for an advocate
   * picked out of that register - one typed in by hand has no national id to
   * find them by. A letter is worth sending without the firm, so a lookup that
   * finds nothing is not an error.
   */
  private async getAdvocatePractice(
    nationalId?: string | null,
  ): Promise<string | undefined> {
    if (!nationalId) {
      return undefined
    }

    try {
      const lawyer = await this.lawyerRegistryService.getByNationalId(
        nationalId,
      )

      return lawyer.practice
    } catch {
      return undefined
    }
  }

  /**
   * The appointment letter as a named PDF, or nothing when there is none to
   * write for this party (no standing appeal, no confirmed advocate, etc.).
   */
  async getPdf(
    theCase: Case,
    party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
  ): Promise<{ data: Buffer; name: string } | undefined> {
    const advocatePractice = await this.getAdvocatePractice(
      party.defendant?.appealDefenderNationalId ??
        party.civilClaimant?.appealSpokespersonNationalId,
    )

    // The summonses are not on the case payload - a limited access user does
    // not get them - so the letter fetches the ones it needs itself.
    const appealSummonses = theCase.verdictAppealCase
      ? await this.appealSummonsRepositoryService.findConfirmedByAppealCaseId(
          theCase.verdictAppealCase.id,
        )
      : []

    const letter = buildAppealAppointmentLetter({
      theCase,
      ...party,
      advocatePractice,
      appealSummonses,
    })

    if (!letter) {
      return undefined
    }

    return {
      data: await createAppealAppointmentLetter(letter),
      name: `Skipunarbréf ${letter.advocateName}.pdf`,
    }
  }

  async write(
    theCase: Case,
    party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
    res: Response,
  ): Promise<void> {
    const file = await this.getPdf(theCase, party)

    if (!file) {
      throw new NotFoundException('No appeal appointment letter to write')
    }

    res.end(file.data)
  }
}
