import { defineMessages } from 'react-intl'

export const summaryForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.summaryForm.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Summary form section title',
    },
    pageTitle: {
      id: 'fa.application:section.summaryForm.general.pageTitle',
      defaultMessage: 'Yfirlit umsóknar',
      description: 'Summary form page title',
    },
    descriptionTitle: {
      id: 'fa.application:section.summaryForm.general.descriptionTitle',
      defaultMessage: 'Áætluð aðstoð',
      description: 'Summary form description title',
    },
    descriptionSubtitle: {
      id: 'fa.application:section.summaryForm.general.descriptionSubtitle',
      defaultMessage: '(til útgreiðslu í byrjun {nextMonth})',
      description: 'Summary form description subtitle',
    },
    description: {
      id: 'fa.application:section.summaryForm.general.description',
      defaultMessage:
        'Athugaðu að þessi útreikningur er eingöngu til viðmiðunar. Þú færð skilaboð þegar frekari útreikningur liggur fyrir.',
      description: 'Summary form description',
    },
    calculationsOverview: {
      id: 'fa.application:section.summaryForm.general.calculationsOverview',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'Summary form asking applicant to go over calculations',
    },
    submit: {
      id: 'fa.application:section.summaryForm.general.submit',
      defaultMessage: 'Senda umsókn',
      description: 'Summary form submit application button',
    },
    errorMessage: {
      id: 'fa.application:section.summaryForm.general.errorMessage',
      defaultMessage: 'Obbobbob eitthvað fór úrskeiðis',
      description: 'Summary form when fails to submit application',
    },
  }),
  userInfo: defineMessages({
    name: {
      id: 'fa.application:section.summaryForm.userInfo.name',
      defaultMessage: 'Nafn',
      description: 'Summary form users information title of name ',
    },
    address: {
      id: 'fa.application:section.summaryForm.userInfo.address',
      defaultMessage: 'Heimili',
      description: 'Summary form users information title of address ',
    },
    nationalId: {
      id: 'fa.application:section.summaryForm.userInfo.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Summary form users information title of national id ',
    },
  }),
  formInfo: defineMessages({
    personalTaxCreditTitle: {
      id: 'fa.application:section.summaryForm.formInfo.personalTaxCreditTitle',
      defaultMessage: 'Nýta persónuafslátt?',
      description: 'Summary form personalTaxCredit title',
    },
    filesTitle: {
      id: 'fa.application:section.summaryForm.formInfo.filesTitle',
      defaultMessage: 'Gögn',
      description: 'Summary form files title',
    },
    formCommentTitle: {
      id: 'fa.application:section.summaryForm.formInfo.formCommentTitle',
      defaultMessage: 'Útskýring umsóknar',
      description: 'Summary form input label for form comment',
    },
    formCommentPlaceholder: {
      id: 'fa.application:section.summaryForm.formInfo.formCommentPlaceholder',
      defaultMessage: 'Skrifaðu hér',
      description: 'Summary form placeholder for input for form comment',
    },
    formCommentLabel: {
      id: 'fa.application:section.summaryForm.formInfo.formCommentLabel',
      defaultMessage: 'Frekari útskýring á umsókn',
      description: 'Summary form label above the form comment section',
    },
  }),
  block: defineMessages({
    buttonLabel: {
      id: 'fa.application:section.summaryForm.block.buttonLabel',
      defaultMessage: 'Breyta',
      description:
        'Summary block, button label when applicant wants to change his answer',
    },
  }),
}
