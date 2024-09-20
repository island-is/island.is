import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
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

export const Circumstance: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const { formatMessage } = useLocale()
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

  const onChange = (values?: OptionWithKey) => {
    console.log('onChange in Circumstance index.ts', values)
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
                //value={{value: ''}}
                placeholder={formatMessage(
                  causeAndConsequences.circumstances.searchPlaceholder,
                )}
                onChange={(value) => {
                  //
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
          groups={activityGroups}
          items={activites}
          onAnswerChange={onChange}
          answerId="circumstances.physicalActivities"
          {...props}
        />
      </Box>
    </Box>
  )
}
