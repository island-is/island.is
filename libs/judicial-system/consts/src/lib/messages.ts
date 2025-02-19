import { Gender } from '@island.is/judicial-system/types'

const strings = {
  intro:
    'Ákærði er kvaddur til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
  intro_female:
    'Ákærða er kvödd til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
  intro_non_binary:
    'Ákært er kvatt til að koma fyrir dóm, hlýða á ákæru, halda uppi vörnum og sæta dómi.',
  introEn:
    'The accused is summoned to the court to hear the charge, make their defence and be subject to judgement.',
  arrestIntro:
    'Sæki ákærði ekki þing, við þingfestingu máls eða á síðari stigum þess, má hann búast við því að verða handtekinn og færður fyrir dóm.',
  arrestIntroFemale:
    'Sæki ákærða ekki þing, við þingfestingu máls eða á síðari stigum þess, má hún búast við því að verða handtekin og færð fyrir dóm.',
  arrestIntroNonBinary:
    'Sæki ákært ekki þing, við þingfestingu máls eða á síðari stigum þess, má hán búast við því að verða handtekið og fært fyrir dóm.',
  arrestIntroEn:
    'If the accused does not attend the hearing, they will be arrested and brought before the court.',
  absenceIntro:
    'Sæki ákærði ekki þing, við þingfestingu máls eða á síðari stigum þess, má hann búast við því að fjarvist hans verði metin til jafns við það að hann viðurkenni að hafa framið brot það sem hann er ákærður fyrir og dómur verði lagður á málið að honum fjarstöddum.',
  absenceIntroFemale:
    'Sæki ákærða ekki þing, við þingfestingu máls eða á síðari stigum þess, má hún búast við því að fjarvist hennar verði metin til jafns við það að hún viðurkenni að hafa framið brot það sem hún er ákærð fyrir og dómur verði lagður á málið að henni fjarstaddri.',
  absenceIntroNonBinary:
    'Sæki ákært ekki þing, við þingfestingu máls eða á síðari stigum þess, má hán búast við því að fjarvist háns verði metin til jafns við það að hán viðurkenni að hafa framið brot það sem hán er ákært fyrir og dómur verði lagður á málið að háni fjarstöddu.',
  absenceIntroEn:
    'If the accused does not attend the hearing they may expect their absence to be evaluated equal to an admission of the infraction of which they is accused of and the sentencing to be delivered in their absence.',
  deadline: 'Birtingarfrestur er þrír sólarhringar.',
  deadlineEn: 'Notification deadline is three days.',
}

export const getIntro = (
  gender?: Gender,
  lang?: string,
): {
  intro: string
  absenceIntro: string
  arrestIntro: string
  deadline: string
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
