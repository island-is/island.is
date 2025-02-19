import { defineMessage } from '@formatjs/intl'

export const subpoena = {
  title: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.title',
    defaultMessage: 'Fyrirkall',
    description: 'Notaður sem titill á fyrirkalli.',
  }),
  arraignmentDate: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.arraignment_date',
    defaultMessage: 'verður tekið fyrir á dómþingi {arraignmentDate}',
    description: 'Notaður sem texti fyrir dagsetningu dómþings.',
  }),
  courtRoom: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.court_room_v1',
    defaultMessage: 'Staður: Dómsalur {courtRoom}',
    description: 'Notaður sem texti fyrir stað.',
  }),
  type: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.type',
    defaultMessage: 'Dómsathöfn: Þingfesting',
    description: 'Notaður sem texti fyrir tegund.',
  }),
}
