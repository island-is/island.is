import { defineMessages } from 'react-intl'

export const errors = defineMessages({
  emptyForeignResidence: {
    id: 'dp.application:errors.foreignResidenceRequired',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k. einni dvöl erlendis',
    description: 'You must add at least one foreign residence',
  },
  emptyForeignPayments: {
    id: 'dp.application:errors.abroadPaymentsRequired',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k. einni greiðslu erlendis',
    description: 'You must add at least one foreign payment',
  },

  emptyResidenceOtherText: {
    id: 'dp.application:errors.residenceOtherTextRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram í hvernig húsnæði þú býrð ef "Annað" er valið',
    description: 'You must describe your housing type if "Other" is selected.',
  },
  emptyLanguageOtherText: {
    id: 'dp.application:errors.languageOtherTextRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram hvaða tungumál þú talar ef "Annað" er valið',
    description:
      'You must specify what language you speak if "Other" is selected.',
  },
  emptyRehabilitationOrTherapyDescription: {
    id: 'dp.application:errors.rehabilitationOrTherapyDescriptionRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram hvaða endurhæfingu eða meðferð þú hefur fengið',
    description:
      'You must specify any rehabilitation or therapy you have received',
  },
  emptyRehabilitationOrTherapyProgress: {
    id: 'dp.application:errors.rehabilitationOrTherapyProgressRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram hvaða árangri endurhæfing eða meðferð hefur skilað þér',
    description:
      'You must specify any progress you have achieved from rehabilitation or therapy',
  },
  emptyPreviousEmploymentWhen: {
    id: 'dp.application:errors.previousEmploymentWhenRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram hvenær þú varst í launuðu starfi',
    description: 'You must specify when you were in paid employment',
  },
  emptyPreviousEmploymentJob: {
    id: 'dp.application:errors.previousEmploymentJobRequired',
    defaultMessage: 'Nauðsynlegt er að taka fram hvað aðalstarf þitt var',
    description: 'You must specify in what profession you worked',
  },
  emptyPreviousEmploymentJobOther: {
    id: 'dp.application:errors.previousEmploymentJobOtherRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram hvað aðalstarf þitt var ef "Annað" er valið',
    description:
      'You must specify in what your previous job was if "Other" is selected',
  },
  emptyPreviousEmploymentField: {
    id: 'dp.application:errors.previousEmploymentFieldRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram hvernig starfsemi þú vannst við',
    description: 'You must specify in what industry you worked',
  },
  emptyPreviousEmploymentFieldOther: {
    id: 'dp.application:errors.previousEmploymentFieldOtherRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram hvaða starfssemi þú vannst við ef "Annað" er valið',
    description:
      'You must specify in what industry you worked in if "Other" is selected',
  },
  emptyEmploymentStatus: {
    id: 'dp.application:errors.employmentStatusRequired',
    defaultMessage:
      'Nauðsynlegt er að velja a.m.k. einn valkost. Ef valið er "Annað" þarf að útskýra í texta',
    description:
      'You must select at least one option. If "other" is selected, a description must be provided',
  },
  capabilityBetween0And100: {
    id: 'dp.application:errors.capabilityBetween0And100',
    defaultMessage: 'Starfsgeta þarf að vera á bilinu 0 - 100',
    description: 'Work capability must be between 0 - 100.',
  },
})
