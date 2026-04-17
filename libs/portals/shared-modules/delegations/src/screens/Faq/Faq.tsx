import { Box } from '@island.is/island-ui/core'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { useLocale, useNamespaces } from '@island.is/localization'

import {
  IntroHeader,
  useGetServicePortalPageQuery,
} from '@island.is/portals/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { isCompany } from '@island.is/shared/utils'
import { m } from '../../lib/messages'

const Faq = () => {
  useNamespaces(['sp.access-control-delegations'])
  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
  const { data: contentfulQueryData } = useGetServicePortalPageQuery({
    variables: { input: { slug: 'umbod/faq', lang } },
  })
  const contentfulData = contentfulQueryData?.getServicePortalPage
  const faqList =
    (isCompany(userInfo) && contentfulData?.faqListCompany) ||
    contentfulData?.faqList

  return (
    <Box>
      <IntroHeader title={formatMessage(m.faq)} />
      {faqList && faqList.questions.length > 0 && (
        <FaqList {...(faqList as unknown as FaqListProps)} />
      )}
    </Box>
  )
}

export default Faq
