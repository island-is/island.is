import * as React from 'react'
import cn from 'classnames'
import { Box } from '../Box/Box'
import { CreditCardSelector } from '../CreditCardSelector/CreditCardSelector'
import * as styles from './PaymentFlow.treat'
import { Logo } from '../Logo/Logo'
import { Text } from '../Text/Text'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'
import { Checkbox } from '../Checkbox/Checkbox'
import Table from '../Table'

interface PaymentFlowProps {}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({ children }) => (
  <Box className={cn(styles.root)}>
    <Box
      className={styles.frame}
      background="blueberry100"
      borderWidth="standard"
      borderColor="blueberry200"
      borderRadius="standard"
      paddingY={6}
      paddingX={12}
    >
      <Box paddingX={3}>
        <Box display="flex" justifyContent="center" paddingBottom={8}>
          <Logo iconOnly width={64} height={64} />
        </Box>
      </Box>
      {children}
    </Box>
  </Box>
)

export const frames = {
  ChooseCard: () => (
    <PaymentFlow>
      <Box textAlign="center" paddingBottom={1}>
        <Text>
          Til greiðslu vegna <strong>ökuskírteinis</strong>
        </Text>
      </Box>
      <Box textAlign="center" paddingBottom={4}>
        <Text variant="h1">8.990 kr.</Text>
      </Box>
      <CreditCardSelector />
      <Box paddingY={2}>
        <Button fluid>Greiða</Button>
      </Box>
      <Box textAlign="center" paddingY={2}>
        <Button fluid variant="text">
          Hætta við
        </Button>
      </Box>
    </PaymentFlow>
  ),
  NewCard: () => (
    <PaymentFlow>
      <Box textAlign="center" paddingBottom={1}>
        <Text>
          Til greiðslu vegna <strong>ökuskírteinis</strong>
        </Text>
      </Box>
      <Box textAlign="center" paddingBottom={4}>
        <Text variant="h1">8.990 kr.</Text>
      </Box>
      <Text variant="small" marginBottom={1}>
        Greiðslukort
      </Text>
      <Box marginBottom={2}>
        <Input label="Nafn korthafa" placeholder="Nafnið þitt" name="nafn" />
      </Box>
      <Box marginBottom={2}>
        <Input
          label="Kortanúmer"
          placeholder="Kortanúmerið þitt"
          name="kortanumer"
          type="number"
        />
      </Box>
      <Box marginBottom={8}>
        <Box display="flex" marginBottom={2}>
          <Box marginRight={1}>
            <Input
              label="CVC"
              placeholder="Öryggiskóði"
              name="cvc"
              maxLength={3}
            />
          </Box>
          <Box marginLeft={1}>
            <Input
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
      <Box paddingY={2}>
        <Button fluid>Greiða</Button>
      </Box>
      <Box textAlign="center" paddingY={2}>
        <Button fluid variant="text">
          Hætta við
        </Button>
      </Box>
    </PaymentFlow>
  ),
  Success: () => (
    <PaymentFlow>
      <Box textAlign="center" paddingBottom={1}>
        <Text color="mint400">
          Greiðsla vegna <strong>ökuskírteinis</strong> tókst
        </Text>
      </Box>
      <Box textAlign="center" paddingBottom={4}>
        <Text variant="h1">8.990 kr.</Text>
      </Box>
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
              <Table.Data>Heimild</Table.Data>
              <Table.Data>123456</Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data>Greiðslutími</Table.Data>
              <Table.Data>17. feb. 2021 kl. 11:17:23</Table.Data>
            </Table.Row>
            <Table.Row>
              <Table.Data>Færslunúmer</Table.Data>
              <Table.Data>2021-17-1502113-828</Table.Data>
            </Table.Row>
          </Table.Body>
        </Table.Table>
      </Box>
      <Box textAlign="center" paddingY={2}>
        <Button fluid>Til baka</Button>
      </Box>
    </PaymentFlow>
  ),
}
