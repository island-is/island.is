import type { FC } from 'react'
import { useContext } from 'react'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PdfButton from '@island.is/judicial-system-web/src/components/PdfButton/PdfButton'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import type {
  CivilClaimant,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getAppealAppointmentLetter } from './AppealAppointmentLetter.logic'

interface Props {
  defendant?: Defendant
  civilClaimant?: CivilClaimant
}

/**
 * The letter appointing one party's advocate for the appeal, where that party
 * is on screen.
 *
 * Renders nothing unless there is a letter to write - see
 * getAppealAppointmentLetter, which both this and the appeal overview ask, so
 * the two offer the same letters on the same grounds.
 */
const AppealAppointmentLetterButton: FC<Props> = ({
  defendant,
  civilClaimant,
}) => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const letter = getAppealAppointmentLetter(workingCase, user, {
    defendant,
    civilClaimant,
  })

  if (!letter) {
    return null
  }

  return (
    <PdfButton
      renderAs="row"
      caseId={workingCase.id}
      title={letter.name}
      pdfType="appealAppointmentLetter"
      elementId={letter.elementId}
    />
  )
}

export default AppealAppointmentLetterButton
