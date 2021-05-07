import { defineMessages } from 'react-intl'

export const project = {
  general: defineMessages({
    pageTitle: {
      id: `affgp.application:section.project.pageTitle`,
      defaultMessage: 'Verkefnið',
      description: 'Project page title',
    },
    pageDescription: {
      id: `affgp.application:section.project.pageDescription`,
      defaultMessage: 'Upplýsingar um það verkefni sem þarfnast fjármögnunar',
      description: 'Project page description',
    },
  }),
  labels: defineMessages({
    infoFieldTitle: {
      id: `affgp.application:section.project.infoFieldTitle`,
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Project Info Field Title',
    },
    title: {
      id: `affgp.application:section.project.title`,
      defaultMessage: 'Heiti verkefnis',
      description: 'Project Title',
    },
    titlePlaceholder: {
      id: `affgp.application:section.project.titlePlaceholder`,
      defaultMessage: 'Heiti verkefnis sem þarfnast fjármögnunar',
      description: 'Project Title Placeholder',
    },
    description: {
      id: `affgp.application:section.project.description`,
      defaultMessage: 'Lýsing á verkefni',
      description: 'Project Description',
    },
    descriptionPlaceholder: {
      id: `affgp.application:section.project.descriptionPlaceholder`,
      defaultMessage: 'Stutt lýsing á verkefni og niðurstöðum úr ávinningsmati',
      description: 'Project Description Placeholder',
    },
    cost: {
      id: `affgp.application:section.project.cost`,
      defaultMessage: 'Heildarkostnaður',
      description: 'Project Cost',
    },
    costPlaceholder: {
      id: `affgp.application:section.project.costPlaceholder`,
      defaultMessage:
        'Hver er heildarkostnaður verkefnisins sem þarfnast fjármögnunar?',
      description: 'Project Cost Placeholder',
    },
    years: {
      id: `affgp.application:section.project.years`,
      defaultMessage: 'Fjöldi ára sem koma til endurgreiðslu á kostnaði',
      description: 'Project Years',
    },
    attachmentsTitle: {
      id: `affgp.application:section.project.attachmentsTitle`,
      defaultMessage: 'Fylgiskjöl',
      description: 'Project Attachments Title',
    },
    attachments: {
      id: `affgp.application:section.project.attachments`,
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    attachmentsIntro: {
      id: `affgp.application:section.project.attachmentsIntro`,
      defaultMessage:
        'Með umsókninni þarf að fylgja viðhengi sem inniheldur ítarupplýsingar um verkefnið ásamt ávinningsmati.',
      description: 'Project Attachments Intro',
    },
    attachmentsUploadHeader: {
      id: `affgp.application:section.project.attachmentsUploadHeader`,
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Project Attachments Upload Header',
    },
    attachmentsUploadDescription: {
      id: `affgp.application:section.project.attachmentsUploadDescription`,
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'Project Attachsments Upload Description',
    },
    attachmentsUploadButtonLabel: {
      id: `affgp.application:section.project.attachmentsUploadButtonLabel`,
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Project Attachments Upload Button Label',
    },
  }),
}
