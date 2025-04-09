import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  IntroWrapper,
  THJODSKRA_SLUG,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import OwnerView from './OwnerView'
import SigneeView from '../shared/SigneeView'
import { useGetCurrentCollection, useIsOwner } from '../../hooks'
import { useUserInfo } from '@island.is/react-spa/bff'
import { AuthDelegationType } from '@island.is/shared/types'

const SignatureListsParliamentary = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner, refetchIsOwner } = useIsOwner()
  const userInfo = useUserInfo()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  return (
    <Box>
      <IntroWrapper
        title={formatMessage(m.pageTitleParliamentary)}
        intro={formatMessage(m.pageDescriptionSignee)}
        serviceProviderTooltip={formatMessage(m.infoProviderTooltip)}
        serviceProviderSlug={THJODSKRA_SLUG}
      />
      {!loadingIsOwner && !loadingCurrentCollection && (
        <Box>
          {!currentCollection?.isPresidential ? (
            isOwner.success ? (
              <OwnerView
                refetchIsOwner={refetchIsOwner}
                currentCollection={currentCollection}
                isListHolder={
                  !userInfo?.profile?.delegationType ||
                  userInfo?.profile?.delegationType?.includes(
                    AuthDelegationType.ProcurationHolder,
                  )
                }
              />
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
      )}
    </Box>
  )
}

export default SignatureListsParliamentary
