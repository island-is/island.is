import type { FC } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDOB } from '@island.is/judicial-system/formatters'
import RenderPersonalData from '@island.is/judicial-system-web/src/components/InfoCard/RenderPersonalInfo/RenderPersonalInfo'
import { strings as infoCardStrings } from '@island.is/judicial-system-web/src/components/InfoCard/useInfoCardItems.strings'
import type { CivilClaimant } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CivilClaimantInfo.strings'

interface CivilClaimantInfoProps {
  civilClaimant: CivilClaimant
}

export const CivilClaimantInfo: FC<CivilClaimantInfoProps> = (props) => {
  const { civilClaimant } = props
  return (
    <>
      <Box marginBottom={1}>
        <Text as="span" fontWeight="semiBold">
          {`${infoCardStrings.name}: `}
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
              ? `${strings.lawyer}: `
              : `${strings.spokesperson}: `}
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
          >{`${strings.lawyer}: `}</Text>
          <Text as="span">{`${strings.noLawyer}`}</Text>
        </>
      )}
    </>
  )
}
