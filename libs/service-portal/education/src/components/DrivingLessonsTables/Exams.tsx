import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { DrivingLicenceTestResult } from '@island.is/api/schema'
import { vehicleMessage as messages } from '@island.is/service-portal/assets/messages'
import { formatDate } from '@island.is/service-portal/core'

interface PropTypes {
  data: DrivingLicenceTestResult[]
  title: string
}

const Exams = ({ data, title }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4} marginTop="containerGutter">
      <Text variant="h4" fontWeight="semiBold" paddingBottom={2}>
        {title}
      </Text>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.date)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.vehicleDrivingLessonsExam)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.vehicleDrivingLessonsHasPassed)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {data?.map((exam: DrivingLicenceTestResult | null, index: number) => {
            return (
              <T.Row key={index + 'driving lessons exams result table'}>
                <T.Data>
                  <Text variant="medium">
                    {exam?.examDate && formatDate(exam.examDate)}
                  </Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{exam?.testTypeName}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">
                    {exam?.hasPassed
                      ? formatMessage(messages.yes)
                      : formatMessage(messages.no)}
                  </Text>
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default Exams
