import { ActionCard, Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { IntroHeader } from '@island.is/service-portal/core'
import { useGetListsForUser, useGetSignedList } from '../../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../skeletons'
import SignedList from '../../components/SignedList'

const SigneeView = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const { signedList, loadingSignedList } = useGetSignedList()
  const { listsForUser, loadingUserLists } = useGetListsForUser()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescriptionSignee)}
      />
      {!loadingSignedList && !loadingUserLists ? (
        <Box>
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
                              disabled: signedList !== null,
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
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default SigneeView
