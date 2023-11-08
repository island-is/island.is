import { Form } from '@island.is/application/types'
import { fields, startForm } from './formBuilder'

export function paymentForm(): Form {
  return startForm('Greiðsla')
    .startSection({ title: 'Greiðsla' })
    .page({
      title: 'Greiðsla',
      children: fields().payementPendingField().build(),
    })
    .endSection()
    .endForm()
}
