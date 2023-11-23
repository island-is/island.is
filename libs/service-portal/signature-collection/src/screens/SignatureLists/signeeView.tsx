import { ActionCard, Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { mockLists } from '../../lib/utils'
import { Modal } from '@island.is/service-portal/core'
import { useState } from 'react'

const SigneeView = () => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const SignedList = () => {
    return (
      <Modal
        id="cancelCollection"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        disclosure={
          <ActionCard
            backgroundColor="blue"
            heading={mockLists[0].name}
            eyebrow="Lokadagur: 15.05.2024"
            text={formatMessage(m.collectionTitle)}
            cta={{
              label: formatMessage(m.unSignList),
              buttonType: {
                variant: 'text',
                colorScheme: 'destructive',
              },
              onClick: () => setModalIsOpen(true),
              icon: undefined,
            }}
          />
        }
      >
        <Text variant="h1" paddingTop={5}>
          {formatMessage(m.unSignModalMessage)}
        </Text>
        <Box marginTop={10} display="flex" justifyContent="center">
          <Button onClick={() => setModalIsOpen(false)}>
            {formatMessage(m.unSignModalConfirmButton)}
          </Button>
        </Box>
      </Modal>
    )
  }

  return (
    <Box>
      <Box marginTop={10}>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(m.mySigneeListsHeader)}
        </Text>
        <SignedList />
      </Box>

      <Box marginTop={10}>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(m.mySigneeListsHeader)}
        </Text>
        <Stack space={5}>
          {mockLists.map((list) => {
            return (
              <ActionCard
                backgroundColor="white"
                heading={list.name}
                eyebrow="Lokadagur: 15.05.2024"
                text={formatMessage(m.collectionTitle)}
                cta={{
                  label: formatMessage(m.signList),
                  variant: 'text',
                  icon: 'arrowForward',
                  disabled: true,
                  onClick: () => {
                    window.open(
                      `${document.location.origin}/umsoknir/maela-med-lista/`,
                    )
                  },
                }}
              />
            )
          })}
        </Stack>
      </Box>
    </Box>
  )
}

export default SigneeView
