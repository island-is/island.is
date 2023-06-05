import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.cs.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Information section title',
    },
  }),
  labels: {
    residenceConditions: defineMessages({
      subSectionTitle: {
        id:
          'doi.cs.application:information.labels.residenceConditions.subSectionTitle',
        defaultMessage: 'Búsetuskilyrði',
        description: 'Residence conditions sub section title',
      },
      pageTitle: {
        id:
          'doi.cs.application:information.labels.residenceConditions.pageTitle',
        defaultMessage: 'Búsetuskilyrði',
        description: 'Residence conditions page title',
      },
      description: {
        id:
          'doi.cs.application:information.labels.residenceConditions.description',
        defaultMessage:
          'Til að eiga rétt á íslenskum ríkisborgararétti þarftu að hafa átt lögheimili á Íslandi í tiltekinn tíma og almennt er miðað við sjö ára samfelld búsetu. Almennt er miðað við sjö ára samfelld búsetu. Þar sem þú uppfyllir ekki sjö ára samfellda búsetu þarftu að velja hvað undanþága á við um þig. Sjá nánari upplýsingar um hvenær má sækja um hér ((https://island.is/rafraen-umsokn-um-rikisborgararett/hvenaer-ma-saekja-um))',
        description: 'Residence conditions description',
      },
      title: {
        id: 'doi.cs.application:information.labels.residenceConditions.title',
        defaultMessage: 'Veldu búsetuskilyrði',
        description: 'Residence conditions title',
      },
    }),
    residenceTypes: defineMessages({
      married: {
        id:
          'doi.cs.application:information.labels.residenceTypes.married.title',
        defaultMessage:
          'Er í hjúskap með íslenskum ríkisborgara og hef átt lögheimili á Íslandi í 4 ár frá giftingu',
        description: 'Residency type radio button title',
      },
      marriedSubLabel: {
        id:
          'doi.cs.application:information.labels.residenceTypes.married.subLabel',
        defaultMessage:
          'ATH sá sem þú ert í hjúskap með þarf að hafa verið íslenskur ríkisborgari í að lágmarki 5 ár',
        description: 'Residency type radio button sublabel',
      },
      coHabit: {
        id:
          'doi.cs.application:information.labels.residenceTypes.coHabit.title',
        defaultMessage:
          'Er í skráðri sambúð með íslenskum ríkisborgara og hef átt lögheimili á Íslandi í 5 ár frá skráningu sambúðar ',
        description: 'Residency type radio button title',
      },
      coHabitSubLabel: {
        id:
          'doi.cs.application:information.labels.residenceTypes.coHabit.subLabel',
        defaultMessage:
          'ATH sá sem þú ert í sambúð með þarf að hafa verið íslenskur ríkisborgari í að lágmarki 5 ár',
        description: 'Residency type radio button sublabel',
      },
      childOfResident: {
        id:
          'doi.cs.application:information.labels.residenceTypes.childOfResident.title',
        defaultMessage:
          'Ég er barn íslensks ríkisborgara og hef átt lögheimili á Íslandi í 2 ár',
        description: 'Residency type radio button title',
      },
      childOfResidentSubLabel: {
        id:
          'doi.cs.application:information.labels.residenceTypes.childOfResident.subLabel',
        defaultMessage:
          'ATH foreldri þitt þarf að hafa verið íslenskur ríkisborgari í að lágmarki 5 ár',
        description: 'Residency type radio button sublabel',
      },
      nordicResident: {
        id:
          'doi.cs.application:information.labels.residenceTypes.nordicResident.title',
        defaultMessage:
          'Ég er ríkisborgari Norðurlanda og hef átt lögheimili á Íslandi í 4 ár',
        description: 'Residency type radio button title',
      },
      refugee: {
        id:
          'doi.cs.application:information.labels.residenceTypes.refugee.title',
        defaultMessage:
          'Ég er flóttamaður eða með dvalarleyfi af mannúðarástæðum og hef átt lögheimili á Íslandi í 5 ár eftir að hafa fengið stöðu sem flóttamaður eða dvalarleyfi af mannúðarástæðum',
        description: 'Residency type radio button title',
      },
      noResidency: {
        id:
          'doi.cs.application:information.labels.residenceTypes.noResidency.title',
        defaultMessage:
          'Ég er ríkisfangslaus einstaklingur samkvæmt ákvæðum laga um útlendinga og hef átt lögheimili á Íslandi í 5 ár',
        description: 'Residency type radio button title',
      },
      former: {
        id: 'doi.cs.application:information.labels.residenceTypes.former.title',
        defaultMessage:
          'Ég er fyrrum íslenskur ríkisborgari og hef átt lögheimili á Íslandi í 1 ár. Ég missti íslenskt ríkisfang vegna umsóknar og veitingar erlends ríkisfangs',
        description: 'Residency type radio button title',
      },
    }),
    parents: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:information.labels.parents.subSectionTitle',
        defaultMessage: 'Foreldrar',
        description: 'Parents sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:information.labels.parents.pageTitle',
        defaultMessage: 'Foreldrar með íslenskt ríkisfang',
        description: 'Parents page title',
      },
      parentOneTitle: {
        id: 'doi.cs.application:information.labels.parents.parentOnetitle',
        defaultMessage: 'Foreldri 1',
        description: 'Parent one title',
      },
      parentTwoTitle: {
        id: 'doi.cs.application:information.labels.parents.parentTwotitle',
        defaultMessage: 'Foreldri 2',
        description: 'Parent two title',
      },
    }),
    maritalStatus: defineMessages({
      subSectionTitle: {
        id:
          'doi.cs.application:information.labels.maritalStatus.subSectionTitle',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:information.labels.maritalStatus.pageTitle',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status page title',
      },
      titleStatus: {
        id: 'doi.cs.application:information.labels.maritalStatus.titleStatus',
        defaultMessage: 'Hjúskaparstaða þín',
        description: 'Marital status title status',
      },
      titleSpouse: {
        id: 'doi.cs.application:information.labels.maritalStatus.titleSpouse',
        defaultMessage: 'Maki þinn',
        description: 'Marital status title spouse',
      },
      marritalStatusDate: {
        id:
          'doi.cs.application:information.labels.maritalStatus.marritalStatusDate',
        defaultMessage: 'Dagsetning hjúskapar',
        description: 'Marital status change date spouse',
      },
      status: {
        id: 'doi.cs.application:information.labels.maritalStatus.status',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status label',
      },
      nationalId: {
        id: 'doi.cs.application:information.labels.maritalStatus.nationalId',
        defaultMessage: 'Kennitala maka',
        description: 'Marital status national ID label',
      },
      name: {
        id: 'doi.cs.application:information.labels.maritalStatus.name',
        defaultMessage: 'Nafn maka',
        description: 'Marital status name label',
      },
      spouseBirthCountry: {
        id:
          'doi.cs.application:information.labels.maritalStatus.spouseBirthCountry',
        defaultMessage: 'Fæðingarland maka',
        description: 'Spouse birth country label',
      },
      spouseCitizenship: {
        id:
          'doi.cs.application:information.labels.maritalStatus.spouseCitizenship',
        defaultMessage: 'Ríkisfang maka',
        description: 'Spouse citizenship label',
      },
      applicantAddress: {
        id:
          'doi.cs.application:information.labels.maritalStatus.applicantAddress',
        defaultMessage: 'Heimilisfang þitt',
        description: 'Applicant address label',
      },
      spouseAddress: {
        id: 'doi.cs.application:information.labels.maritalStatus.spouseAddress',
        defaultMessage: 'Heimilisfang maka',
        description: 'Applicant spouse address label',
      },
    }),
    countriesOfResidence: defineMessages({
      subSectionTitle: {
        id:
          'doi.cs.application:information.labels.countriesOfResidence.subSectionTitle',
        defaultMessage: 'Búsetulönd',
        description: 'Countries of residence sub section title',
      },
      pageTitle: {
        id:
          'doi.cs.application:information.labels.countriesOfResidence.pageTitle',
        defaultMessage: 'Búsetulönd',
        description: 'Countries of residence page title',
      },
      questionTitle: {
        id:
          'doi.cs.application:information.labels.countriesOfResidence.questionTitle',
        defaultMessage:
          'Hefur þú búið í öðru landi en Íslandi eftir 15 ára aldur?',
        description: 'Countries of residence question title',
      },
      countryListTitle: {
        id:
          'doi.cs.application:information.labels.countriesOfResidence.countryListTitle',
        defaultMessage: 'Vinsamlegast tilgreindu þau lönd sem við á',
        description: 'Countries of residence list countries title',
      },
    }),
    staysAbroad: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.subSectionTitle',
        defaultMessage: 'Dvöl erlendis',
        description: 'Stays abroad sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.pageTitle',
        defaultMessage: 'Dvöl erlendis á tímabilinu',
        description: 'Stays abroad page title',
      },
      title: {
        id: 'doi.cs.application:information.labels.staysAbroad.title',
        defaultMessage:
          'Hefur þú, á gildistíma síðasta dvalarleyfis, dvalið erlendis?',
        description: 'Stays abroad title',
      },
    }),
  },
}
