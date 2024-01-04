import { defineMessages } from 'react-intl'

// Strings on login screen
export const login = {
  general: defineMessages({
    heading: {
      id: 'judicial.system.core:login.heading',
      defaultMessage: 'Skráðu þig inn í Réttarvörslugátt',
      description: 'Notaður sem titill á innskráningarsíðu',
    },
    description: {
      id: 'judicial.system.core:login.description',
      defaultMessage:
        'Notaðu rafræn skilríki til þess að skrá þig inn. Passaðu upp á að það sé kveikt á símanum eða hann sé ólæstur.',
      description:
        'Notaður sem texti sem útskýrir rafræn skilríki á innskráningarsíðu',
    },
    buttonLabel: {
      id: 'judicial.system.core:login.buttonLabel',
      defaultMessage: 'Innskráning',
      description:
        'Notaður sem texti í takka til að skrá sig inn á innskráningarsíðu',
    },
  }),
  error: {
    failed: defineMessages({
      title: {
        id: 'judicial.system.core:login.error.failed.title',
        defaultMessage: 'Innskráning ógild',
        description:
          'Notaður sem titill í villuskilaboðum þegar innskráning er ógild',
      },
      message: {
        id: 'judicial.system.core:login.error.failed.message',
        defaultMessage:
          'Innskráning tókst ekki. Ertu viss um að þú hafir slegið inn rétt símanúmer?',
        description:
          'Notaður sem texti í villuskilaboðum þegar innskráning er ógild',
      },
    }),
    unAuthenticated: defineMessages({
      title: {
        id: 'judicial.system.core:login.error.unAuthenticated.title',
        defaultMessage: 'Innskráning tókst ekki',
        description:
          'Notaður sem titill í villuskilaboðum þegar innskráning tókst ekki',
      },
      message: {
        id: 'judicial.system.core:login.error.unAuthenticated.message',
        defaultMessage:
          'Innskráning ekki lengur gild. Vinsamlegast reynið aftur.',
        description:
          'Notaður sem texti í villuskilaboðum þegar innskráning tókst ekki',
      },
    }),
    unAuthorized: defineMessages({
      title: {
        id: 'judicial.system.core:login.error.unAuthorized.title',
        defaultMessage: 'Þú ert ekki með aðgang',
        description:
          'Notaður sem titill í villuskilaboðum þegar reynt er að skrá sig inn án þess að hafar aðgang að kerfinu',
      },
      message: {
        id: 'judicial.system.core:login.error.unAuthorized.message',
        defaultMessage:
          'Þú hefur ekki fengið aðgang að Réttarvörslugátt. Ef þú telur þig eiga að hafa aðgang þarft þú að hafa samband við viðeigandi stjórnanda eða notendaþjónustu hjá þinni starfsstöð.',
        description:
          'Notaður sem texti í villuskilaboðum þegar reynt er að skrá sig inn án þess að hafar aðgang að kerfinu',
      },
    }),
    oldLogin: defineMessages({
      title: {
        id: 'judicial.system.core:login.error.old_login.title',
        defaultMessage: 'Innskráning tókst ekki',
        description:
          'Notaður sem titill í villuskilaboðum þegar reynt er að skrá sig inn með gömlu innskráningunni',
      },
      message: {
        id: 'judicial.system.core:login.error.old_login.message',
        defaultMessage:
          'Þú reyndir að skrá þig inn með gamalli innskráningarþjónustu Ísland.is. Vinsamlegast reynið aftur með því að smella á takkann hér fyrir neðan.',
        description:
          'Notaður sem texti í villuskilaboðum þegar reynt er að skrá sig inn með gömlu innskráningunni',
      },
    }),
  },
}
