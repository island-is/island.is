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
import { CrimeScene } from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentCount,
  IndictmentSubtype,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isPartiallyVisible } from '@island.is/judicial-system-web/src/utils/utils'

import { policeCaseInfo } from './PoliceCaseInfo.strings'

interface Props {
  index: number
  policeCaseNumbers: string[]
  policeCaseNumberPrefix?: string | null
  subtypes?: IndictmentSubtype[]
  crimeScene?: CrimeScene
  setPoliceCase: (
    index: number,
    update: {
      policeCaseNumber?: string
      subtypes?: IndictmentSubtype[]
      crimeScene?: CrimeScene
    },
  ) => void
  deletePoliceCase?: (index: number) => void
  updatePoliceCase: (
    index?: number,
    update?: {
      policeCaseNumber?: string
      subtypes?: IndictmentSubtype[]
      crimeScene?: CrimeScene
    },
  ) => void
  updateIndictmentCount: (
    policeCaseNumber: string,
    crimeScene: CrimeScene,
    subtypes?: Record<string, IndictmentSubtype[]>,
  ) => void
  policeCaseNumberImmutable: boolean
  indictmentCount?: IndictmentCount
}

export const PoliceCaseInfo: FC<Props> = ({
  index,
  policeCaseNumbers,
  policeCaseNumberPrefix,
  subtypes,
  crimeScene,
  setPoliceCase,
  deletePoliceCase,
  updatePoliceCase,
  policeCaseNumberImmutable = false,
  updateIndictmentCount,
}) => {
  const { formatMessage } = useIntl()

  const { user } = useContext(UserContext)

  const [originalPoliceCaseNumber, setOriginalPoliceCaseNumber] = useState(
    policeCaseNumbers[index],
  )
  const [policeCaseNumberInput, setPoliceCaseNumberInput] = useState(
    policeCaseNumbers[index],
  )
  const [policeCaseNumberErrorMessage, setPoliceCaseNumberErrorMessage] =
    useState<string>('')
  const [indexDate, setIndexDate] = useState({ index, date: crimeScene?.date })

  const subtypesArray = subtypes || []
  const crimeSceneDateId = `crime-scene-date-${originalPoliceCaseNumber}`

  useEffect(() => {
    if (policeCaseNumbers[index] !== originalPoliceCaseNumber) {
      // This component is now handling a new police case number
      setPoliceCaseNumberInput(policeCaseNumbers[index])
      setOriginalPoliceCaseNumber(policeCaseNumbers[index])
    } else if (policeCaseNumberInput !== policeCaseNumbers[index]) {
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
        updatePoliceCase(index, {
          policeCaseNumber: policeCaseNumberInput,
        })
      }
    }
  }, [
    index,
    originalPoliceCaseNumber,
    policeCaseNumberInput,
    policeCaseNumbers,
    updatePoliceCase,
  ])

  useEffect(() => {
    if (
      index !== indexDate.index &&
      crimeScene?.date?.getTime() !== indexDate.date?.getTime()
    ) {
      // Our position in the list has changed because we changed the crime scene date
      const dateElement = document.getElementById(crimeSceneDateId)

      // Make sure the date element is visible
      if (dateElement && !isPartiallyVisible(dateElement)) {
        dateElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      setIndexDate({ index, date: crimeScene?.date })
    }
  }, [
    index,
    indexDate.index,
    indexDate.date,
    crimeScene?.date,
    crimeSceneDateId,
  ])

  const options = useMemo(
    () =>
      Object.values(IndictmentSubtype)
        .map((subtype) => ({
          label: capitalize(indictmentSubtypes[subtype]),
          value: subtype,
          disabled: subtypes?.includes(subtype),
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [subtypes],
  )

  return (
    <BlueBox>
      {deletePoliceCase && (
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button
            onClick={() => deletePoliceCase(index)}
            colorScheme="destructive"
            variant="text"
            size="small"
          >
            {formatMessage(policeCaseInfo.delete)}
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
              setPoliceCase(index, {
                policeCaseNumber: event.target.value,
              })
            }
            setPoliceCaseNumberInput(event.target.value)
          }}
          onBlur={(event) => {
            if (policeCaseNumberInput !== policeCaseNumbers[index]) {
              setPoliceCaseNumberErrorMessage(
                formatMessage(policeCaseInfo.policeCaseNumberExists),
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
          disabled={policeCaseNumberImmutable}
          data-testid={`policeCaseNumber${index}`}
          name="policeCaseNumber"
          autoComplete="off"
          label={formatMessage(policeCaseInfo.policeCaseNumberLabel)}
          placeholder={formatMessage(
            policeCaseInfo.policeCaseNumberPlaceholder,
            {
              prefix:
                policeCaseNumberPrefix ??
                user?.institution?.policeCaseNumberPrefix ??
                '',
              year: new Date().getFullYear(),
            },
          )}
          hasError={policeCaseNumberErrorMessage !== ''}
          errorMessage={policeCaseNumberErrorMessage}
          required
        />
      </Box>
      <Box marginBottom={2}>
        <Select
          name="case-type"
          options={options}
          label={formatMessage(policeCaseInfo.indictmentTypeLabel)}
          placeholder={formatMessage(policeCaseInfo.indictmentTypePlaceholder)}
          onChange={(selectedOption) => {
            const indictmentSubtype = selectedOption?.value

            if (!indictmentSubtype) {
              return
            }

            const subtypes = [...subtypesArray, indictmentSubtype]
            updatePoliceCase(index, { subtypes })

            // initialise the indictment count(s) subtype only
            // when a single subtype has been selected. If there are more
            // its up to the user to initialise
            if (subtypes.length === 1) {
              updateIndictmentCount(
                policeCaseNumbers[index],
                crimeScene || {},
                {
                  [policeCaseNumbers[index]]: subtypes,
                },
              )
            }
          }}
          value={null}
          required
        />
      </Box>
      {subtypes && (
        <Box marginBottom={2}>
          {subtypes.map((subtype) => (
            <Box
              display="inlineBlock"
              key={subtype}
              component="span"
              marginBottom={1}
              marginRight={1}
            >
              <Tag
                variant="darkerBlue"
                onClick={() => {
                  const remainingSubtypes = subtypes.filter(
                    (s) => s !== subtype,
                  )

                  updatePoliceCase(index, {
                    policeCaseNumber: policeCaseNumbers[index],
                    subtypes: subtypes.filter((s) => s !== subtype),
                  })

                  updateIndictmentCount(
                    policeCaseNumbers[index],
                    crimeScene || {},
                    {
                      [policeCaseNumbers[index]]: remainingSubtypes,
                    },
                  )
                }}
                aria-label={formatMessage(policeCaseInfo.removeSubtype, {
                  subtype: indictmentSubtypes[subtypes[0]],
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
          label={formatMessage(policeCaseInfo.policeCasePlaceLabel)}
          placeholder={formatMessage(policeCaseInfo.policeCasePlacePlaceholder)}
          value={crimeScene?.place ?? ''}
          onChange={(event) => {
            setPoliceCase(index, {
              crimeScene: { ...crimeScene, place: event.target.value },
            })
          }}
          onBlur={(event) => {
            updatePoliceCase()
            updateIndictmentCount(
              policeCaseNumbers[index],
              { ...crimeScene, place: event.target.value },
              { [policeCaseNumbers[index]]: subtypesArray },
            )
          }}
        />
      </Box>
      <DateTime
        name={crimeSceneDateId}
        maxDate={new Date()}
        blueBox={false}
        selectedDate={crimeScene?.date}
        dateOnly={true}
        onChange={(date, valid) => {
          if (date && valid) {
            updatePoliceCase(index, {
              crimeScene: { ...crimeScene, date: date },
            })

            updateIndictmentCount(
              policeCaseNumbers[index],
              { ...crimeScene, date: date },
              { [policeCaseNumbers[index]]: subtypesArray },
            )
          }
        }}
      />
    </BlueBox>
  )
}
