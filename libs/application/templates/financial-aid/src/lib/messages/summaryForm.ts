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
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp. ',
      description: 'Summary form asking applicant to go over calculations',
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
    formCommentTitle: {
      id: 'fa.application:section.summaryForm.formInfo.formCommentTitle',
      defaultMessage: 'Athugasemd',
      description: 'Summary form input label for form comment',
    },
    formCommentPlaceholder: {
      id: 'fa.application:section.summaryForm.formInfo.formCommentPlaceholder',
      defaultMessage: 'Skrifaðu hér',
      description: 'Summary form placeholder for input for form comment',
    },
  }),
}
