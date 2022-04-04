import React, { FC, useState } from 'react'
import {
  Text,
  RadioButton,
  DatePicker,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
// import { drivingSchools } from '../../lib/constants'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import Skeleton from './Skeleton'
import { Application, FieldBaseProps } from '@island.is/application/core'
import { student } from './mock.js'
import { DrivingSchool, DrivingSchoolType } from '../../types/schema'

const ViewStudent: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const [school, setSchool] = useState(0)
  const [date, setDate] = useState<string>('')
  const [dateError, setDateError] = useState(false)
  const drivingSchools: DrivingSchoolType[] = (application.externalData.employee
    .data as DrivingSchool).allowedDrivingSchoolTypes
  return (
    <GridContainer>
      {student && Object.entries(student).length > 0 ? (
        <>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">
                {formatMessage(m.confirmationSectionName)}
              </Text>
              <Text variant="default">{student.name}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">
                {formatMessage(m.confirmationSectionNationalId)}
              </Text>
              <Text variant="default">{student.ssn}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">
                {formatMessage(m.confirmationSectionCompleteHours)}
              </Text>
              <Text variant="default">
                {student.book?.totalLessonCount ?? 0}
              </Text>
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn span={['12/12', '6/12']}>
              <Text variant="h4">
                {formatMessage(m.confirmationSectionCompleteSchools)}
              </Text>
              {student.book?.drivingSchoolExams?.map((school, key) => {
                return (
                  <Text key={key} variant="default">
                    {school.schoolTypeName}
                  </Text>
                )
              })}
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn
              span={['12/12', '6/12']}
              paddingBottom={[3, 0]}
              paddingTop={[3, 0]}
            >
              <DatePicker
                size="sm"
                hasError={dateError}
                handleChange={(date) => {
                  setDate(format(date, 'yyyy-MM-dd'))
                  setDateError(false)
                }}
                label={formatMessage(
                  m.confirmationSectionSelectDatePlaceholder,
                )}
                locale="is"
                placeholderText={formatMessage(
                  m.confirmationSectionSelectDateLabel,
                )}
                required
                selected={date ? new Date(date) : null}
              />
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn span={'12/12'} paddingBottom={2}>
              <Text variant="h4">
                {formatMessage(m.confirmationSectionSelectSchool)}
              </Text>
            </GridColumn>

            {drivingSchools.map((item, index) => {
              return (
                <GridColumn
                  key={'radioButton-' + index}
                  span={['6/12', '4/12']}
                  paddingBottom={[3, 0]}
                >
                  <RadioButton
                    name={'options-' + index}
                    label={item.schoolTypeName}
                    value={item.schoolTypeId}
                    checked={item.schoolTypeId === school}
                    onChange={() => {
                      setSchool(item.schoolTypeId)
                    }}
                    large
                  />
                </GridColumn>
              )
            })}
          </GridRow>
        </>
      ) : (
        <Skeleton />
      )}
    </GridContainer>
  )
}

export default ViewStudent
