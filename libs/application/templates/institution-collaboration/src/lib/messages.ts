import { defineMessages } from 'react-intl'

export const institutionApplicationMessages = {
  applicant: defineMessages({
    formName: {
      id: 'ia.application:form.name',
      defaultMessage: 'Verkefnaumsókn',
      description: 'Display name for application',
    },
    sectionLabel: {
      id: 'ia.application:applicant.section.label',
      defaultMessage: 'Upplýsingar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ia.application:applicant.section.title',
      defaultMessage: 'Upplýsingar um ráðuneyti eða stofnun',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ia.application:applicant.section.description',
      defaultMessage:
        'Stofnun eða ráðuneyti sem sækist eftir samstarfi við Stafrænt Ísland og málefnasvið sem verkefnið tilheyrir. ',
      description: 'Section description',
    },
    institutionSubtitle: {
      id: 'ia.application:applicant.institution.subTitle',
      defaultMessage: 'Hvaða ráðuneyti eða stofnun sækir um samstarf?',
      description: 'Subtitle for institution name formfield',
    },
    institutionLabel: {
      id: 'ia.application:applicant.institution.label',
      defaultMessage: 'Nafn á ráðuneyti eða stofnun',
      description: 'Form label for institution name formfield',
    },
    contactSubtitle: {
      id: 'ia.application:applicant.contact.subTitle',
      defaultMessage: 'Upplýsingar tengiliðs',
      description: 'Subtitle for contact formfields',
    },
    contactNameLabel: {
      id: 'ia.application:applicant.contact.name.label',
      defaultMessage: 'Nafn',
      description: 'Form label for contact name formfield',
    },
    contactPhoneLabel: {
      id: 'ia.application:applicant.contact.phone.label',
      defaultMessage: 'Símanúmer',
      description: 'Form label for contact phone formfield',
    },
    contactEmailLabel: {
      id: 'ia.application:applicant.contact.email.label',
      defaultMessage: 'Netfang',
      description: 'Form label for contact email formfield',
    },
    contactAddButtonLabel: {
      id: 'ia.application:applicant.contact.addButtonLabel',
      defaultMessage: 'Bæta við tengilið',
      description: 'Button label for adding secondary contact',
    },

    secondaryContactSubtitle: {
      id: 'ia.application:applicant.secondaryContact.subTitle',
      defaultMessage: 'Upplýsingar tengiliðs 2',
      description: 'Subtitle for secondaryContact formfields',
    },
  }),
  project: defineMessages({
    sectionLabel: {
      id: 'ia.application:project.section.label',
      defaultMessage: 'Verkefnið',
      description: 'Section label',
    },
    subSectionLabel: {
      id: 'ia.application:project.subSection.label',
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Sub section label',
    },
    sectionTitle: {
      id: 'ia.application:project.section.title',
      defaultMessage: 'Verkefnið',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ia.application:project.section.description',
      defaultMessage:
        'Hér er hægt að fara í forsöguna og almennt lýsa þeirri hugmynd sem liggur að baki verkefninu.',
      description: 'Section description',
    },
    informationSubtitle: {
      id: 'ia.application:project.information.subTitle',
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Subtitle for project information formfields',
    },
    nameLabel: {
      id: 'ia.application:project.name.label',
      defaultMessage: 'Heiti verkefnis',
      description: 'Form label for project name formfield',
    },
    backgroundLabel: {
      id: 'ia.application:project.background.label',
      defaultMessage: 'Bakgrunnur verkefnis',
      description: 'Form label for project background formfield',
    },
    backgroundPlaceholder: {
      id: 'ia.application:project.background.placeholder',
      defaultMessage: 'Hver er forsaga og umfang verkefnisins í gófum dráttum?',
      description: 'Placeholder for project background formfield',
    },
    goalsLabel: {
      id: 'ia.application:project.goals.label',
      defaultMessage: 'Markmið verkefnis, ávinningur og markhópur',
      description: 'Form label for project goals formfield',
    },
    goalsPlaceholder: {
      id: 'ia.application:project.goals.placeholder',
      defaultMessage:
        'Hvað á að leysa með verkefninu? Hver er ávinningurinn og fyrir hvern? Hér væri gott að nota tölfræði ef hún liggur fyrir.',
      description: 'Placeholder for project goals formfield',
    },
    scopeLabel: {
      id: 'ia.application:project.scope.label',
      defaultMessage: 'Umfang (e. Scope) verkefins',
      description: 'Form label for project scope formfield',
    },
    scopePlaceholder: {
      id: 'ia.application:project.scope.placeholder',
      defaultMessage:
        'Hverjar eru grófar útlínur verkefnisins? Hvað telst hluti af því og hvað ekki?',
      description: 'Placeholder for project scope formfield',
    },
    financeLabel: {
      id: 'ia.application:project.finance.label',
      defaultMessage: 'Fjármögnun',
      description: 'Form label for project finance formfield',
    },
    financePlaceholder: {
      id: 'ia.application:project.finance.placeholder',
      defaultMessage: 'Hvert er framlag stofnunarinnar?',
      description: 'Placeholder for project finance formfield',
    },
    attachmentsSubtitle: {
      id: 'ia.application:project.attachment.subTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'Subtitle for project attachment formfields',
    },
    attachmentsDescription: {
      id: 'ia.application:project.attachment.description',
      defaultMessage:
        'Ef búið er að útbúa þarfagreiningu fyrir verkefnið eða önnur skjöl sem þú vilt koma á framfæri. ',
      description: 'Description for project attachment formfields',
    },
    attachmentsUploadHeader: {
      id: 'ia.application:project.attachment.uploadHeader',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Upload header for project attachment formfields',
    },
    attachmentsUploadDescription: {
      id: 'ia.application:project.attachment.uploadDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'Upload description for project attachment formfields',
    },
    attachmentsUploadButtonLabel: {
      id: 'ia.application:project.attachment.uploadButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Button label for uploading project attachment',
    },
  }),
  constraints: defineMessages({
    subSectionLabel: {
      id: 'ia.application:constraints.subSection.label',
      defaultMessage: 'Áskoranir, skorður og úrlausnarefni',
      description: 'Sub section label',
    },
    sectionTitle: {
      id: 'ia.application:constraints.section.title',
      defaultMessage: 'Áskoranir, skorður og úrlausnarefni',
      description: 'Section title',
    },

    sectionDescription: {
      id: 'ia.application:constraints.section.description',
      defaultMessage:
        'Vinsamlegast veljið og útskýrið þau atriði sem taka þarf tillit til við framkvæmd og skipulag verkefnisins. Eru verkefninu einhverjar skorður settar? Þarf að yfirstíga einhverjar áskoranir og finna þeim úrlausn?',
      description: 'Section description',
    },

    constraintsTechicalLabel: {
      id: 'ia.application:applicant.constraints.technical.label',
      defaultMessage: 'Tæknileg umgjörð',
      description: 'Form label for constraints technical formfield',
    },
    constraintsTechicalPlaceholder: {
      id: 'ia.application:applicant.constraints.technical.placeholder',
      defaultMessage: 's.s. upplýsingatæknistefna ríkisins eða stofnunarinnar',
      description: 'Form placeholder for constraints technical formfield',
    },
    constraintsFinancialLabel: {
      id: 'ia.application:applicant.constraints.financial.label',
      defaultMessage: 'Fjárhagslegar takmarkanir',
      description: 'Form label for constraints financial formfield',
    },
    constraintsFinancialPlaceholder: {
      id: 'ia.application:applicant.constraints.financial.placeholder',
      defaultMessage:
        's.s. takmörkun á útlögðum kostnaði, heildarkostnaði verkefnisins eða skorður um val á byrgjum.',
      description: 'Form placeholder for constraints financial formfield',
    },
    constraintsTimeLabel: {
      id: 'ia.application:applicant.constraints.time.label',
      defaultMessage: 'Tímarammi',
      description: 'Form label for constraints time formfield',
    },
    constraintsTimePlaceholder: {
      id: 'ia.application:applicant.constraints.time.placeholder',
      defaultMessage:
        's.s. þörf á því að vinna verkefni innan ákveðins tímabils eða dagsetningar sem þarf að taka tillit til.',
      description: 'Form placeholder for constraints time formfield',
    },
    constraintsMoralLabel: {
      id: 'ia.application:applicant.constraints.moral.label',
      defaultMessage: 'Lagalegar- og siðferðilegar skorður',
      description: 'Form label for constraints moral formfield',
    },
    constraintsMoralPlaceholder: {
      id: 'ia.application:applicant.constraints.moral.placeholder',
      defaultMessage:
        's.s lög og reglur sem stofnunin starfar eftir sem taka þarf tillit til eða siðferðileg atriði um meðhöndlun og vinnslu upplýsinga.',
      description: 'Form placeholder for constraints moral formfield',
    },
    constraintsOtherLabel: {
      id: 'ia.application:applicant.constraints.other.label',
      defaultMessage: 'Önnur atriði',
      description: 'Form label for constraints other formfield',
    },
    constraintsOtherPlaceholder: {
      id: 'ia.application:applicant.constraints.other.placeholder',
      defaultMessage:
        'Eru önnur atriði sem munu hafa áhrif á framkvæmd eða skipulag verkefnisins?',
      description: 'Form placeholder for constraints other formfield',
    },
  }),
  stakeholders: defineMessages({
    subSectionLabel: {
      id: 'ia.application:stakeholders.subSection.label',
      defaultMessage: 'Hagsmunaaðilar',
      description: 'Sub section label',
    },
    sectionTitle: {
      id: 'ia.application:stakeholders.section.title',
      defaultMessage: 'Hlutverk og hagsmunaaðilar',
      description: 'Section title',
    },
    stakeholdersLabel: {
      id: 'ia.application:project.stakeholders.label',
      defaultMessage: 'Hagsmunaaðilar',
      description: 'Form label for project stakeholders formfield',
    },
    stakeholdersPlaceholder: {
      id: 'ia.application:project.stakeholders.placeholder',
      defaultMessage:
        'Hagsmunaaðilar geta verið notendur, stjórnendur, fyrirtækið, samfélagið',
      description: 'Placeholder for project stakeholders formfield',
    },
    roleLabel: {
      id: 'ia.application:project.role.label',
      defaultMessage: 'Hlutverk Stafræns Íslands',
      description: 'Form label for project role formfield',
    },
    rolePlaceholder: {
      id: 'ia.application:project.role.placeholder',
      defaultMessage:
        'Hvaða stuðningi er óskað eftir frá Stafrænu Íslandi? - Að hvaða verkhlutum er aðkomu Stafræns Íslands óskað?',
      description: 'Placeholder for project role formfield',
    },
    otherRolesLabel: {
      id: 'ia.application:project.otherRoles.label',
      defaultMessage: 'Önnur skilgreind hlutverk',
      description: 'Form label for project otherRoles formfield',
    },
    otherRolesPlaceholder: {
      id: 'ia.application:project.otherRoles.placeholder',
      defaultMessage:
        'Hvernig er eignarhaldi og ábyrgð á framkvæmd verkefnisins háttað hjá viðkomandi ráðuneyti eða stofnun? Hvaða hlutverki gegnir innsendandi umsóknar?',
      description: 'Placeholder for project role formfield',
    },
  }),
  review: defineMessages({
    sectionLabel: {
      id: 'ia.application:review.section.label',
      defaultMessage: 'Staðfesta upplýsingar',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ia.application:review.section.title',
      defaultMessage: 'Verkefnið',
      description: 'Section title',
    },
    sectionDescription: {
      id: 'ia.application:review.section.description',
      defaultMessage:
        'Farðu vel yfir efnið áður en þú sendir inn umsóknina. Það flýtir fyrir afgreiðslu málsins hjá Stafrænu Íslandi ef umsóknin er skýr og hnitmiðuð.',
      description: 'Section description',
    },
    submitButtonLabel: {
      id: 'ia.application:review.submitButtonLabel',
      defaultMessage: 'Staðfesta Umsókn',
      description: 'Button label for submitting application',
    },
  }),
  confirmation: defineMessages({
    sectionLabel: {
      id: 'ia.application:confirmation.section.label',
      defaultMessage: 'Umsókn staðfest',
      description: 'Section label',
    },
    sectionTitle: {
      id: 'ia.application:confirmation.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionInfoBulletFirst: {
      id: 'ia.application:confirmation.section.infoBullet.first',
      defaultMessage:
        'Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar.',
      description: 'First information sentence, in bullet list',
    },
    sectionInfoBulletSecond: {
      id: 'ia.application:confirmation.section.infoBullet.second',
      defaultMessage:
        'Við verðum í sambandi ef okkur vantar frekari upplýsingar.',
      description: 'Second information sentence, in bullet list',
    },
    sectionInfoBulletThird: {
      id: 'ia.application:confirmation.section.infoBullet.third',
      defaultMessage:
        'Ef þú þarft frekari upplýsingar þá getur þú sent okkur tölvupóst á netfangið island@island.is',
      description: 'Third information sentence, in bullet list',
    },
  }),
  approved: defineMessages({
    sectionTitle: {
      id: 'ia.application:approved.section.title',
      defaultMessage: 'Takk fyrir umsóknina!',
      description: 'Section title',
    },
    sectionDescription: {
      id: 'ia.application:approved.section.description',
      defaultMessage:
        'Við munum fara yfir umsóknina og sendum á þig svör innan tíðar. Við verðum í sambandi ef okkur vantar frekari upplýsingar. ',
      description: 'Section title',
    },
  }),
}
