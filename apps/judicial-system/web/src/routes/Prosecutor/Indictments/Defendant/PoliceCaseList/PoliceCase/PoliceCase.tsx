import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { InputMask } from '@react-input/mask'

import {
  Box,
  Button,
  Icon,
  Input,
  Select,
  Tag,
} from '@island.is/island-ui/core'
import { POLICE_CASE_NUMBER } from '@island.is/judicial-system/consts'
import {
  capitalize,
  indictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import {
  CrimeScene,
  deprecatedIndictmentSubtypes,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseOrigin,
  IndictmentSubtype,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isPartiallyVisible } from '@island.is/judicial-system-web/src/utils/utils'

import { strings } from './PoliceCase.strings'

export interface PoliceCaseUpdate {
  policeCaseNumber?: string
  subtypes?: IndictmentSubtype[]
  crimeScene?: CrimeScene
}

interface Props {
  index: number
  setPoliceCase: (update: PoliceCaseUpdate) => void
  updatePoliceCase: (update?: PoliceCaseUpdate) => void
  deletePoliceCase?: () => void
}

export const PoliceCase: FC<Props> = ({
  index,
  setPoliceCase,
  updatePoliceCase,
  deletePoliceCase,
}) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase } = useContext(FormContext)

  const policeCaseNumbers = useMemo(
    () => workingCase.policeCaseNumbers ?? [],
    [workingCase.policeCaseNumbers],
  )

  const policeCaseNumber = useMemo(
    () => policeCaseNumbers[index] ?? '',
    [index, policeCaseNumbers],
  )

  const policeCaseNumberSubtypes: IndictmentSubtype[] = useMemo(
    () => workingCase.indictmentSubtypes?.[policeCaseNumber] ?? [],
    [workingCase.indictmentSubtypes, policeCaseNumber],
  )

  const policeCaseNumberCrimeScene: CrimeScene = useMemo(() => {
    if (!workingCase.crimeScenes) {
      return {}
    }

    const crimeScene = workingCase.crimeScenes[policeCaseNumber]

    if (!crimeScene) {
      return {}
    }

    return {
      place: crimeScene.place,
      date: crimeScene.date ? new Date(crimeScene.date) : undefined,
    }
  }, [policeCaseNumber, workingCase.crimeScenes])

  const [originalPoliceCaseNumber, setOriginalPoliceCaseNumber] =
    useState(policeCaseNumber)
  const [policeCaseNumberInput, setPoliceCaseNumberInput] =
    useState(policeCaseNumber)
  const [policeCaseNumberErrorMessage, setPoliceCaseNumberErrorMessage] =
    useState<string>('')
  const [indexDate, setIndexDate] = useState({
    index,
    date: policeCaseNumberCrimeScene.date,
  })

  const crimeSceneDateId = useMemo(
    () => `crime-scene-date-${originalPoliceCaseNumber}`,
    [originalPoliceCaseNumber],
  )

  const options = useMemo(
    () =>
      Object.values(IndictmentSubtype)
        .filter((subtype) => !deprecatedIndictmentSubtypes.includes(subtype))
        .map((subtype) => ({
          label: capitalize(indictmentSubtypes[subtype]),
          value: subtype,
          disabled: policeCaseNumberSubtypes.includes(subtype),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [policeCaseNumberSubtypes],
  )

  useEffect(() => {
    if (policeCaseNumber !== originalPoliceCaseNumber) {
      // This component is now handling a new police case number
      setPoliceCaseNumberInput(policeCaseNumber)
      setOriginalPoliceCaseNumber(policeCaseNumber)
    } else if (policeCaseNumberInput !== policeCaseNumber) {
      // The police case number was modified by the user
      if (
        !policeCaseNumbers.some(
          (policeCaseNumber, idx) =>
            idx !== index && policeCaseNumber === policeCaseNumberInput,
        )
      ) {
        setPoliceCaseNumberErrorMessage('')
        validateAndSetErrorMessage(
          ['empty', 'police-casenumber-format'],
          policeCaseNumberInput,
          setPoliceCaseNumberErrorMessage,
        )
        updatePoliceCase({ policeCaseNumber: policeCaseNumberInput })
      }
    }
  }, [
    index,
    originalPoliceCaseNumber,
    policeCaseNumber,
    policeCaseNumberInput,
    policeCaseNumbers,
    updatePoliceCase,
  ])

  useEffect(() => {
    if (
      index !== indexDate.index &&
      policeCaseNumberCrimeScene.date?.getTime() !== indexDate.date?.getTime()
    ) {
      // Our position in the list has changed because we changed the crime scene date
      const dateElement = document.getElementById(crimeSceneDateId)

      // Make sure the date element is visible
      if (dateElement && !isPartiallyVisible(dateElement)) {
        dateElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      setIndexDate({ index, date: policeCaseNumberCrimeScene.date })
    }
  }, [
    index,
    indexDate.index,
    indexDate.date,
    policeCaseNumberCrimeScene.date,
    crimeSceneDateId,
  ])

  const isPoliceCaseNumberImmutable =
    workingCase.origin === CaseOrigin.LOKE && index === 0

  return (
    <BlueBox>
      {deletePoliceCase && (
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button
            onClick={() => deletePoliceCase()}
            colorScheme="destructive"
            variant="text"
            size="small"
          >
            {formatMessage(strings.delete)}
          </Button>
        </Box>
      )}
      <Box marginBottom={2}>
        <InputMask
          component={Input}
          mask={POLICE_CASE_NUMBER}
          replacement={{ _: /\d/ }}
          value={policeCaseNumberInput}
          onChange={(event) => {
            if (
              !policeCaseNumbers.some(
                (policeCaseNumber, idx) =>
                  idx !== index && policeCaseNumber === event.target.value,
              )
            ) {
              removeErrorMessageIfValid(
                ['empty', 'police-casenumber-format'],
                event.target.value,
                policeCaseNumberErrorMessage,
                setPoliceCaseNumberErrorMessage,
              )
              setPoliceCase({ policeCaseNumber: event.target.value })
            }

            setPoliceCaseNumberInput(event.target.value)
          }}
          onBlur={(event) => {
            if (policeCaseNumberInput !== policeCaseNumber) {
              setPoliceCaseNumberErrorMessage(
                formatMessage(strings.policeCaseNumberExists),
              )
            } else {
              validateAndSetErrorMessage(
                ['empty', 'police-casenumber-format'],
                event.target.value,
                setPoliceCaseNumberErrorMessage,
              )
              updatePoliceCase()
            }
          }}
          disabled={isPoliceCaseNumberImmutable}
          data-testid={`policeCaseNumber${index}`}
          name="policeCaseNumber"
          autoComplete="off"
          label={formatMessage(strings.policeCaseNumberLabel)}
          placeholder={formatMessage(strings.policeCaseNumberPlaceholder, {
            prefix:
              workingCase.prosecutorsOffice?.policeCaseNumberPrefix ??
              user?.institution?.policeCaseNumberPrefix ??
              '',
            year: new Date().getFullYear(),
          })}
          hasError={policeCaseNumberErrorMessage !== ''}
          errorMessage={policeCaseNumberErrorMessage}
          required
        />
      </Box>
      <Box marginBottom={2}>
        <Select
          name="case-type"
          options={options}
          label={formatMessage(strings.indictmentTypeLabel)}
          placeholder={formatMessage(strings.indictmentTypePlaceholder)}
          onChange={(selectedOption) => {
            const indictmentSubtype = selectedOption?.value

            if (!indictmentSubtype) {
              return
            }

            updatePoliceCase({
              subtypes: [...policeCaseNumberSubtypes, indictmentSubtype],
            })
          }}
          value={null}
          required
        />
      </Box>
      {policeCaseNumberSubtypes.length > 0 && (
        <Box marginBottom={2}>
          {policeCaseNumberSubtypes.map((subtype) => (
            <Box
              display="inlineBlock"
              key={subtype}
              component="span"
              marginBottom={1}
              marginRight={1}
            >
              <Tag
                variant="darkerBlue"
                onClick={() =>
                  updatePoliceCase({
                    subtypes: policeCaseNumberSubtypes.filter(
                      (s) => s !== subtype,
                    ),
                  })
                }
                aria-label={formatMessage(strings.removeSubtype, {
                  subtype: indictmentSubtypes[policeCaseNumberSubtypes[0]],
                })}
              >
                <Box display="flex" alignItems="center">
                  {capitalize(indictmentSubtypes[subtype])}
                  <Icon icon="close" size="small" />
                </Box>
              </Tag>
            </Box>
          ))}
        </Box>
      )}
      <Box marginBottom={2}>
        <Input
          name="policeCasePlace"
          autoComplete="off"
          label={formatMessage(strings.policeCasePlaceLabel)}
          placeholder={formatMessage(strings.policeCasePlacePlaceholder)}
          value={policeCaseNumberCrimeScene.place ?? ''}
          onChange={(event) =>
            setPoliceCase({
              crimeScene: {
                ...policeCaseNumberCrimeScene,
                place: event.target.value,
              },
            })
          }
          onBlur={() => updatePoliceCase()}
        />
      </Box>
      <DateTime
        name={crimeSceneDateId}
        maxDate={new Date()}
        blueBox={false}
        selectedDate={policeCaseNumberCrimeScene.date}
        dateOnly={true}
        onChange={(date, valid) => {
          if (date && valid) {
            updatePoliceCase({
              crimeScene: { ...policeCaseNumberCrimeScene, date: date },
            })
          }
        }}
      />
    </BlueBox>
  )
}
