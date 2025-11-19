import { FC, useContext } from 'react'
import { useRouter } from 'next/router'

import {
  COURT_OF_APPEAL_CASE_ROUTE,
  INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCourtOfAppealsUser,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseTransition } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  onClose: () => void
}

const ReopenModal: FC<Props> = ({ onClose }) => {
  const router = useRouter()
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { transitionCase, isTransitioningCase } = useCase()

  const handlePrimaryButtonClick = async () => {
    const caseTransitioned = await transitionCase(
      workingCase.id,
      isCourtOfAppealsUser(user)
        ? CaseTransition.REOPEN_APPEAL
        : CaseTransition.REOPEN,
    )

    if (caseTransitioned) {
      router.push(
        isCourtOfAppealsUser(user)
          ? `${COURT_OF_APPEAL_CASE_ROUTE}/${workingCase.id}`
          : isRestrictionCase(workingCase.type)
          ? `${RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`
          : `${INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`,
      )
    }
  }

  return (
    <Modal
      title={
        isCourtOfAppealsUser(user)
          ? 'Viltu leiðrétta úrskurðinn?'
          : 'Viltu leiðrétta þingbókina eða úrskurðinn?'
      }
      text={
        isCourtOfAppealsUser(user)
          ? 'Með því að halda áfram opnast ferlið aftur og hægt er að leiðrétta úrskurðinn. Til að breytingarnar skili sér til aðila máls þarf að ljúka málinu aftur.'
          : 'Að lokinni leiðréttingu er hægt að velja að undirrita leiðréttan úrskurð eigi það við.'
      }
      primaryButton={{
        text: 'Halda áfram',
        onClick: handlePrimaryButtonClick,
        isLoading: isTransitioningCase,
      }}
      secondaryButton={{
        text: 'Hætta við',
        onClick: onClose,
      }}
    />
  )
}

export default ReopenModal
