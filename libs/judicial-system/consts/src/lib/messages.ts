import { defineMessage, MessageDescriptor } from '@formatjs/intl'

import { Gender } from '@island.is/judicial-system/types'

const strings = {
  intro: defineMessage({
    id: 'judicial.system.core:subpoena.intro',
    defaultMessage:
      'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
    description: 'Notaður sem inngangur.',
  }),
  intro_female: defineMessage({
    id: 'judicial.system.core:subpoena.female',
    defaultMessage:
      'Ákærða er kvödd til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
    description: 'Notaður sem inngangur þegar ákærða er kona.',
  }),
  intro_non_binary: defineMessage({
    id: 'judicial.system.core:subpoena.intro_non_binary',
    defaultMessage:
      'Ákært er kvatt til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
    description: 'Notaður sem inngangur þegar ákært er kynsegin/annað.',
  }),
  introEn: defineMessage({
    id: 'judicial.system.core:subpoena.intro_en',
    defaultMessage:
      'The accused is summoned to the court to hear the charge, make his defence and be subject to judgement.',
    description: 'Notaður sem inngangur þegar enska er valið tungumál.',
  }),
  arrestIntro: defineMessage({
    id: 'judicial.system.core:subpoena.type_intro',
    defaultMessage:
      'Sæki ákærði ekki þing, við þingfestingu máls eða á síðari stigum þess, má hann búast við því að verða handtekinn og færður fyrir dóm.',
    description: 'Notaður sem inngangur fyrir handtökufyrirkall.',
  }),
  arrestIntroFemale: defineMessage({
    id: 'judicial.system.core:subpoena.arrest_intro_female',
    defaultMessage:
      'Sæki ákærða ekki þing, við þingfestingu máls eða á síðari stigum þess, má hún búast við því að verða handtekin og færð fyrir dóm.',
    description:
      'Notaður sem inngangur fyrir handtökufyrirkall þegar ákærða er kona.',
  }),
  arrestIntroNonBinary: defineMessage({
    id: 'judicial.system.core:subpoena.arrest_intro_non_binary',
    defaultMessage:
      'Sæki ákært ekki þing, við þingfestingu máls eða á síðari stigum þess, má hán búast við því að verða handtekið og fært fyrir dóm.',
    description:
      'Notaður sem inngangur fyrir handtökufyrirkall þegar ákærða er kynsegin/annað.',
  }),
  arrestIntroEn: defineMessage({
    id: 'judicial.system.core:subpoena.arrest_intro_en',
    defaultMessage:
      'If the accused does not attend the hearing, they will be arrested and brought before the court.',
    description:
      'Notaður sem inngangur fyrir handtökufyrirkall þegar enska er valið tungumál.',
  }),
  absenceIntro: defineMessage({
    id: 'judicial.system.core:subpoena.absence_intro',
    defaultMessage:
      'Sæki ákærði ekki þing, við þingfestingu máls eða á síðari stigum þess, má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum.',
    description: 'Notaður sem inngangur fyrir útivistarfyrirkall.',
  }),
  absenceIntroFemale: defineMessage({
    id: 'judicial.system.core:subpoena.absence_intro_female',
    defaultMessage:
      'Sæki ákærða ekki þing, við þingfestingu máls eða á síðari stigum þess, má hún búast við því að fjarvist hennar verði metin til jafns við það að hún viðurkenni að hafa framið brot það sem hún er ákærð fyrir og dómur verði lagður á málið að henni fjarstaddri.',
    description:
      'Notaður sem inngangur fyrir útivistarfyrirkall þegar ákærða er kona.',
  }),
  absenceIntroNonBinary: defineMessage({
    id: 'judicial.system.core:subpoena.absence_intro_non_binary',
    defaultMessage:
      'Sæki ákært ekki þing, við þingfestingu máls eða á síðari stigum þess, má hán búast við því að fjarvist háns verði metin til jafns við það að hán viðurkenni að hafa framið brot það sem hán er ákært fyrir og dómur verði lagður á málið að háni fjarstöddu.',
    description:
      'Notaður sem inngangur fyrir útivistarfyrirkall þegar ákærða er kynsegin/annað.',
  }),
  absenceIntroEn: defineMessage({
    id: 'judicial.system.core:subpoena.absence_intro_en',
    defaultMessage:
      'If the accused does not attend the hearing he may expect his absence to be evaluated equal to an admission of the infraction of which he is accused of and the sentencing to be delivered in his absence.',
    description:
      'Notaður sem inngangur fyrir útivistarfyrirkall þegar enska er valið tungumál.',
  }),
  deadline: defineMessage({
    id: 'judicial.system.core:subpoena.deadline',
    defaultMessage: 'Birtingarfrestur er þrír sólarhringar.',
    description: 'Notaður sem texti fyrir frest.',
  }),
  deadlineEn: defineMessage({
    id: 'judicial.system.core:subpoena.deadline_en',
    defaultMessage: 'Notification deadline is three days.',
    description: 'Notaður sem texti fyrir frest þegar enska er valið tungumál.',
  }),
}

export const getIntro = (
  gender?: Gender,
  lang?: string,
): {
  intro: MessageDescriptor
  absenceIntro: MessageDescriptor
  arrestIntro: MessageDescriptor
  deadline: MessageDescriptor
} => {
  if (lang === 'en') {
    return {
      intro: strings.introEn,
      absenceIntro: strings.absenceIntroEn,
      arrestIntro: strings.arrestIntroEn,
      deadline: strings.deadlineEn,
    }
  } else {
    switch (gender) {
      case Gender.MALE:
        return {
          intro: strings.intro,
          absenceIntro: strings.absenceIntro,
          arrestIntro: strings.arrestIntro,
          deadline: strings.deadline,
        }

      case Gender.FEMALE:
        return {
          intro: strings.intro_female,
          absenceIntro: strings.absenceIntroFemale,
          arrestIntro: strings.arrestIntroFemale,
          deadline: strings.deadline,
        }
      default:
        return {
          intro: strings.intro_non_binary,
          absenceIntro: strings.absenceIntroNonBinary,
          arrestIntro: strings.arrestIntroNonBinary,
          deadline: strings.deadline,
        }
    }
  }
}
