import {
  Box,
  Button,
  Checkbox,
  Stack,
  RadioButton,
} from '@island.is/island-ui/core'
import { PaymentForm } from 'apps/payments/components/PaymentForm'

export default function TestPage() {
  return (
    <PaymentForm>
      <p>Bifreiðagjöld</p>
      <p>13.337 kr.</p>

      <Stack space={1}>
        <RadioButton id="yes" checked label="Kort" />
        <RadioButton id="yes" label="Krafa" />
      </Stack>
      <Button>Halda áfram</Button>
    </PaymentForm>
  )
  //   return <p>Test page (page router)</p>
}
