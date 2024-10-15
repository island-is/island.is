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
  intro_female: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.intro_femail',
    defaultMessage:
      'Ákærða er kvödd til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
    description: 'Notaður sem inngangur þegar ákærða er kona.',
  }),
  intro_non_binary: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.intro_non_binary',
    defaultMessage:
      'Ákært er kvatt til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
    description: 'Notaður sem inngangur þegar ákært er kynsegin/annað.',
  }),
  arrestIntro: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.type_intro',
    defaultMessage:
      'Sæki ákærði ekki þing má hann búast við því að verða handtekinn og færður fyrir dóm.',
    description: 'Notaður sem inngangur fyrir handtökufyrirkall.',
  }),
  arrestIntroFemale: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.arrest_intro_female',
    defaultMessage:
      'Sæki ákærða ekki þing má hún búast við því að verða handtekin og færð fyrir dóm.',
    description:
      'Notaður sem inngangur fyrir handtökufyrirkall þegar ákærða er kona.',
  }),
  arrestIntroNonBinary: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.arrest_intro_non_binary',
    defaultMessage:
      'Sæki ákært ekki þing má hán búast við því að verða handtekið og fært fyrir dóm.',
    description:
      'Notaður sem inngangur fyrir handtökufyrirkall þegar ákærða er kona.',
  }),
  absenceIntro: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.absence_intro',
    defaultMessage:
      'Sæki ákærði ekki þing má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum.',
    description: 'Notaður sem inngangur fyrir útivistarfyrirkall.',
  }),
  absenceIntroFemale: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.absence_intro_female',
    defaultMessage:
      'Sæki ákærða ekki þing má hún búast við því að fjarvist hennar verði metin til jafns við það að hún viðurkenni að hafa framið brot það sem hún er ákærð fyrir og dómur verði lagður á málið að henni fjarstaddri.',
    description:
      'Notaður sem inngangur fyrir útivistarfyrirkall þegar ákærða er kona.',
  }),
  absenceIntroNonBinary: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.absence_intro_non_binary',
    defaultMessage:
      'Sæki ákært ekki þing má hán búast við því að fjarvist hánar verði metin til jafns við það að hán viðurkenni að hafa framið brot það sem hán er ákært fyrir og dómur verði lagður á málið að háni fjarstöddu.',
    description:
      'Notaður sem inngangur fyrir útivistarfyrirkall þegar ákærða er kona.',
  }),
  deadline: defineMessage({
    id: 'judicial.system.backend:pdf.subpoena.deadline',
    defaultMessage: 'Birtingarfrestur er þrír sólarhringar.',
    description: 'Notaður sem texti fyrir frest.',
  }),
}
