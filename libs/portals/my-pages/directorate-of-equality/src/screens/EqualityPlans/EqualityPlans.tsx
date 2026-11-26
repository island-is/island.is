import { ApiScope } from '@island.is/auth/scopes'
import { DirectorateOfEqualitySubmissionType } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  JAFNRETTISSTOFA_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'

import { PageIntro } from '../../components/PageIntro/PageIntro'
import { SubmissionsList } from '../../components/SubmissionsList/SubmissionsList'
import { NAMESPACE } from '../../lib/constants'
import { messages } from '../../lib/messages'

const EqualityPlans = () => {
  useNamespaces(NAMESPACE)
  const { formatMessage } = useLocale()
  const { scopes } = useUserInfo()

  return (
    <IntroWrapper
      desktopContentSpan="10/12"
      title={formatMessage(coreMessages.equalityPlans)}
      introComponent={
        <PageIntro
          intro={formatMessage(messages.plansIntro)}
          link={{
            href: formatMessage(messages.plansLinkUrl),
            text: formatMessage(messages.plansLinkText),
          }}
        />
      }
      serviceProvider={{
        slug: JAFNRETTISSTOFA_SLUG,
        tooltip: formatMessage(coreMessages.equalityTooltip),
      }}
    >
      <Box marginTop={2}>
        <SubmissionsList
          type={DirectorateOfEqualitySubmissionType.EQUALITY_PLAN}
          hasAccess={scopes.includes(ApiScope.directorateOfEquality)}
        />
      </Box>
    </IntroWrapper>
  )
}

export default EqualityPlans
