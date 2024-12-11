import { Box, Button, Icon, Table, Text } from '@island.is/island-ui/core'

import { PageCard } from '../../../components/PageCard/PageCard'

export default function PaymentSuccessPage() {
  return (
    <PageCard
      headerColorScheme="success"
      headerSlot={
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          rowGap={[0, 1]}
        >
          <Icon
            type="filled"
            icon="checkmarkCircle"
            color="mint400"
            size="large"
          />
          <Text variant="h3">Krafa stofnuð</Text>
          <Text>
            [Einhver texti um að krafa hafi verið stofnuð og mögulega send í
            netbanka]
          </Text>
        </Box>
      }
      bodySlot={
        <>
          <Table.Table>
            <Table.Body>
              <Table.Row>
                <Table.Data style={{ fontWeight: 600 }}>Upphæð</Table.Data>
                <Table.Data>14.000 kr.</Table.Data>
              </Table.Row>
              <Table.Row>
                <Table.Data style={{ fontWeight: 600 }}>Vara</Table.Data>
                <Table.Data>Vegabréf, almennt</Table.Data>
              </Table.Row>
              <Table.Row>
                <Table.Data style={{ fontWeight: 600 }}>Kennitala</Table.Data>
                <Table.Data>010130ö2399</Table.Data>
              </Table.Row>
              <Table.Row>
                <Table.Data style={{ fontWeight: 600 }}>Nafn</Table.Data>
                <Table.Data>Gervimaður Færeyjar</Table.Data>
              </Table.Row>
            </Table.Body>
          </Table.Table>
          <Box marginTop={4} width="full">
            <Button fluid>Ljúka</Button>
          </Box>
        </>
      }
    />
  )
}
