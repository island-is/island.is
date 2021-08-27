import React, { FC } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useWatch } from 'react-hook-form'
import {
  CustomField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as kennitala from 'kennitala'
import { m } from '../lib/messages'

const QUERY = gql`
  query teacherInfo($nationalId: String!) {
    drivingLicenseTeacherInformation(nationalId: $nationalId) {
      teacher {
        name
      }
    }
  }
`

interface Props extends FieldBaseProps {
  field: CustomField
}

interface ExpectedTeacher {
  nationalId: string
}

export const TeacherLookupField: FC<Props> = ({ error, application }) => {
  const teacher = (application.externalData
    .teacher as unknown) as ExpectedTeacher

  const teacherNationalId = useWatch({
    name: 'teacher.nationalId',
    // FYI the watch value is not queried unless the value changes after rendering.
    // see react hook form's docs for useWatch for further info.
    defaultValue: teacher.nationalId,
  })

  const { formatMessage } = useLocale()

  const { data = {}, error: queryError, loading } = useQuery(QUERY, {
    skip:
      !teacherNationalId || !kennitala.isPerson(teacherNationalId as string),
    variables: {
      nationalId: teacherNationalId,
    },
  })

  if (queryError) {
    return <Text>Villa kom upp við að sækja upplýsingar um nemanda</Text>
  }

  if (loading) {
    return <Text>Sæki upplýsingar um nemanda... </Text>
  }

  if (!data?.drivingLicenseTeacherInformation) {
    return null
  }

  const result = data.drivingLicenseTeacherInformation

  return (
    <>
      {error && { error }}

      <Box>
        <Text variant="h4">
          {formatText(m.informationTeacher, application, formatMessage)}
        </Text>
        <Text>{result.teacher?.name ?? teacherNationalId}</Text>
      </Box>
    </>
  )
}
