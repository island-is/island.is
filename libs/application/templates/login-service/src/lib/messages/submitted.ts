import { defineMessages } from 'react-intl'

export const submitted = {
  general: defineMessages({
    pageTitle: {
      id: `ls.application:section.submitted.pageTitle`,
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'submitted page title',
    },
    expandableTitle: {
      id: `ls.application:section.submitted.expandableTitle`,
      defaultMessage: 'Hvað gerist næst?',
      description: 'submitted expandable title',
    },
  }),
  labels: defineMessages({
    desceriptionBulletPoints: {
      id: `ls.application:section.submitted.desceriptionBulletPoints#markdown`,
      defaultMessage: `* Við munum nú fara yfir umsóknina og hafa svo samband við ábyrgðaraðila í kjölfarið.\n* Við verðum í sambandi ef okkur vantar frekari upplýsingar.\n* Ef þú þarft frekari upplýsingar þá getur þú haft samband með tölvupósti á netfangið [island@island.is](mailto:island@island.is)`,
      description: 'submitted desceriptionBulletPoints',
    },
    descriptionBulletOne: {
      id: `ls.application:section.submitted.descriptionBulletOne`,
      defaultMessage:
        'Við munum nú fara yfir umsóknina og hafa svo samband við ábyrgðaraðila í kjölfarið.',
      description: 'submitted descriptionBulletOne',
    },
    descriptionBulletTwo: {
      id: `ls.application:section.submitted.descriptionBulletTwo`,
      defaultMessage:
        'Við verðum í sambandi ef okkur vantar frekari upplýsingar.',
      description: 'submitted descriptionBulletTwo',
    },
    descriptionBulletThree: {
      id: `ls.application:section.submitted.descriptionBulletThree`,
      defaultMessage:
        'Ef þú þarft frekari upplýsingar þá getur þú haft samband með tölvupósti á netfangið',
      description: 'submitted descriptionBulletThree',
    },
  }),
}
