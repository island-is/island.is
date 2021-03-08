// Mockup of a payment flow.
// Not production code.

import * as React from 'react'
import { Box } from '../Box/Box'
import { CreditCardSelector } from '../CreditCardSelector/CreditCardSelector'
import * as styles from './PaymentFlow.treat'
import { Logo } from '../Logo/Logo'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'
import { Checkbox } from '../Checkbox/Checkbox'
import Table from '../Table'

const myCards = [
  {
    cardType: 'Mastercard' as const,
    lastFourDigits: '1337',
    active: true,
  },
  {
    cardType: 'Visa' as const,
    lastFourDigits: '1234',
    active: false,
  },
]

interface PaymentFlowProps {
  heading?: string
  subheading?: string
  renderButtons?: React.ReactNode
}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  heading,
  subheading,
  renderButtons,
  children,
}) => (
  <Box display="flex" justifyContent="center" alignItems="center">
    <Box
      className={styles.frame}
      background="blueberry100"
      borderWidth="standard"
      borderColor="blueberry200"
      borderRadius="standard"
      paddingY={6}
      paddingX={[4, 6, 8, 12]}
    >
      <Box paddingX={3}>
        <Box display="flex" justifyContent="center" paddingBottom={[4, 6, 8]}>
          <Logo iconOnly width={64} height={64} />
        </Box>
      </Box>
      {heading && (
        <Box textAlign="center" paddingBottom={1}>
          <Text as="h1">{heading}</Text>
        </Box>
      )}
      {subheading && (
        <Box textAlign="center" paddingBottom={4}>
          <Text as="h2" variant="h1">
            {subheading}
          </Text>
        </Box>
      )}
      {children}
      {renderButtons}
    </Box>
  </Box>
)

export const frames = {
  ChooseCard: () => (
    <PaymentFlow
      heading="Ökuskírteini"
      subheading="8.990 kr."
      renderButtons={
        <Box textAlign="center" paddingY={2}>
          <Button fluid variant="text">
            Hætta við
          </Button>
        </Box>
      }
    >
      <CreditCardSelector availableCards={myCards} />
      <Box paddingY={2}>
        <Button fluid>Greiða</Button>
      </Box>
    </PaymentFlow>
  ),
  NewCard: () => (
    <PaymentFlow
      heading="Ökuskírteini"
      subheading="8.990 kr."
      renderButtons={
        <>
          <Box paddingY={2}>
            <Button fluid>Greiða</Button>
          </Box>
          <Box textAlign="center" paddingY={2}>
            <Button fluid variant="text">
              Hætta við
            </Button>
          </Box>
        </>
      }
    >
      <Box marginBottom={2}>
        <Input
          size="sm"
          label="Nafn korthafa"
          placeholder="Nafnið þitt"
          name="nafn"
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          size="sm"
          label="Kortanúmer"
          placeholder="Kortanúmerið þitt"
          name="kortanumer"
          type="number"
        />
      </Box>
      <Box marginBottom={[4, 4, 8]}>
        <Box display="flex" marginBottom={2}>
          <Box marginRight={1}>
            <Input
              size="sm"
              label="CVC"
              placeholder="Öryggiskóði"
              name="cvc"
              maxLength={3}
            />
          </Box>
          <Box marginLeft={1}>
            <Input
              size="sm"
              label="Gildistími"
              placeholder="00/00"
              name="gildistimi"
              value="01/21"
              hasError
              errorMessage="Þetta kort er útrunnið"
            />
          </Box>
        </Box>
        <Checkbox label="Vista greiðslukort" name="vista" />
      </Box>
    </PaymentFlow>
  ),
  Success: () => (
    <PaymentFlow
      heading="Greiðsla tókst"
      subheading="8.990 kr."
      renderButtons={
        <Box textAlign="center" paddingY={2}>
          <Button fluid>Til baka</Button>
        </Box>
      }
    >
      <Box
        marginBottom={2}
        background="white"
        borderWidth="standard"
        borderColor="blue200"
        borderRadius="standard"
        padding={3}
      >
        <Table.Table>
          <Table.Body>
            <Table.Row>
              <Table.Data>
                <strong>Skýring</strong>
              </Table.Data>
              <Table.Data>Ökuskírteini</Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data>
                <strong>Heimild</strong>
              </Table.Data>
              <Table.Data>123456</Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data>
                <strong>Greiðslutími</strong>
              </Table.Data>
              <Table.Data>17. feb. 2021 kl. 11:17:23</Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data borderColor="transparent">
                <strong>Færslunúmer</strong>
              </Table.Data>
              <Table.Data borderColor="transparent">
                2021-17-1502113-828
              </Table.Data>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </Box>
    </PaymentFlow>
  ),
}
