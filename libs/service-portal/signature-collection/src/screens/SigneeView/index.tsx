import {
  ActionCard,
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/service-portal/core'
import {
  useGetCurrentCollection,
  useGetListsForUser,
  useGetSignedList,
} from '../../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../skeletons'
import SignedList from '../../components/SignedList'
import { useAuth } from '@island.is/auth/react'

const SigneeView = () => {
  useNamespaces('sp.signatureCollection')
  const { userInfo: user } = useAuth()

  const { formatMessage } = useLocale()
  const { currentCollection } = useGetCurrentCollection()
  const { signedLists, loadingSignedLists } = useGetSignedList()
  const { listsForUser, loadingUserLists } = useGetListsForUser()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescriptionSignee)}
      />
      {!user?.profile.actor && !loadingSignedLists && !loadingUserLists ? (
        <Box>
          {currentCollection?.isActive && (
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
            {/* Signed list */}
            <SignedList />

            {/* Other available lists */}
            <Box marginTop={[5, 10]}>
              {listsForUser.length > 0 && (
                <Text marginBottom={2}>
                  {formatMessage(m.mySigneeListsByAreaHeader)}
                </Text>
              )}

              <Stack space={5}>
                {listsForUser?.map((list) => {
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
                        new Date(list.endTime) > new Date() && !list.maxReached
                          ? {
                              label: formatMessage(m.signList),
                              variant: 'text',
                              icon: 'arrowForward',
                              disabled: !!signedLists.length,
                              onClick: () => {
                                window.open(
                                  `${document.location.origin}${list.slug}`,
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
                          : list.maxReached
                          ? {
                              label: formatMessage(m.collectionMaxReached),
                              variant: 'red',
                              outlined: true,
                            }
                          : undefined
                      }
                    />
                  )
                })}
              </Stack>
            </Box>
          </Box>
        </Box>
      ) : user?.profile.actor ? (
        <AlertMessage
          type="warning"
          title={formatMessage(m.actorNoAccessTitle)}
          message={m.actorNoAccessDescription.defaultMessage}
        />
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default SigneeView
