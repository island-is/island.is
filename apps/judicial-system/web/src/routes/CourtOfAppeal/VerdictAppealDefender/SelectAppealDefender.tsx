import type { ChangeEvent, FC } from 'react'
import { useContext, useState } from 'react'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Text,
} from '@island.is/island-ui/core'
import {
  AppealAppointmentLetterButton,
  BlueBox,
  FormContext,
  IconButton,
  InputAdvocate,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import type {
  Defendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { getAppealDefender } from './VerdictAppealDefender.logic'

type UpdateDefendant = Omit<UpdateDefendantInput, 'caseId'>

interface Props {
  defendant: Defendant
}

/**
 * One defendant's defender for the appeal, as the court of appeals settles it.
 *
 * Close to the district court's SelectDefender and deliberately so - the two
 * courts do the same thing - but it writes the appeal's own columns, and it
 * offers no file sharing: what a confirmed defender may open is decided with
 * the defence case lists, not here.
 */
const SelectAppealDefender: FC<Props> = ({ defendant }) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateDefendantState, updateDefendant, setAndSendDefendantToServer } =
    useDefendants()

  const [displayModal, setDisplayModal] = useState(false)

  const isConfirmed = Boolean(defendant.isAppealDefenderConfirmed)
  const hasWaived = Boolean(defendant.isAppealDefenderWaived)
  const appealDefender = getAppealDefender(defendant)

  const send = (update: UpdateDefendant) =>
    setAndSendDefendantToServer(
      { caseId: workingCase.id, ...update },
      setWorkingCase,
    )

  // A contact detail edited on a defender still being read off the district
  // court record has to bring the name and national id with it. Writing the
  // email alone would make the appeal name somebody with no name: the screen
  // would lose the defender it was showing, and confirming would be refused.
  // Once the appeal names someone these are the values already there.
  const withIdentity = (update: UpdateDefendant): UpdateDefendant => ({
    ...update,
    appealDefenderName: appealDefender.name ?? null,
    appealDefenderNationalId: appealDefender.nationalId ?? null,
  })

  const toggleWaived = (isAppealDefenderWaived: boolean) =>
    send({
      defendantId: defendant.id,
      isAppealDefenderWaived,
      // Wanting no counsel and naming one are mutually exclusive, so the
      // fields are cleared rather than left to contradict the checkbox.
      ...(isAppealDefenderWaived
        ? {
            appealDefenderName: null,
            appealDefenderNationalId: null,
            appealDefenderEmail: null,
            appealDefenderPhoneNumber: null,
          }
        : {}),
    })

  const toggleConfirmed = () => {
    // Confirming writes out whoever is on screen, which until now may have
    // been the district court's defender read through. Once this court has
    // confirmed, the appeal names its defender in its own right.
    send({
      defendantId: defendant.id,
      isAppealDefenderConfirmed: !isConfirmed,
      ...(isConfirmed || hasWaived
        ? {}
        : {
            appealDefenderName: appealDefender.name ?? null,
            appealDefenderNationalId: appealDefender.nationalId ?? null,
            appealDefenderEmail: appealDefender.email ?? null,
            appealDefenderPhoneNumber: appealDefender.phoneNumber ?? null,
          }),
    })

    setDisplayModal(false)
  }

  return (
    <Box component="section">
      <BlueBox className={stack({ gap: 2 })}>
        <Box display="flex" justifyContent="spaceBetween">
          <Text variant="h4">{`Ákærði ${defendant.name}`}</Text>
          {isConfirmed && (
            <IconButton
              icon="pencil"
              colorScheme="blue"
              ariaLabel={`Breyta verjanda ${defendant.name}`}
              onClick={() => setDisplayModal(true)}
            />
          )}
        </Box>
        {/* What the office registered when the appeal arrived by letter, so
            the court can see it is not the defender of record it is looking
            at. Gone once this court has settled the question itself. */}
        {!isConfirmed && defendant.appealDefenderName && (
          <Text variant="small">
            {`Verjandi skráður með áfrýjun: ${defendant.appealDefenderName}`}
          </Text>
        )}
        <Checkbox
          dataTestId={`isAppealDefenderWaived-${defendant.id}`}
          name={`isAppealDefenderWaived-${defendant.id}`}
          label="Ákærði óskar ekki eftir verjanda"
          checked={hasWaived}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            toggleWaived(event.target.checked)
          }
          disabled={isConfirmed}
          filled
          large
        />
        <InputAdvocate
          advocateType="defender"
          name={appealDefender.name}
          email={appealDefender.email}
          phoneNumber={appealDefender.phoneNumber}
          onAdvocateChange={(
            appealDefenderName,
            appealDefenderNationalId,
            appealDefenderEmail,
            appealDefenderPhoneNumber,
          ) =>
            send({
              defendantId: defendant.id,
              appealDefenderName,
              appealDefenderNationalId,
              appealDefenderEmail,
              appealDefenderPhoneNumber,
            })
          }
          onEmailChange={(appealDefenderEmail) =>
            updateDefendantState(
              {
                caseId: workingCase.id,
                ...withIdentity({
                  defendantId: defendant.id,
                  appealDefenderEmail,
                }),
              },
              setWorkingCase,
            )
          }
          onEmailSave={(appealDefenderEmail) =>
            updateDefendant({
              caseId: workingCase.id,
              ...withIdentity({
                defendantId: defendant.id,
                appealDefenderEmail,
              }),
            })
          }
          onPhoneNumberChange={(appealDefenderPhoneNumber) =>
            updateDefendantState(
              {
                caseId: workingCase.id,
                ...withIdentity({
                  defendantId: defendant.id,
                  appealDefenderPhoneNumber,
                }),
              },
              setWorkingCase,
            )
          }
          onPhoneNumberSave={(appealDefenderPhoneNumber) =>
            updateDefendant({
              caseId: workingCase.id,
              ...withIdentity({
                defendantId: defendant.id,
                appealDefenderPhoneNumber,
              }),
            })
          }
          disabled={hasWaived || isConfirmed}
        />
        {isConfirmed && (
          <AlertMessage
            title={hasWaived ? 'Staðfest' : 'Verjandi staðfestur'}
            message={
              hasWaived
                ? `${defendant.name} óskar ekki eftir verjanda.`
                : `${appealDefender.name} hefur fengið tilkynningu um skráningu í tölvupósti.`
            }
            type="success"
          />
        )}
        {/* The letter the court sends the defender it just appointed, where
        the appointment was made. The same row is on the appeal overview; both
        ask getAppealAppointmentLetter, so a defendant who waived a defender
        gets neither. */}
        <AppealAppointmentLetterButton defendant={defendant} />
        {!isConfirmed && (
          <Box display="flex" justifyContent="flexEnd">
            <Button
              variant="text"
              disabled={!hasWaived && !appealDefender.name}
              onClick={() => setDisplayModal(true)}
            >
              Staðfesta val á verjanda
            </Button>
          </Box>
        )}
      </BlueBox>
      {displayModal && (
        <Modal
          title={isConfirmed ? 'Breyta verjanda' : 'Staðfesta val á verjanda'}
          text={
            isConfirmed
              ? 'Ef þú breytir verjanda þarf að staðfesta valið að nýju.'
              : hasWaived
              ? `Með því að staðfesta skráir þú að ${defendant.name} óski ekki eftir verjanda fyrir Landsrétti.`
              : `Með því að staðfesta skráir þú ${appealDefender.name} sem verjanda ${defendant.name} fyrir Landsrétti.`
          }
          buttons={[
            {
              text: 'Hætta við',
              onClick: () => setDisplayModal(false),
              variant: 'ghost',
            },
            {
              text: isConfirmed ? 'Breyta' : 'Staðfesta',
              onClick: toggleConfirmed,
            },
          ]}
        />
      )}
    </Box>
  )
}

export default SelectAppealDefender
