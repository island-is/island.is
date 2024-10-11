import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDOB } from '@island.is/judicial-system/formatters'
import { CivilClaimant } from '@island.is/judicial-system-web/src/graphql/schema'

import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'
import { strings } from './CivilClaimantInfo.strings'

interface CivilClaimantInfoProps {
  civilClaimant: CivilClaimant
}

export const CivilClaimantInfo: FC<CivilClaimantInfoProps> = (props) => {
  const { civilClaimant } = props
  const { formatMessage } = useIntl()

  return (
    <Box>
      <Text as="span" fontWeight="semiBold">
        {civilClaimant.name}
        {civilClaimant.nationalId &&
          `, ${formatDOB(
            civilClaimant.nationalId,
            civilClaimant.noNationalId,
          )}`}
      </Text>
      {civilClaimant.hasSpokesperson ? (
        <Box display={['block', 'block', 'block', 'flex']}>
          <Text as="span" whiteSpace="pre">
            {civilClaimant.spokespersonIsLawyer
              ? `${formatMessage(strings.lawyer)}: `
              : `${formatMessage(strings.spokesperson)}: `}
          </Text>
          {RenderPersonalData(
            civilClaimant.spokespersonName,
            civilClaimant.spokespersonEmail,
            civilClaimant.spokespersonPhoneNumber,
            false,
          )}
        </Box>
      ) : (
        <Text>{`${formatMessage(strings.lawyer)}: ${formatMessage(
          strings.noLawyer,
        )}`}</Text>
      )}
    </Box>
  )
}
