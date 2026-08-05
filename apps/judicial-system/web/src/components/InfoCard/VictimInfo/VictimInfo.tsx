import { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import { formatDOB } from '@island.is/judicial-system/formatters'
import { Victim } from '@island.is/judicial-system-web/src/graphql/schema'

import RenderPersonalData from '../RenderPersonalInfo/RenderPersonalInfo'

interface VictimInfoProps {
  victim: Victim
}

export const VictimInfo: FC<VictimInfoProps> = (props) => {
  const { victim } = props

  return (
    <>
      <Text>
        <Text as="span" fontWeight="semiBold">
          {'Nafn: '}
        </Text>
        <Text as="span">
          {victim.name}
          {victim.nationalId &&
            `, ${formatDOB(victim.nationalId, !victim.hasNationalId)}`}
        </Text>
      </Text>
      <Text>
        <Text as="span" whiteSpace="pre" fontWeight="semiBold">
          {'Réttargæslumaður: '}
        </Text>
        {victim.lawyerName ? (
          RenderPersonalData({
            name: victim.lawyerName,
            email: victim.lawyerEmail,
            phoneNumber: victim.lawyerPhoneNumber,
            breakSpaces: false,
          })
        ) : (
          <Text as="span">Hefur ekki verið skráður</Text>
        )}
      </Text>
    </>
  )
}
