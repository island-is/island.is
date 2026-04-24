import { FC, useContext } from 'react'
import { useRouter } from 'next/router'

import {
  COURT_OF_APPEAL_CASE_ROUTE,
  INDICTMENTS_COURT_OVERVIEW_ROUTE,
  INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  isCourtOfAppealsUser,
  isInvestigationCase,
  isRequestCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseTransition,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useAppealCase,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  onClose: () => void
}

const ReopenModal: FC<Props> = ({ onClose }) => {
  const router = useRouter()
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { transitionCase, isTransitioningCase } = useCase()
  const { transitionAppealCase, isTransitioningAppealCase } = useAppealCase()

  const handlePrimaryButtonClick = async () => {
    const caseTransitioned = isCourtOfAppealsUser(user)
      ? await transitionAppealCase(
          workingCase.id,
          workingCase.appealCase?.id ?? '',
          AppealCaseTransition.REOPEN_APPEAL,
        )
      : await transitionCase(workingCase.id, CaseTransition.REOPEN)

    if (caseTransitioned) {
      router.push(
        isCourtOfAppealsUser(user)
          ? `${COURT_OF_APPEAL_CASE_ROUTE}/${workingCase.id}`
          : isRestrictionCase(workingCase.type)
          ? `${RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`
          : isInvestigationCase(workingCase.type)
          ? `${INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`
          : `${INDICTMENTS_COURT_OVERVIEW_ROUTE}/${workingCase.id}`,
      )
    }
  }

  return (
    <Modal
      title={
        isCourtOfAppealsUser(user)
          ? 'Viltu leiðrétta úrskurðinn?'
          : isRequestCase(workingCase.type)
          ? 'Viltu leiðrétta þingbókina eða úrskurðinn?'
          : 'Viltu opna mál og leiðrétta?'
      }
      text={
        isCourtOfAppealsUser(user)
          ? 'Með því að halda áfram opnast ferlið aftur og hægt er að leiðrétta úrskurðinn. Til að breytingarnar skili sér til aðila máls þarf að ljúka málinu aftur.'
          : isRequestCase(workingCase.type)
          ? 'Að lokinni leiðréttingu er hægt að velja að undirrita leiðréttan úrskurð eigi það við.'
          : 'Að lokinni leiðréttingu þarf dómari að staðfesta aftur dóm. Leiðrétting verður sýnileg málflytjendum.'
      }
      primaryButton={{
        text: 'Halda áfram',
        onClick: handlePrimaryButtonClick,
        isLoading: isTransitioningCase || isTransitioningAppealCase,
      }}
      secondaryButton={{
        text: 'Hætta við',
        onClick: onClose,
      }}
    />
  )
}

export default ReopenModal
