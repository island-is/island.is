import React, { FC } from 'react'
import { Box, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { Ceremony, Individual, PersonalInfo } from '../../types'
import { format as formatNationalId } from 'kennitala'
import format from 'date-fns/format'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { CeremonyPlaces, States } from '../../lib/constants'
import is from 'date-fns/locale/is'
import { YES } from '@island.is/application/core'

type InfoProps = {
  side: Individual
}

export const ApplicationOverview: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers } = application
  const applicant = answers.applicant as Individual
  const spouse = answers.spouse as Individual
  const witness1 = answers.witness1 as Individual
  const witness2 = answers.witness2 as Individual
  const ceremony = answers.ceremony as Ceremony

  const InfoSection: FC<React.PropsWithChildren<InfoProps>> = ({ side }) => {
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
            <Text>{formatPhoneNumber(removeCountryCode(side.phone))}</Text>
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
          {formatMessage(m.personalInformationTitle)}
        </Text>
        <Box>
          <Box display="flex" marginBottom={3}>
            <Box width="half">
              <Text variant="h4">{formatMessage(m.address)}</Text>
              <Text>
                {application.state === States.SPOUSE_CONFIRM
                  ? (answers.spousePersonalInfo as PersonalInfo).address
                  : (answers.personalInfo as PersonalInfo).address}
              </Text>
            </Box>
            <Box width="half">
              <Text variant="h4">{formatMessage(m.citizenship)}</Text>
              <Text>
                {application.state === States.SPOUSE_CONFIRM
                  ? (answers.spousePersonalInfo as PersonalInfo).citizenship
                  : (answers.personalInfo as PersonalInfo).citizenship}
              </Text>
            </Box>
          </Box>
          <Box display="flex">
            <Box width="half">
              <Text variant="h4">{formatMessage(m.maritalStatus)}</Text>
              <Text>
                {application.state === States.SPOUSE_CONFIRM
                  ? (answers.spousePersonalInfo as PersonalInfo).maritalStatus
                  : (answers.personalInfo as PersonalInfo).maritalStatus}
              </Text>
            </Box>
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
          {formatMessage(m.ceremony)}
        </Text>
        {ceremony.hasDate === YES ? (
          <Box marginTop={3}>
            <Box display="flex" marginBottom={3}>
              <Box width="half">
                <Text variant="h4">{formatMessage(m.ceremonyDate)}</Text>
                <Text>
                  {format(new Date(ceremony.date), 'dd. MMMM, yyyy', {
                    locale: is,
                  }).toLowerCase()}
                </Text>
              </Box>
            </Box>
            <Box display="flex">
              <Box width="half">
                <Text variant="h4">{formatMessage(m.ceremonyPlace)}</Text>
                {ceremony.place.ceremonyPlace === CeremonyPlaces.office ? (
                  <Text>{ceremony.place.office}</Text>
                ) : ceremony.place.ceremonyPlace === CeremonyPlaces.society ? (
                  <Text>{ceremony.place.society}</Text>
                ) : (
                  <Text>{formatMessage(m.ceremonyPlaceNone)}</Text>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <>
            <Text variant="h4">{formatMessage(m.ceremonyPeriod)}</Text>
            <Text variant="default">
              {format(new Date(ceremony.period.dateFrom), 'dd. MMMM, yyyy', {
                locale: is,
              }).toLowerCase() +
                ' - ' +
                format(new Date(ceremony.period.dateTo), 'dd. MMMM, yyyy', {
                  locale: is,
                }).toLowerCase()}
            </Text>
          </>
        )}
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationWitness1)}
        </Text>
        <InfoSection side={witness1} />
      </Box>
      <Box marginTop={4}>
        <Text variant="h3" marginBottom={3}>
          {formatMessage(m.informationWitness2)}
        </Text>
        <InfoSection side={witness2} />
      </Box>
      <Box marginTop={5}>
        <Box paddingBottom={4}>
          <Divider />
        </Box>
      </Box>
      <Box>
        <Text>{formatMessage(m.overviewFooterText)}</Text>
      </Box>
    </>
  )
}
