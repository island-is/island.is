import React, { useState } from 'react'
import {
  Text,
  RadioButton,
  DatePicker,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { drivingSchools } from '../../lib/constants'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import Skeleton from './Skeleton'
import { Application } from '@island.is/application/core'

const student = {
  name: 'Lorem',
  ssn: '1111111111',
  book: {
    id: '1',
    totalLessonCount: 5,
    teachersAndLessons: [],
    drivingSchoolExams: [
      {
        schoolTypeName: 'Ökuskóli 1 - Netökuskóli Mjódd',
      },
    ],
    testResults: [
      {
        testTypeName: 'Ökuskóli 1',
      },
    ],
  },
}

interface Props {
  application: Application
  studentSsn: string
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewStudent = ({ application, studentSsn, setShowTable }: Props) => {
  const { formatMessage } = useLocale()

  const [minutes, setMinutes] = useState(30)
  const [date, setDate] = useState<string>('')
  const [dateError, setDateError] = useState(false)

  return (
    <GridContainer>
      {student && Object.entries(student).length > 0 ? (
        <>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">{formatMessage(m.viewStudentName)}</Text>
              <Text variant="default">{student.name}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">{formatMessage(m.viewStudentNationalId)}</Text>
              <Text variant="default">{student.ssn}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">
                {formatMessage(m.viewStudentCompleteHours)}
              </Text>
              <Text variant="default">
                {student.book?.totalLessonCount ?? 0}
              </Text>
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn span={['12/12', '6/12']}>
              <Text variant="h4">
                {formatMessage(m.viewStudentCompleteSchools)}
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
                errorMessage={formatMessage(m.errorOnMissingDate)}
                handleChange={(date) => {
                  setDate(format(date, 'yyyy-MM-dd'))
                  setDateError(false)
                }}
                label={'Áfanga lauk'}
                locale="is"
                placeholderText={'Veldu dagsetningu'}
                required
                selected={date ? new Date(date) : null}
              />
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn span={'12/12'} paddingBottom={2}>
              <Text variant="h4">{'Veldu skóla'}</Text>
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
                    label={item.label}
                    value={item.value}
                    checked={item.value === minutes}
                    onChange={() => {
                      setMinutes(item.value)
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
