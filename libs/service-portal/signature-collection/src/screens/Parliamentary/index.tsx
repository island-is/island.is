import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyState,
  IntroHeader,
  THJODSKRA_SLUG,
} from '@island.is/service-portal/core'
import { m } from '../../lib/messages'
import OwnerView from './OwnerView'
import SigneeView from './SigneeView'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'
import { Skeleton } from '../../skeletons'

const SignatureListsParliamentary = () => {
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescriptionSignee)}
        serviceProviderTooltip={formatMessage(m.infoProviderTooltip)}
        serviceProviderSlug={THJODSKRA_SLUG}
      />
      {!loadingIsOwner && !loadingCurrentCollection ? (
        <Box>
          {!currentCollection?.isPresidential ? (
            isOwner.success ? (
              <OwnerView currentCollection={currentCollection} />
            ) : (
              <SigneeView currentCollection={currentCollection} />
            )
          ) : (
            <EmptyState
              title={m.noCollectionIsActive}
              description={m.noCollectionIsActiveDescription}
            />
          )}
        </Box>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default SignatureListsParliamentary
