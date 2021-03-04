import { defineMessage } from 'react-intl'

export default defineMessage({
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
  contactAdd: {
    id: 'ia.application:applicant.contact.add.button',
    defaultMessage: 'Bæta við tengilið',
    description: 'Button label for adding secondary contact',
  },

  secondaryContactSubtitle: {
    id: 'ia.application:applicant.secondaryContact.subTitle',
    defaultMessage: 'Upplýsingar tengiliðs',
    description: 'Subtitle for secondaryContact formfields',
  },
})
