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
          rowGap={[0, 1]}
        >
          <Icon
            type="filled"
            icon="checkmarkCircle"
            color="mint400"
            size="large"
          />
          <Text variant="h3">Greiðsla tókst</Text>
          <Text>Kvittun verður send í pósthólfið</Text>
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
                <Table.Data style={{ fontWeight: 600 }}>Heimild</Table.Data>
                <Table.Data>TODO?</Table.Data>
              </Table.Row>
              <Table.Row>
                <Table.Data style={{ fontWeight: 600 }}>
                  Greiðslutími
                </Table.Data>
                <Table.Data>TODO?</Table.Data>
              </Table.Row>
              <Table.Row>
                <Table.Data style={{ fontWeight: 600 }}>Færslunúmer</Table.Data>
                <Table.Data>TODO?</Table.Data>
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
