import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContext,
  InputAdvocate,
} from '@island.is/judicial-system-web/src/components'
import {
  CivilClaimant,
  UpdateCivilClaimantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCivilClaimants } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Advocates.strings'

interface Props {
  civilClaimant: CivilClaimant
}

const SelectCivilClaimantAdvocate: FC<Props> = ({ civilClaimant }) => {
  const { setAndSendCivilClaimantToServer } = useCivilClaimants()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  const { formatMessage } = useIntl()

  const updateCivilClaimant = (update: UpdateCivilClaimantInput) => {
    setAndSendCivilClaimantToServer(
      {
        ...update,
        caseId: workingCase.id,
        civilClaimantId: civilClaimant.id,
      },
      setWorkingCase,
    )
  }

  return (
    <BlueBox>
      <Box marginBottom={2}>
        <Text variant="h4">{civilClaimant.name}</Text>
      </Box>
      {civilClaimant.hasSpokesperson ? (
        <>
          <Box display="flex" marginY={2}>
            <Box width="half" marginRight={1}>
              <RadioButton
                name="civilClaimantAdvocateType"
                id={`civil_claimant_lawyer-${civilClaimant.id}`}
                label={formatMessage(strings.lawyer)}
                large
                backgroundColor="white"
                checked={civilClaimant.spokespersonIsLawyer === true}
                onChange={() =>
                  updateCivilClaimant({
                    spokespersonIsLawyer: true,
                  } as UpdateCivilClaimantInput)
                }
              />
            </Box>
            <Box width="half" marginLeft={1}>
              <RadioButton
                name="civilClaimantAdvocateType"
                id={`civil_claimant_legal_rights_protector-${civilClaimant.id}`}
                label={formatMessage(strings.legalRightsProtector)}
                large
                backgroundColor="white"
                checked={civilClaimant.spokespersonIsLawyer === false}
                onChange={() =>
                  updateCivilClaimant({
                    spokespersonIsLawyer: false,
                  } as UpdateCivilClaimantInput)
                }
              />
            </Box>
          </Box>
          <Box marginBottom={2}>
            <InputAdvocate
              clientId={civilClaimant.id}
              advocateType={
                civilClaimant.spokespersonIsLawyer
                  ? 'defender'
                  : 'legal_rights_protector'
              }
              disabled={
                civilClaimant.spokespersonIsLawyer === null ||
                civilClaimant.spokespersonIsLawyer === undefined
              }
              isCivilClaim={true}
            />
          </Box>
          <Checkbox
            name={`shareFilesWithCivilClaimantAdvocate-${civilClaimant.id}`}
            label={formatMessage(strings.shareFilesWithCivilClaimantAdvocate, {
              defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
            })}
            checked={Boolean(civilClaimant.caseFilesSharedWithSpokesperson)}
            disabled={
              civilClaimant.spokespersonIsLawyer === null ||
              civilClaimant.spokespersonIsLawyer === undefined
            }
            onChange={() => {
              updateCivilClaimant({
                caseFilesSharedWithSpokesperson:
                  !civilClaimant.caseFilesSharedWithSpokesperson,
              } as UpdateCivilClaimantInput)
            }}
            tooltip={formatMessage(
              strings.shareFilesWithCivilClaimantAdvocateTooltip,
              {
                defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
              },
            )}
            backgroundColor="white"
            large
            filled
          />
        </>
      ) : (
        <AlertMessage
          message={formatMessage(strings.noCivilClaimantAdvocate)}
          type="info"
        />
      )}
      <Box display="flex" justifyContent="flexEnd" marginTop={2}>
        <Button
          variant="text"
          colorScheme={
            civilClaimant.hasSpokesperson ? 'destructive' : 'default'
          }
          onClick={() => {
            updateCivilClaimant({
              hasSpokesperson: !civilClaimant.hasSpokesperson,
              spokespersonEmail: null,
              spokespersonPhoneNumber: null,
              spokespersonName: null,
              spokespersonIsLawyer: null,
              spokespersonNationalId: null,
              caseFilesSharedWithSpokesperson: null,
            } as UpdateCivilClaimantInput)
          }}
        >
          {civilClaimant.hasSpokesperson
            ? formatMessage(strings.removeCivilClaimantAdvocate, {
                defenderIsLawyer: civilClaimant.spokespersonIsLawyer,
              })
            : formatMessage(strings.addCivilClaimantAdvocate)}
        </Button>
      </Box>
    </BlueBox>
  )
}

export default SelectCivilClaimantAdvocate
