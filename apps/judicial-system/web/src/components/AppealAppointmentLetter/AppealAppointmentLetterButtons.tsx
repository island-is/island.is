import type { FC } from 'react'
import { useContext } from 'react'

import { Box } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PdfButton from '@island.is/judicial-system-web/src/components/PdfButton/PdfButton'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { getAppealAppointmentLetters } from './AppealAppointmentLetter.logic'

/**
 * The letters of appointment the court of appeals has to send, stacked below
 * the advocates they appoint (design, parent ticket).
 *
 * One button per party, in party order, rather than one inside each party's
 * box: the letters are what the court takes away from the screen once it has
 * settled everyone, so the design groups them as a batch.
 *
 * Renders nothing until there is a letter to write - see
 * getAppealAppointmentLetter, which the appeal overview asks too, so the two
 * screens offer the same letters on the same grounds.
 */
const AppealAppointmentLetterButtons: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const letters = getAppealAppointmentLetters(workingCase, user)

  if (letters.length === 0) {
    return null
  }

  return (
    // alignItems keeps each button the width of its own label, as the design
    // has them, rather than stretching them across the form.
    <Box
      component="section"
      dataTestId="appealAppointmentLetters"
      alignItems="flexStart"
      className={stack({ gap: 2 })}
    >
      {letters.map((letter) => (
        <PdfButton
          key={letter.key}
          caseId={workingCase.id}
          title={letter.buttonLabel}
          pdfType="appealAppointmentLetter"
          elementId={letter.elementId}
        />
      ))}
    </Box>
  )
}

export default AppealAppointmentLetterButtons
