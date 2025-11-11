import React, { FC } from 'react'
import {
  GridContainer,
  GridRow,
  GridColumn,
  Text,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import {
  DrivingLicenseBookSchool,
  DrivingSchoolType,
} from '@island.is/api/schema'
import { RadioController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const SelectSchool: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
  error,
}) => {
  const { id } = field
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()

  const drivingSchools: DrivingSchoolType[] = (
    application.externalData.drivingSchoolForEmployee
      .data as DrivingLicenseBookSchool
  ).allowedDrivingSchoolTypes

  const options = drivingSchools.map((item) => {
    return {
      label: item.schoolTypeName,
      value: String(item.schoolTypeId),
    }
  })

  return (
    <GridContainer>
      <GridRow marginBottom={5}>
        <GridColumn span={'12/12'} paddingBottom={2}>
          <Text variant="h4">
            {formatMessage(m.confirmationSectionSelectSchool)}
          </Text>
        </GridColumn>
        <GridColumn span={'12/12'}>
          <RadioController
            id={id}
            split="1/3"
            smallScreenSplit="1/1"
            largeButtons={true}
            defaultValue={application.answers.school}
            options={options}
            error={error}
            backgroundColor="white"
            onSelect={(value) => setValue(id, value)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default SelectSchool
