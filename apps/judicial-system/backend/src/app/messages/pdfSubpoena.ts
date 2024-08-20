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
  intro: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.intro',
    defaultMessage:
      'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
    description: 'Notaður sem inngangur.',
  }),
  arrestIntro: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.type_intro',
    defaultMessage:
      'Sæki ákærði ekki þing má hann búast við því að verða handtekinn og færður fyrir dóm.',
    description: 'Notaður sem inngangur fyrir handtökufyrirkall.',
  }),
  absenceIntro: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.absence_intro',
    defaultMessage:
      'Sæki ákærði ekki þing má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum.',
    description: 'Notaður sem inngangur fyrir útivistarfyrirkall.',
  }),
  deadline: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.deadline',
    defaultMessage: 'Birtingarfrestur er þrír sólarhringar.',
    description: 'Notaður sem texti fyrir frest.',
  }),
}
