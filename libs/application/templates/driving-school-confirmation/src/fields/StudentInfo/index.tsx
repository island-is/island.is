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
import { FieldBaseProps } from '@island.is/application/core'
import { useQuery } from '@apollo/client'
import { ViewSingleStudentQuery } from '../../graphql/queries'
import { useFormContext } from 'react-hook-form'
import kennitala from 'kennitala'
import { Student } from '../../types'

const ViewStudent: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const { data, loading, error } = useQuery(ViewSingleStudentQuery, {
    variables: {
      input: {
        nationalId: (application.answers.student as Student).nationalId,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    if (data) {
      setValue('studentBookTypes', student.book?.drivingSchoolExams)
      setValue('studentBookId', student.book?.id)
    }
  }, [data])

  const student = data?.drivingLicenseBookStudent

  //complete schools with no duplicates
  const completeSchools = [
    ...new Map(
      student?.book?.drivingSchoolExams.map((item: any) => [
        JSON.stringify(item),
        item,
      ]),
    ).values(),
  ]

  return (
    <GridContainer>
      {!loading && !error && Object.entries(student).length > 0 ? (
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
              <Text variant="default">
                {kennitala.format(student.nationalId)}
              </Text>
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
              {completeSchools.length ? (
                completeSchools.map((school: any, key: any) => {
                  return (
                    <Text key={key} variant="default">
                      {school.schoolTypeName}
                    </Text>
                  )
                })
              ) : (
                <Text variant="default">{'-'}</Text>
              )}
            </GridColumn>
          </GridRow>
        </>
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
