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
import { CollectionType } from '../../lib/constants'

const SignatureListsParliamentary = () => {
  const { formatMessage } = useLocale()

  const { isOwner, loadingIsOwner } = useIsOwner()
  const { currentCollection, loadingCurrentCollection } =
    useGetCurrentCollection()

  console.log(currentCollection)
  console.log(isOwner)

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescriptionSignee)}
      />
      {currentCollection?.name === CollectionType.Parliamentary &&
      !loadingIsOwner &&
      !loadingCurrentCollection ? (
        <Box>
          {isOwner.success ? (
            <OwnerView currentCollection={currentCollection} />
          ) : (
            <SigneeView currentCollection={currentCollection} />
          )}
        </Box>
      ) : (
        <EmptyState
          title={m.noCollectionIsActive}
          description={m.noCollectionIsActiveDescription}
        />
      )}
    </Box>
  )
}

export default SignatureListsParliamentary
