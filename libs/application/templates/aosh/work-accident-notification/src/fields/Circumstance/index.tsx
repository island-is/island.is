import { FieldBaseProps } from '@island.is/application/types'
import { FC, useState } from 'react'
import { Box, Select, Text } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import {
  Group,
  Item,
  MultiSelectDropdownController,
  OptionWithKey,
} from '../Components/MultiSelectDropdownController'
import { useLocale } from '@island.is/localization'
import { causeAndConsequences } from '../../lib/messages'
import { Controller } from 'react-hook-form'
import { Option } from '../Components/types'

export type OptionAndKey = {
  option: Option
  key: string
}

export const Circumstance: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const { formatMessage } = useLocale()

  const [pickedValue, setPickedValue] = useState<OptionAndKey>()
  const activityGroups = (
    getValueViaPath(
      application.externalData,
      'aoshData.data.specificPhysicalActivity',
    ) as Group[]
  ).filter((group) => !group.validToSelect)
  const activites = (
    getValueViaPath(
      application.externalData,
      'aoshData.data.specificPhysicalActivity',
    ) as Item[]
  ).filter((group) => group.validToSelect)

  const onChange = (answer: OptionWithKey) => {
    console.log('Logging answers in Circumstance index.ts', answer)
  }

  return (
    <Box>
      <Box marginBottom={2} marginTop={2}>
        <Controller
          render={() => {
            return (
              <Select
                name=""
                options={activites.map((activity) => ({
                  value: activity.code,
                  label: activity.name,
                }))}
                backgroundColor="blue"
                placeholder={formatMessage(
                  causeAndConsequences.circumstances.searchPlaceholder,
                )}
                onChange={(value) => {
                  const code = value?.value.substring(0, 1)
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
          name={'searchBar.circumstance'}
        />
      </Box>
      <Box>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(causeAndConsequences.circumstances.heading)}
        </Text>
        <Text variant="small">
          {formatMessage(causeAndConsequences.circumstances.subHeading)}
        </Text>
      </Box>
      <Box>
        <MultiSelectDropdownController
          onAnswerChange={onChange}
          groups={activityGroups}
          items={activites}
          pickedValue={pickedValue}
          answerId="circumstances.physicalActivities"
          {...props}
        />
      </Box>
    </Box>
  )
}
