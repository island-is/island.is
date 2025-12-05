import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDOB } from '@island.is/judicial-system/formatters'
import { CivilClaimant } from '@island.is/judicial-system-web/src/graphql/schema'

import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
import { strings as infoCardStrings } from '../useInfoCardItems.strings'
import { strings } from './CivilClaimantInfo.strings'

interface CivilClaimantInfoProps {
  civilClaimant: CivilClaimant
}

export const CivilClaimantInfo: FC<CivilClaimantInfoProps> = (props) => {
  const { civilClaimant } = props
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginBottom={1}>
        <Text as="span" fontWeight="semiBold">
          {`${formatMessage(infoCardStrings.name)}: `}
        </Text>
        <Text as="span">
          {civilClaimant.name}
          {civilClaimant.nationalId &&
            `, ${formatDOB(
              civilClaimant.nationalId,
              civilClaimant.noNationalId,
            )}`}
        </Text>
      </Box>
      {civilClaimant.hasSpokesperson ? (
        <>
          <Text as="span" whiteSpace="pre" fontWeight="semiBold">
            {civilClaimant.spokespersonIsLawyer
              ? `${formatMessage(strings.lawyer)}: `
              : `${formatMessage(strings.spokesperson)}: `}
          </Text>
          {RenderPersonalData({
            name: civilClaimant.spokespersonName,
            email: civilClaimant.spokespersonEmail,
            phoneNumber: civilClaimant.spokespersonPhoneNumber,
            breakSpaces: false,
          })}
        </>
      ) : (
        <>
          <Text
            as="span"
            whiteSpace="pre"
            fontWeight="semiBold"
          >{`${formatMessage(strings.lawyer)}: `}</Text>
          <Text as="span">{`${formatMessage(strings.noLawyer)}`}</Text>
        </>
      )}
    </>
  )
}
