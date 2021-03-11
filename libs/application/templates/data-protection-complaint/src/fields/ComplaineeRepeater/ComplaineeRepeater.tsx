import { RepeaterProps } from '@island.is/application/core'
import { Box, Button } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { complaint } from '../../lib/messages'
import { YES, NO } from '../../shared'
import { ComplaineeTable } from './ComplaineeTable'

type Complainee = {
  name: string
  address: string
  nationalId: string
  operatesWithinEurope: typeof YES | typeof NO
  countryOfOperation: string
}

export const ComplaineeRepeater: FC<RepeaterProps> = ({
  application,
  expandRepeater,
  removeRepeaterItem,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const complainee = answers.complainee as Complainee | undefined
  const additionalComplainees = answers.additionalComplainees as
    | Complainee[]
    | undefined

  const handleEditComplaineeClick = (id: string) => {
    goToScreen(id)
  }

  const handleRemoveComplaineeClick = (index: number) =>
    removeRepeaterItem(index)

  return (
    <Box>
      <FieldDescription
        description={formatMessage(complaint.general.complaineePageDescription)}
      />
      {complainee && (
        <ComplaineeTable
          id="complaineeMultiField"
          {...complainee}
          onEdit={handleEditComplaineeClick}
        />
      )}
      {additionalComplainees?.map((complainee, index) => {
        return (
          <ComplaineeTable
            id={`additionalComplainees[${index}].additionalComplaineesMultiField`}
            {...complainee}
            onEdit={handleEditComplaineeClick}
            onRemove={handleRemoveComplaineeClick.bind(null, index)}
          />
        )
      })}
      <FieldDescription
        description={formatMessage(complaint.labels.complaineeAddPerson)}
      />
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        size="small"
        onClick={expandRepeater}
      >
        {formatMessage(complaint.labels.complaineeAdd)}
      </Button>
    </Box>
  )
}
