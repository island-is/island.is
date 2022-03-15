import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'fa.application:application.name',
    defaultMessage: 'Fjárhagsaðstoð',
    description: 'name of financial aid application',
  },
})

export const copyUrl = defineMessages({
  inputLabel: {
    id: 'fa.application:copyUrl.inputLabel',
    defaultMessage: 'Hlekkur á umsóknina',
    description: 'Copy url input label',
  },
  buttonLabel: {
    id: 'fa.application:copyUrl.buttonLabel',
    defaultMessage: 'Afrita hlekk',
    description: 'Copy url button text',
  },
  successMessage: {
    id: 'fa.application:copyUrl.successMessage',
    defaultMessage: 'Hlekkur afritaður',
    description: 'Copy url success text',
  },
})

export const section = defineMessages({
  dataGathering: {
    id: 'fa.application:section.dataGathering',
    defaultMessage: 'Gagnaöflun',
    description: 'Data gathering section',
  },
  personalInterest: {
    id: 'fa.application:section.personalInterest',
    defaultMessage: 'Persónuhagir',
    description: 'Personal interest section',
  },
  finances: {
    id: 'fa.application:section.finances',
    defaultMessage: 'Fjármál',
    description: 'Finance section',
  },
  received: {
    id: 'fa.application:section.received',
    defaultMessage: 'Staðfesting',
    description: 'Application Received',
  },
})

export const approveOptions = defineMessages({
  no: {
    id: 'fa.application:section.approveOptions.no',
    defaultMessage: 'Nei',
    description: 'Applicant selected no as his answer',
  },
  yes: {
    id: 'fa.application:section.approveOptions.yes',
    defaultMessage: 'Já',
    description: 'Applicant selected yes as his answer',
  },
})

export const input = defineMessages({
  label: {
    id: 'fa.application:section.input.label',
    defaultMessage: 'Lýstu þínum aðstæðum',
    description:
      'Input label for custom answers, describing your circumstances',
  },
})

export const filesText = defineMessages({
  header: {
    id: 'fa.application:section.filesText.header',
    defaultMessage: 'Dragðu gögn hingað',
    description: 'File upload header',
  },
  description: {
    id: 'fa.application:section.filesText.description',
    defaultMessage: 'Tekið er við öllum hefðbundnum skráargerðum',
    description: 'File upload description',
  },
  buttonLabel: {
    id: 'fa.application:section.filesText.buttonLabel',
    defaultMessage: 'Bættu við gögnum',
    description: 'File upload button label',
  },
  errorMessage: {
    id: 'fa.application:section.filesText.errorMessage',
    defaultMessage: 'Þú þarft að hlaða upp gögnum',
    description: 'Error message when user has to upload files',
  },
})

export const familystatus = defineMessages({
  cohabitation: {
    id: 'fa.application:section.familystatus.cohabitation',
    defaultMessage: 'Í sambúð',
    description: 'Family status when applicant/spouse is in cohabitation',
  },
  married: {
    id: 'fa.application:section.familystatus.married',
    defaultMessage: 'Gift',
    description: 'Family status when applicant/spouse is married',
  },
  marriedNotLivingTogether: {
    id: 'fa.application:section.familystatus.marriedNotLivingTogether',
    defaultMessage: 'Hjón ekki í samvistum',
    description:
      'Family status when applicant/spouse is married but not living together',
  },
  unregisteredCohabitation: {
    id: 'fa.application:section.familystatus.unregisteredCohabitation',
    defaultMessage: 'Óskráð sambúð',
    description:
      'Family status when applicant/spouse is in unregistered cohabitation',
  },
  notCohabitation: {
    id: 'fa.application:section.familystatus.notCohabitation',
    defaultMessage: 'Ekki í sambúð',
    description: 'Family status when applicant is in not cohabitation',
  },
})
