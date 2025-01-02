import { Box, Button, Table } from '@island.is/island-ui/core'

import { PageCard } from '../../../components/PageCard/PageCard'
import { PaymentHeader } from '../../../components/PaymentHeader/PaymentHeader'

export default function PaymentSuccessPage() {
  return (
    <PageCard
      headerSlot={
        <PaymentHeader
          title="Greiðsla tókst"
          subTitle="Kvittun verður send í pósthólfið"
          type="success"
        />
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
