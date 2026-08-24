import { defineMessages } from 'react-intl'

export const externalData = {
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'pd.application:externalData.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data section title',
    },
    pageTitle: {
      id: 'pd.application:externalData.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External data page title',
    },
    subTitle: {
      id: 'pd.application:externalData.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki',
      description: 'The following data will be retrieved electronically',
    },
    checkboxLabel: {
      id: 'pd.application:externalData.dataProvider.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'I understand',
    },
    submitButton: {
      id: 'pd.application:externalData.dataProvider.submitButton',
      defaultMessage: 'Hefja umsókn',
      description: 'External data submit button',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'pd.application:externalData.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'Your user profile information',
    },
    subTitle: {
      id: 'pd.application:externalData.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description:
        'In order to apply for this application we need your email and phone number',
    },
  }),
  finances: defineMessages({
    title: {
      id: 'pd.application:externalData.finances.title',
      defaultMessage: 'Fjármál',
      description: 'Finances',
    },
    subTitle: {
      id: 'pd.application:externalData.finances.subTitle',
      defaultMessage:
        'Upplýsingar um fjármál þín hjá Fjársýslu ríkisins og öðrum stofnunum sem reknar eru af ríkinu',
      description:
        'Information about your finances with the State Financial Management and other institutions operated by the state',
    },
  }),
}
