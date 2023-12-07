import { ActionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { SignatureCollectionPaths } from '../../lib/paths'
import CancelCollection from './cancelCollection'
import { useGetOwnerLists } from '../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../Skeletons'
import { useNavigate } from 'react-router-dom'

const OwnerView = () => {
  useNamespaces('sp.signatureCollection')
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const { ownerLists, loadingLists } = useGetOwnerLists()

  return (
    <>
      {!loadingLists ? (
        <Box>
          <Box marginTop={10}>
            <Text variant="h4" marginBottom={3}>
              {formatMessage(m.myListsHeader)}
            </Text>
            <Stack space={5}>
              {ownerLists.map((list) => {
                return (
                  <ActionCard
                    backgroundColor="white"
                    heading={list.owner.name + ' - ' + list.area.name}
                    eyebrow={format(new Date(list.endTime), 'dd.MM.yyyy')}
                    text={formatMessage(m.collectionTitle)}
                    cta={{
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
                    }}
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
          <CancelCollection />
        </Box>
      ) : (
        <Skeleton />
      )}
    </>
  )
}

export default OwnerView
