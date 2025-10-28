import React, { FC, useEffect } from 'react'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  AlertMessage,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import Skeleton from './Skeleton'
import { FieldBaseProps } from '@island.is/application/types'
import { useQuery } from '@apollo/client'
import { ViewSingleStudentQuery } from '../../graphql/queries'
import { useFormContext } from 'react-hook-form'
import kennitala from 'kennitala'
import { Student as TStudent } from '../../types'
import { GetDrivingLicenseBookStudentOverview } from '../../types'
import format from 'date-fns/format'

const ViewStudent: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const { data, loading, error } =
    useQuery<GetDrivingLicenseBookStudentOverview>(ViewSingleStudentQuery, {
      variables: {
        input: {
          nationalId: (application.answers.student as TStudent).nationalId,
        },
      },
      notifyOnNetworkStatusChange: true,
    })

  useEffect(() => {
    setValue('studentBookTypes', student?.book?.drivingSchoolExams)
    setValue('studentBookId', student?.book?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const student = data?.drivingLicenseBookStudent

  //complete schools with no duplicates
  const completeSchools = [
    ...new Map(
      student?.book?.drivingSchoolExams.map((item) => [
        JSON.stringify(item),
        item,
      ]),
    ).values(),
  ]

  const getExamString = ({
    name,
    examDate,
  }: {
    name: string
    examDate?: string
  }) =>
    `${name}${examDate ? `- ${format(new Date(examDate), 'dd.MM.yyyy')}` : ''}`

  const studentInfo = (s: typeof student) => (
    <>
      <GridRow marginBottom={3}>
        <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
          <Text variant="h4">{formatMessage(m.confirmationSectionName)}</Text>
          <Text variant="default" dataTestId="student-name">
            {s?.name}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
          <Text variant="h4">
            {formatMessage(m.confirmationSectionNationalId)}
          </Text>
          <Text variant="default">
            {s?.nationalId ? kennitala.format(s.nationalId) : ''}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
          <Text variant="h4">
            {formatMessage(m.confirmationSectionCompleteHours)}
          </Text>
          <Text variant="default">{s?.book?.totalLessonCount ?? 0}</Text>
        </GridColumn>
      </GridRow>

      <GridRow marginBottom={5}>
        <GridColumn span={['12/12', '6/12']}>
          <Text variant="h4">
            {formatMessage(m.confirmationSectionCompleteSchools)}
          </Text>
          {completeSchools.length ? (
            completeSchools
              .filter((school, _) => school.status === 2)
              .map((school, key) => {
                console.log(school.status, key)
                const textStr = getExamString({
                  name: school.schoolTypeName,
                  examDate: school.examDate,
                })
                return (
                  <Text key={key} variant="default">
                    {textStr}
                  </Text>
                )
              })
          ) : (
            <Text variant="default">{'-'}</Text>
          )}
        </GridColumn>
      </GridRow>
    </>
  )

  return (
    <GridContainer>
      {!loading && !error && student && Object.entries(student).length > 0 ? (
        studentInfo(student)
      ) : error ? (
        <AlertMessage
          type="error"
          message={formatMessage(m.noStudentInfoFoundMessage)}
        />
      ) : (
        <Skeleton />
      )}
    </GridContainer>
  )
}

export default ViewStudent
