import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  IntroWrapper,
  STAFRAEN_HEILSA_SLUG,
  useIsPhoneWidth,
} from '@island.is/portals/my-pages/core'
import { ReactNode } from 'react'
import { messages } from '../../../lib/messages'
import { useTreatmentScopedPaths } from '../../../utils/useTreatmentScopedPaths'

interface Props {
  children: ReactNode
}

export const ConversationDetailLayout = ({ children }: Props) => {
  const { formatMessage } = useLocale()
  const { isPhoneWidth } = useIsPhoneWidth()
  const { treatmentId } = useTreatmentScopedPaths()

  // Phones get the full-screen thread, so the treatment heading is skipped there
  if (treatmentId && !isPhoneWidth) {
    return (
      <IntroWrapper
        title={formatMessage(messages.treatmentMessagesFromTeam)}
        intro={formatMessage(messages.treatmentConversationsIntro)}
        serviceProvider={{
          slug: STAFRAEN_HEILSA_SLUG,
          tooltip: formatMessage(messages.stafraenHeilsaTreatmentTooltip),
        }}
        desktopContentSpan="10/12"
      >
        {children}
      </IntroWrapper>
    )
  }

  return (
    <GridContainer>
      <GridRow marginTop={[1, 0, 0]}>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          {children}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ConversationDetailLayout
