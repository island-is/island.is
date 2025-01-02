import { Box, Button, Table } from '@island.is/island-ui/core'

import { PageCard } from '../../../components/PageCard/PageCard'
import { PaymentHeader } from '../../../components/PaymentHeader/PaymentHeader'

export default function PaymentSuccessPage() {
  return (
    <PageCard
      headerSlot={
        <PaymentHeader
          title="Krafa stofnuð"
          subTitle="[Einhver texti um að krafa hafi verið stofnuð og mögulega send í netbanka]"
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
