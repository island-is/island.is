import {
  ActionCard,
  Box,
  Button,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { SignatureCollectionPaths } from '../../lib/paths'
import { IntroHeader } from '@island.is/service-portal/core'
import CancelCollection from './CancelCollection'
import { useGetListsForUser } from '../../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../skeletons'
import { useNavigate } from 'react-router-dom'
import copyToClipboard from 'copy-to-clipboard'

const CandidateView = () => {
  useNamespaces('sp.signatureCollection')
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const { listsForUser, loadingUserLists } = useGetListsForUser()
  const collectionId = listsForUser[0]?.collectionId

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescription)}
      />
      {!loadingUserLists ? (
        <Box>
          {listsForUser.length === 0 && (
            <Button
              icon="open"
              iconType="outline"
              onClick={() =>
                window.open(
                  `${document.location.origin}/umsoknir/medmaelasofnun/`,
                )
              }
              size="small"
            >
              {formatMessage(m.createListButton)}
            </Button>
          )}
          <Box marginTop={[2, 7]}>
            <Text variant="h4" marginBottom={2}>
              {formatMessage(m.collectionTitle)}
            </Text>
            <Box
              background="purple100"
              borderRadius="large"
              display={['block', 'flex', 'flex']}
              justifyContent="spaceBetween"
              alignItems="center"
              padding={3}
            >
              <Box marginHeight={5}>
                <Text marginBottom={[2, 0, 0]}>
                  {formatMessage(m.copyLinkDescription)}
                </Text>
              </Box>
              <Button
                onClick={() => {
                  const copied = copyToClipboard(
                    `${document.location.origin}/umsoknir/maela-med-frambodi/?candidate=${collectionId}`,
                  )
                  if (!copied) {
                    return toast.error(formatMessage(m.copyLinkError))
                  }
                  toast.success(formatMessage(m.copyLinkSuccess))
                }}
                variant="utility"
                icon="link"
              >
                {formatMessage(m.copyLinkButton)}
              </Button>
            </Box>
            <Text marginTop={5} marginBottom={2}>
              {formatMessage(m.myListsDescription)}
            </Text>
            <Stack space={[3, 5]}>
              {listsForUser.map((list) => {
                return (
                  <ActionCard
                    key={list.id}
                    backgroundColor="white"
                    heading={list.title}
                    eyebrow={
                      formatMessage(m.endTime) +
                      ' ' +
                      format(new Date(list.endTime), 'dd.MM.yyyy')
                    }
                    text={formatMessage(m.collectionTitle)}
                    cta={
                      new Date(list.endTime) > new Date()
                        ? {
                            label: formatMessage(m.viewList),
                            variant: 'text',
                            icon: 'arrowForward',
                            onClick: () => {
                              navigate(
                                SignatureCollectionPaths.ViewList.replace(
                                  ':id',
                                  list.id,
                                ),
                              )
                            },
                          }
                        : undefined
                    }
                    tag={
                      new Date(list.endTime) < new Date()
                        ? {
                            label: formatMessage(m.collectionClosed),
                            variant: 'red',
                            outlined: true,
                          }
                        : undefined
                    }
                    progressMeter={{
                      currentProgress: Number(list.numberOfSignatures),
                      maxProgress: list.area.min,
                      withLabel: true,
                    }}
                  />
                )
              })}
            </Stack>
          </Box>
          {listsForUser.length > 0 && (
            <CancelCollection collectionId={collectionId} />
          )}
        </Box>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default CandidateView
