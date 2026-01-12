import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  ErrorMessage,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import {
  Group,
  Item,
  MultiSelectDropdownController,
  OptionWithKey,
} from './MultiSelectDropdownController'
import { useLocale } from '@island.is/localization'
import { causeAndConsequences } from '../../lib/messages'
import { Controller, useFormContext } from 'react-hook-form'
import { Option } from './types'
import { MessageDescriptor } from 'react-intl'

type CausesAndEffectsProps = {
  externalDataKey: string // Example aoshData.data.physicalActivities
  heading: MessageDescriptor // Contentful translation
  subHeading: MessageDescriptor // Contentful translation
  answerId: string // Example circumstances.physicalActivities
  mostSeriousAnswerId: string // Example circumstances.physicialActivitesMostSerious
  screenId: string // Example circumstances ... used to find answers to autofill
  mostSeriousAnswer?: string // Example physicialActivitiesMostSerious ... used to find answers to autofill
  majorGroupLength: number
}

export type OptionAndKey = {
  option: Option
  key: string
}

export const CausesAndEffects: FC<
  React.PropsWithChildren<CausesAndEffectsProps & FieldBaseProps>
> = (props) => {
  const {
    application,
    externalDataKey,
    heading,
    subHeading,
    screenId,
    mostSeriousAnswer,
    mostSeriousAnswerId,
    errors,
    answerId,
    setBeforeSubmitCallback,
    majorGroupLength,
  } = props
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [mostSerious, setMostSeriousList] = useState<Option[]>([])
  const [mostSeriousChosen, setMostSeriousChosen] = useState<string>(
    mostSeriousAnswer || '',
  )
  const [pickedValue, setPickedValue] = useState<OptionAndKey>()
  const activityGroups = (
    getValueViaPath<Group[]>(application.externalData, externalDataKey) ?? []
  ).filter((group) => group.code.endsWith('0'))
  const activites = (
    getValueViaPath<Item[]>(application.externalData, externalDataKey) ?? []
  ).filter((group) => group.validToSelect)

  const onChange = (answers: OptionWithKey) => {
    const options: Option[] = []
    const uniqueOptions = new Set<string>()

    for (const key in answers) {
      answers[key].forEach((option) => {
        if (!uniqueOptions.has(option.value)) {
          uniqueOptions.add(option.value)
          options.push(option)
        }
      })
    }

    if (!options.some((option) => option.value === mostSeriousChosen)) {
      setMostSeriousChosen('')
    }

    setMostSeriousList(options)
  }

  useEffect(() => {
    if (mostSeriousAnswer) {
      setMostSeriousChosen(mostSeriousAnswer)
    }
  }, [mostSeriousAnswer, mostSeriousAnswerId, setValue])

  setBeforeSubmitCallback?.(async () => {
    if (mostSeriousChosen === '') {
      setValue(mostSeriousAnswerId, null)
    } else {
      setValue(mostSeriousAnswerId, mostSeriousChosen)
    }
    return [true, null]
  })
  return (
    <Box>
      <Box marginBottom={2} marginTop={2}>
        <Controller
          render={() => {
            return (
              <Select
                options={activites.map((activity) => ({
                  value: activity.code,
                  label: activity.name,
                }))}
                backgroundColor="blue"
                placeholder={formatMessage(
                  causeAndConsequences.shared.searchPlaceholder,
                )}
                onChange={(value) => {
                  const code = value?.value.substring(0, majorGroupLength)
                  const activity: Option = {
                    value: value?.value || '',
                    label: value?.label || '',
                  }
                  if (!code) return
                  setPickedValue({
                    option: activity,
                    key: code,
                  })
                }}
                icon="search"
              />
            )
          }}
          name={`searchBar.${screenId}`}
        />
      </Box>
      <Box>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(heading)}
        </Text>
        <Text variant="small">{formatMessage(subHeading)}</Text>
      </Box>
      <Box>
        <MultiSelectDropdownController
          onAnswerChange={onChange}
          groups={activityGroups}
          items={activites}
          pickedValue={pickedValue}
          {...props}
        />
      </Box>
      {errors && getErrorViaPath(errors, answerId) && (
        <Box paddingTop={1}>
          <ErrorMessage
            children={formatMessage(
              causeAndConsequences.shared.causeAndConsequencesNothingChosen,
            )}
          />
        </Box>
      )}
      {mostSerious.length > 1 ? (
        <Box marginTop={3} border="standard" padding={4}>
          <Box marginBottom={2}>
            <AlertMessage
              type="warning"
              message={formatMessage(
                causeAndConsequences.shared.mostSeriousWarning,
              )}
            />
            {errors &&
              getErrorViaPath(
                errors,
                `${answerId.split('.')?.[0]}.${
                  mostSeriousAnswerId.split('.')?.[1]
                }` || '',
              ) && (
                <Box paddingTop={2}>
                  <ErrorMessage
                    children={formatMessage(
                      causeAndConsequences.shared.mostSeriousAlert,
                    )}
                  />
                </Box>
              )}
          </Box>
          <Box>
            {mostSerious.map((item, index) => {
              return (
                <Box
                  marginBottom={1}
                  key={`${item.label}-${index}-radio`}
                  id={mostSeriousAnswerId}
                >
                  <RadioButton
                    id={`${item.label}-${index}-radio`}
                    name={`most serious-${index}`}
                    label={item.label}
                    value={item.value}
                    checked={item.value === mostSeriousChosen}
                    backgroundColor="white"
                    onChange={(e) => {
                      setMostSeriousChosen(e.target.value)
                      setValue(mostSeriousAnswerId, e.target.value)
                    }}
                  />
                </Box>
              )
            })}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
