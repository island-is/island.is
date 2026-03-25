import { useLoaderData } from 'react-router-dom'

import { Box } from '@island.is/island-ui/core'
import { FaqList, FaqListProps } from '@island.is/island-ui/contentful'
import { useLocale, useNamespaces } from '@island.is/localization'

import { AccessControlLoaderResponse } from '../AccessControl.loader'
import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'

const Faq = () => {
  useNamespaces(['sp.access-control-delegations'])
  const contentfulData = useLoaderData() as AccessControlLoaderResponse
  const { formatMessage } = useLocale()

  return (
    <Box>
      <IntroHeader title={formatMessage(m.faq)} />
      {contentfulData?.faqList && (
        <FaqList {...(contentfulData.faqList as unknown as FaqListProps)} />
      )}
    </Box>
  )
}

export default Faq
