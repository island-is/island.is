import React, { FC } from 'react'
import { Box, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { Individual } from '../../types'
import { format as formatNationalId } from 'kennitala'
import type { User } from '@island.is/api/domains/national-registry'

type InfoProps = {
  side: Individual
}

export const ApplicationOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const applicant = answers.applicant as Individual
  const spouse = answers.spouse as Individual
  const nationalRegistry = application.externalData.nationalRegistry
    .data as User

  const InfoSection: FC<InfoProps> = ({ side }) => {
    return (
      <Box>
        <Box display="flex" marginBottom={3}>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.name)}</Text>
            <Text>{side.person.name}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.nationalId)}</Text>
            <Text>{formatNationalId(side.person.nationalId)}</Text>
          </Box>
        </Box>
        <Box display="flex">
          <Box width="half">
            <Text variant="h4">{formatMessage(m.phone)}</Text>
            <Text>{side.phone}</Text>
          </Box>
          <Box width="half">
            <Text variant="h4">{formatMessage(m.email)}</Text>
            <Text>{side.email}</Text>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationSpouse1)}
        </Text>
        <InfoSection side={applicant} />
      </Box>
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationSpouse2)}
        </Text>
        <InfoSection side={spouse} />
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Text variant="h3" marginBottom={3}>
          {'Persónuuplýsingar'}
        </Text>
        <Box>
          <Box display="flex" marginBottom={3}>
            <Box width="half">
              <Text variant="h4">{'Lögheimili'}</Text>
              <Text>{(answers.personalInfo as any).address}</Text>
            </Box>
            <Box width="half">
              <Text variant="h4">{'Ríkisfang'}</Text>
              <Text>{(answers.personalInfo as any).citizenship}</Text>
            </Box>
          </Box>
          <Box display="flex">
            <Box width="half">
              <Text variant="h4">{'Hjúskaparstaða fyrir vígslu'}</Text>
              <Text>{(answers.personalInfo as any).maritalStatus}</Text>
            </Box>
            {answers.maritalStatus === 'DIVORCED' ||
              ((answers.fakeData as any).maritalStatus === '6' && (
                <Box width="half">
                  <Text variant="h4">{'Hvernig lauk síðasta hjúskap?'}</Text>
                  <Text>
                    {(answers.personalInfo as any).previousMarriageTermination}
                  </Text>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Text variant="h3" marginBottom={3}>
          {'Vígsla'}
        </Text>
        <Box>
          <Box display="flex" marginBottom={3}>
            <Box width="half">
              <Text variant="h4">{'Áætlaður vígsludagur eða tímabil'}</Text>
              <Text>{(answers.ceremony as any).date}</Text>
            </Box>
          </Box>
          <Box display="flex">
            <Box width="half">
              <Text variant="h4">{'Hvar er vígsla áformuð?'}</Text>
              <Text>{(answers.ceremony as any).ceremonyPlace}</Text>
            </Box>
            <Box width="half">
              <Text variant="h4">{'Embætti sýslumanns'}</Text>
              <Text>
                {(answers.personalInfo as any).previousMarriageTermination}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
