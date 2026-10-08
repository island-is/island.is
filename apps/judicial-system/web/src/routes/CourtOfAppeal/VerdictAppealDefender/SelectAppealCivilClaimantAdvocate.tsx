import type { FC } from 'react'
import { useContext, useState } from 'react'

import {
  AlertMessage,
  Box,
  Button,
  RadioButton,
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
  CivilClaimant,
  UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCivilClaimants } from '@island.is/judicial-system-web/src/utils/hooks'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import {
  getAppealSpokesperson,
  getAppealSpokespersonIsLawyer,
  getHasAppealSpokesperson,
} from './VerdictAppealDefender.logic'

type UpdateCivilClaimant = Omit<
  UpdateCivilClaimantInput,
  'caseId' | 'civilClaimantId'
>

interface Props {
  civilClaimant: CivilClaimant
}

/**
 * One civil claimant's advocate for the appeal.
 *
 * The lawyer / spokesperson distinction decides more here than at the district
 * court: a spokesperson is appointed by this court and is given a letter of
 * appointment, while a lawyer the claimant retains is never appointed and gets
 * none. The letter itself belongs to the next slice; what this screen owes it
 * is the distinction, recorded.
 */
const SelectAppealCivilClaimantAdvocate: FC<Props> = ({ civilClaimant }) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const {
    updateCivilClaimantState,
    updateCivilClaimant,
    setAndSendCivilClaimantToServer,
  } = useCivilClaimants()

  const [displayModal, setDisplayModal] = useState(false)

  const isConfirmed = Boolean(civilClaimant.isAppealSpokespersonConfirmed)
  const hasSpokesperson = getHasAppealSpokesperson(civilClaimant)
  const isLawyer = getAppealSpokespersonIsLawyer(civilClaimant)
  const advocate = getAppealSpokesperson(civilClaimant)
  // Icelandic declines the role noun, and the four places it appears below
  // need three different cases: "Lögmaður staðfestur", but "Staðfesta
  // lögmann" and "Breyta lögmanni". Lower-casing one nominative form for all
  // of them is what produced "Staðfesta lögmaður".
  const advocateNoun = isLawyer
    ? { nominative: 'Lögmaður', accusative: 'lögmann', dative: 'lögmanni' }
    : {
        nominative: 'Réttargæslumaður',
        accusative: 'réttargæslumann',
        dative: 'réttargæslumanni',
      }

  const send = (update: UpdateCivilClaimant) =>
    setAndSendCivilClaimantToServer(
      { caseId: workingCase.id, civilClaimantId: civilClaimant.id, ...update },
      setWorkingCase,
    )

  // See SelectAppealDefender: a contact detail edited on an advocate still
  // being read off the district court record has to bring the name and
  // national id with it, or the appeal would name somebody with no name.
  const withIdentity = (update: UpdateCivilClaimant): UpdateCivilClaimant => ({
    ...update,
    appealSpokespersonName: advocate.name ?? null,
    appealSpokespersonNationalId: advocate.nationalId ?? null,
  })

  const setHasSpokesperson = (hasAppealSpokesperson: boolean) =>
    send({
      hasAppealSpokesperson,
      // Removing the advocate clears what was recorded about them, so nothing
      // is left behind to reappear if one is added again.
      appealSpokespersonName: null,
      appealSpokespersonNationalId: null,
      appealSpokespersonEmail: null,
      appealSpokespersonPhoneNumber: null,
      appealSpokespersonIsLawyer: null,
      isAppealSpokespersonConfirmed: false,
    })

  const toggleConfirmed = () => {
    send({
      isAppealSpokespersonConfirmed: !isConfirmed,
      ...(isConfirmed
        ? {}
        : {
            appealSpokespersonIsLawyer: isLawyer ?? null,
            appealSpokespersonName: advocate.name ?? null,
            appealSpokespersonNationalId: advocate.nationalId ?? null,
            appealSpokespersonEmail: advocate.email ?? null,
            appealSpokespersonPhoneNumber: advocate.phoneNumber ?? null,
          }),
    })

    setDisplayModal(false)
  }

  return (
    <Box component="section">
      <BlueBox className={stack({ gap: 2 })}>
        <Box display="flex" justifyContent="spaceBetween">
          <Text variant="h4">{civilClaimant.name}</Text>
          {hasSpokesperson && (
            <Box display="flex" columnGap={1}>
              {isConfirmed && (
                <IconButton
                  icon="pencil"
                  colorScheme="blue"
                  ariaLabel={`Breyta talsmanni ${civilClaimant.name}`}
                  onClick={() => setDisplayModal(true)}
                />
              )}
              <IconButton
                icon="trash"
                colorScheme="blue"
                ariaLabel={`Fjarlægja talsmann ${civilClaimant.name}`}
                onClick={() => setHasSpokesperson(false)}
              />
            </Box>
          )}
        </Box>
        {hasSpokesperson ? (
          <>
            <Box display="flex" columnGap={2}>
              <RadioButton
                name={`appealAdvocateType-${civilClaimant.id}`}
                id={`appeal-civil-claimant-lawyer-${civilClaimant.id}`}
                label="Lögmaður"
                large
                backgroundColor="white"
                checked={isLawyer === true}
                onChange={() => send({ appealSpokespersonIsLawyer: true })}
                disabled={isConfirmed}
              />
              <RadioButton
                name={`appealAdvocateType-${civilClaimant.id}`}
                id={`appeal-civil-claimant-spokesperson-${civilClaimant.id}`}
                label="Réttargæslumaður"
                large
                backgroundColor="white"
                checked={isLawyer === false}
                onChange={() => send({ appealSpokespersonIsLawyer: false })}
                disabled={isConfirmed}
              />
            </Box>
            <InputAdvocate
              advocateType={isLawyer ? 'lawyer' : 'legalRightsProtector'}
              name={advocate.name}
              email={advocate.email}
              phoneNumber={advocate.phoneNumber}
              onAdvocateChange={(
                appealSpokespersonName,
                appealSpokespersonNationalId,
                appealSpokespersonEmail,
                appealSpokespersonPhoneNumber,
              ) =>
                send({
                  appealSpokespersonName,
                  appealSpokespersonNationalId,
                  appealSpokespersonEmail,
                  appealSpokespersonPhoneNumber,
                })
              }
              onEmailChange={(appealSpokespersonEmail) =>
                updateCivilClaimantState(
                  {
                    caseId: workingCase.id,
                    civilClaimantId: civilClaimant.id,
                    ...withIdentity({ appealSpokespersonEmail }),
                  },
                  setWorkingCase,
                )
              }
              onEmailSave={(appealSpokespersonEmail) =>
                updateCivilClaimant({
                  caseId: workingCase.id,
                  civilClaimantId: civilClaimant.id,
                  ...withIdentity({ appealSpokespersonEmail }),
                })
              }
              onPhoneNumberChange={(appealSpokespersonPhoneNumber) =>
                updateCivilClaimantState(
                  {
                    caseId: workingCase.id,
                    civilClaimantId: civilClaimant.id,
                    ...withIdentity({ appealSpokespersonPhoneNumber }),
                  },
                  setWorkingCase,
                )
              }
              onPhoneNumberSave={(appealSpokespersonPhoneNumber) =>
                updateCivilClaimant({
                  caseId: workingCase.id,
                  civilClaimantId: civilClaimant.id,
                  ...withIdentity({ appealSpokespersonPhoneNumber }),
                })
              }
              disabled={
                isLawyer === null || isLawyer === undefined || isConfirmed
              }
            />
          </>
        ) : (
          <AlertMessage
            message="Enginn réttargæslumaður eða lögmaður er skráður fyrir Landsrétti."
            type="info"
          />
        )}
        {isConfirmed && advocate.name && (
          <AlertMessage
            title={`${advocateNoun.nominative} staðfestur`}
            message={`${advocate.name} hefur fengið tilkynningu um skráningu í tölvupósti.`}
            type="success"
          />
        )}
        {/* Only a réttargæslumaður is appointed by the court, so a claimant
        who engaged a lögmaður of their own gets no row - the shared rule
        decides, not this screen. */}
        <AppealAppointmentLetterButton civilClaimant={civilClaimant} />
        {hasSpokesperson && !isConfirmed && (
          <Box display="flex" justifyContent="flexEnd">
            <Button
              variant="text"
              disabled={
                !advocate.name || isLawyer === null || isLawyer === undefined
              }
              onClick={() => setDisplayModal(true)}
            >
              {`Staðfesta ${advocateNoun.accusative}`}
            </Button>
          </Box>
        )}
        {!hasSpokesperson && (
          <Box display="flex" justifyContent="flexEnd">
            <Button variant="text" onClick={() => setHasSpokesperson(true)}>
              Skrá réttargæslumann eða lögmann
            </Button>
          </Box>
        )}
      </BlueBox>
      {displayModal && (
        <Modal
          title={
            isConfirmed
              ? `Breyta ${advocateNoun.dative}`
              : `Staðfesta ${advocateNoun.accusative}`
          }
          text={
            isConfirmed
              ? 'Ef þú breytir skráningunni þarf að staðfesta hana að nýju.'
              : `Með því að staðfesta skráir þú ${advocate.name} sem ${advocateNoun.accusative} ${civilClaimant.name} fyrir Landsrétti.`
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

export default SelectAppealCivilClaimantAdvocate
