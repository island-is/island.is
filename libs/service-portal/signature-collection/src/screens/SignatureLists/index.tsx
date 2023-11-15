import {
  ActionCard,
  Box,
  Button,
  GridColumn,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import { SignatureCollectionPaths } from '../../lib/paths'
import { LinkResolver, Modal } from '@island.is/service-portal/core'
import { mockLists } from '../../lib/utils'
import { useState } from 'react'

const SignatureLists = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { formatMessage } = useLocale()

  return (
    <Box>
      <IntroHeader
        title={formatMessage(m.pageTitle)}
        intro={formatMessage(m.pageDescription)}
      >
        {mockLists.length === 0 && (
          <GridColumn span={['8/8', '3/8']}>
            <Box
              display={'flex'}
              justifyContent={['flexStart', 'flexEnd']}
              paddingTop={[2]}
            >
              <Button
                icon="open"
                iconType="outline"
                onClick={() =>
                  window.open(
                    `${document.location.origin}/umsoknir/medmaelalisti/`,
                  )
                }
                size="small"
              >
                {formatMessage(m.createListButton)}
              </Button>
            </Box>
          </GridColumn>
        )}
      </IntroHeader>
      <Box marginTop={10}>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(m.myListsHeader)}
        </Text>
        <Stack space={5}>
          {mockLists.map((list) => {
            return (
              <LinkResolver
                key={list.id}
                href={SignatureCollectionPaths.ViewList.replace(
                  ':listId',
                  list.id,
                )}
              >
                <ActionCard
                  backgroundColor="white"
                  heading={list.name}
                  eyebrow="Lokadagur: 15.05.2024"
                  text={formatMessage(m.collectionTitle)}
                  cta={{
                    label: formatMessage(m.viewList),
                    variant: 'text',
                    icon: 'arrowForward',
                  }}
                  progressMeter={{
                    currentProgress: list.progress,
                    maxProgress: 350,
                    withLabel: true,
                  }}
                />
              </LinkResolver>
            )
          })}
        </Stack>
      </Box>
      <Box marginTop={10} display={'flex'} justifyContent={'center'}>
        <Modal
          id="cancelCollection"
          isVisible={modalIsOpen}
          toggleClose={false}
          initialVisibility={false}
          disclosure={
            <Button
              variant="ghost"
              size="small"
              onClick={() => setModalIsOpen(true)}
            >
              {formatMessage(m.cancelCollectionButton)}
            </Button>
          }
        >
          <Text variant="h1" paddingTop={5}>
            {formatMessage(m.modalMessage)}
          </Text>
          <Box marginTop={10} display="flex" justifyContent="center">
            <Button onClick={() => setModalIsOpen(false)}>
              {formatMessage(m.modalConfirmButton)}
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  )
}

export default SignatureLists
