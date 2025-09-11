import { TagVariant } from '@island.is/island-ui/core'
import { PaymentsGetFlowPaymentStatus } from '@island.is/api/schema'
import { MessageDescriptor } from 'react-intl'

export const getPaymentStatusTag = (
  paymentStatus: string,
  formatMessage: (msg: MessageDescriptor) => string,
): { variant: TagVariant; message: string } => {
  switch (paymentStatus) {
    case PaymentsGetFlowPaymentStatus.paid:
      return {
        variant: 'mint',
        message: formatMessage({
          id: 'admin-portal.payments:statusPaid',
          defaultMessage: 'Greitt',
        }),
      }
    case PaymentsGetFlowPaymentStatus.unpaid:
      return {
        variant: 'red',
        message: formatMessage({
          id: 'admin-portal.payments:statusUnpaid',
          defaultMessage: 'Ógreitt',
        }),
      }
    case PaymentsGetFlowPaymentStatus.invoice_pending:
      return {
        variant: 'blue',
        message: formatMessage({
          id: 'admin-portal.payments:statusInvoicePending',
          defaultMessage: 'Krafa gefin út, bíður greiðslu',
        }),
      }
    default:
      return {
        variant: 'blue',
        message: formatMessage({
          id: 'admin-portal.payments:statusUnknown',
          defaultMessage: 'Óþekkt',
        }),
      }
  }
}
