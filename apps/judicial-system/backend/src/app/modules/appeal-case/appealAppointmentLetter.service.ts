import type { Response } from 'express'

import { Injectable, NotFoundException } from '@nestjs/common'

import { createAppealAppointmentLetter } from '../../formatters'
import { LawyerRegistryService } from '../lawyer-registry'
import { Case, CivilClaimant, Defendant } from '../repository'
import { buildAppealAppointmentLetter } from './appealAppointmentLetter'

/**
 * Writes the letter appointing a party's advocate.
 *
 * Two controllers serve the letter - the court of appeals and the prosecution
 * reach it through the ordinary case routes, an advocate through the limited
 * access ones - and both have to assemble it the same way, so the assembly
 * lives here rather than in either.
 */
@Injectable()
export class AppealAppointmentLetterService {
  constructor(private readonly lawyerRegistryService: LawyerRegistryService) {}

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

  async write(
    theCase: Case,
    party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
    res: Response,
  ): Promise<void> {
    const advocatePractice = await this.getAdvocatePractice(
      party.defendant?.appealDefenderNationalId ??
        party.civilClaimant?.appealSpokespersonNationalId,
    )

    const letter = buildAppealAppointmentLetter({
      theCase,
      ...party,
      advocatePractice,
    })

    if (!letter) {
      throw new NotFoundException('No appeal appointment letter to write')
    }

    res.end(await createAppealAppointmentLetter(letter))
  }
}
