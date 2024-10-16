import { defineMessage } from '@formatjs/intl'

export const serviceCertificate = {
  title: defineMessage({
    id: 'judicial.system.backend:pdf.service_certificate.title',
    defaultMessage: 'Birtingarvottorð',
    description: 'Notaður sem titill á birtingarvottorði.',
  }),
  arraignmentDate: defineMessage({
    id: 'judicial.system.backend:pdf.service_certificate.arraignment_date',
    defaultMessage: 'Þingfesting',
    description: 'Notaður sem texti fyrir dagsetningu dómþings.',
  }),
  courtRoom: defineMessage({
    id: 'judicial.system.backend:pdf.service_certificate.court_room_v1',
    defaultMessage: 'Staður: Dómsalur {courtRoom}',
    description: 'Notaður sem texti fyrir stað.',
  }),
}
