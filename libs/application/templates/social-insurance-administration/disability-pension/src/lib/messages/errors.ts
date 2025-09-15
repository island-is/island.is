import { defineMessages } from 'react-intl'

export const errors = defineMessages({
  emptyForeignResidence: {
    id: 'dp.application:errors.foreignResidenceRequired',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einni dvöl erlendis',
    description: 'You must add at least one foreign residence',
  },
  emptyForeignPayments: {
    id: 'dp.application:errors.abroadPaymentsRequired',
    defaultMessage:
      'Nauðsynlegt er að bæta við a.m.k einni greiðslu erlendis',
    description: 'You must add at least one foreign payment',
  },
  emptyCountry: {
    id: 'dp.application:errors.countryRequired',
    defaultMessage: 'Nauðsynlegt er að velja land',
    description: 'You must add at least one country',
  },
  emptyNationalId: {
    id: 'dp.application:errors.abroadNationalIdRequired',
    defaultMessage: 'Nauðsynlegt er að slá inn kennitölu í viðeigandi landi.',
    description: 'You must supply a foreign national id',
  },
  nationalIdAbroadTooShort: {
    id: 'dp.application:errors.abroadNationalIdTooShort',
    defaultMessage: 'Kennitala í landi verður að vera a.m.k 4 tölustafir',
    description: 'TODO',
  },
  emptyStartDate: {
    id: 'dp.application:errors.startDateRequired',
    defaultMessage: 'Nauðsynlegt er að velja upphaf tímabils',
    description: 'You must select the start of period',
  },
  emptyEndDate: {
    id: 'dp.application:errors.endDateRequired',
    defaultMessage:
      'Nauðsynlegt er að velja enda tímabils, og að dagsetningin sé á eftir upphafsdagsetningu',
    description:
      'You must select the end of period. The end date must be after the start date.',
  },
  emptyResidenceOtherText: {
    id: 'dp.application:errors.residenceOtherTextRequired',
    defaultMessage:
      'Nauðsynlegt taka fram í hvernig húsnæði þú býrð ef "Annað" er valið',
    description: 'TODO',
  },
  emptyLanguageOtherText: {
    id: 'dp.application:errors.languageOtherTextRequired',
    defaultMessage:
      'Nauðsynlegt taka fram hvaða tungumál þú talar ef "Annað" er valið',
    description: 'TODO',
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
  emptyPreviousEmploymentField: {
    id: 'dp.application:errors.previousEmploymentFieldRequired',
    defaultMessage:
      'Nauðsynlegt er að taka fram hvernig starfsemi þú vannst við',
    description: 'You must specify in what industry you worked',
  },
  emptyEmploymentStatus: {
    id: 'dp.application:errors.employmentStatusRequired',
    defaultMessage:
      'Nauðsynlegt er að velja a.m.k einn valkost eða útskýra í texta',
    description:
      'You must select at least one option or provide a description',
  },
  capabilityBetween0And100: {
    id: 'dp.application:errors.capabilityBetween0And100',
    defaultMessage: 'Starfsgeta þarf að vera á bilinu 0-100',
    description: 'Todo',
  },
})
