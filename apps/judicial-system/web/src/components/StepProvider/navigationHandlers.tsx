import { NextRouter } from 'next/router'

import { Case } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import { useCase } from '../../utils/hooks'
import useDefendants from '../../utils/hooks/useDefendants'

export const handleNavigateFromCreateRestrictionCase = async (
  router: NextRouter,
  theCase: Case,
) => {
  const { createCase } = useCase()
  const { updateDefendant } = useDefendants()

  if (!theCase.id) {
    const createdCase = await createCase(theCase)

    if (
      createdCase &&
      createdCase.defendants &&
      createdCase.defendants.length > 0 &&
      theCase.defendants &&
      theCase.defendants.length > 0
    ) {
      await updateDefendant(createdCase.id, createdCase.defendants[0].id, {
        gender: theCase.defendants[0].gender,
        name: theCase.defendants[0].name,
        address: theCase.defendants[0].address,
        nationalId: theCase.defendants[0].nationalId,
        noNationalId: theCase.defendants[0].noNationalId,
        citizenship: theCase.defendants[0].citizenship,
      })

      router.push(
        `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${createdCase.id}`,
      )
    }
  } else {
    router.push(
      `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${theCase.id}`,
    )
  }
}
