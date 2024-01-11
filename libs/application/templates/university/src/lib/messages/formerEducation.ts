import { defineMessages } from 'react-intl'

export const formerEducation = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:formerEducation.general.sectionTitle',
      defaultMessage: 'Menntun',
      description: 'Former education section title',
    },
  }),
  labels: {
    educationOptions: defineMessages({
      pageTitle: {
        id: 'uni.application:formerEducation.educationOptions.pageTitle',
        defaultMessage: 'Námsferilsupplýsingar',
        description: 'Former education page title',
      },
      pageDescription: {
        id: 'uni.application:formerEducation.educationOptions.pageDescription',
        defaultMessage:
          'Mikilvægt er að setja inn öll gögn frá fyrra námi sem þarf að meta. Nauðsynlegt er að á þeim gögnum komi fram námskeið, einkunnir, loknar einingar ásamt prófgráðu og staðfestingu á námslokum.',
        description: 'Former education options page title',
      },
      diplomaFinishedLabel: {
        id: 'uni.application:formerEducation.educationOptions.diplomaFinishedLabel',
        defaultMessage: 'Ég hef lokið stúdentsprófi',
        description: 'Diploma finished checkbox label',
      },
      diplomaFinishedDescription: {
        id: 'uni.application:formerEducation.educationOptions.diplomaFinishedDescription',
        defaultMessage: 'Lorem ipsum',
        description: 'Diploma finished checkbox description',
      },
      diplomaNotFinishedLabel: {
        id: 'uni.application:formerEducation.educationOptions.diplomaNotFinishedLabel',
        defaultMessage:
          'Ég mun ljúka stúdentsprófi eða prófi á þriðja hæfnisþrepi eftir að umsóknarfrestur rennur út',
        description: 'Diploma not finished checkbox label',
      },
      diplomaNotFinishedDescription: {
        id: 'uni.application:formerEducation.educationOptions.diplomaNotFinishedDescription',
        defaultMessage:
          'Um leið og gögn um stúdentspróf liggur fyrir mun háskólinn sækja þau rafrænt.',
        description: 'Diploma not finished checkbox description',
      },
      exemptionLabel: {
        id: 'uni.application:formerEducation.educationOptions.exemptionLabel',
        defaultMessage: 'Ég vil fá undanþágu frá stúdentsprófi',
        description: 'Exemption checkbox label',
      },
      exemptionDescription: {
        id: 'uni.application:formerEducation.educationOptions.exemptionDescription',
        defaultMessage:
          'Umsóknir sem ekki teljast uppfylla almenn inntökuskilyrði eru metnar sjálfstætt. Því er mikilvægt að umsækjendur skili viðbótarupplýsingum þar sem þeirra er óskað (til dæmis kynningarbréfi ásamt upplýsingum um fyrra nám).',
        description: 'Exemption checkbox description',
      },
      thirdLevelLabel: {
        id: 'uni.application:formerEducation.educationOptions.thirdLevelLabel',
        defaultMessage: 'Ég er með annað próf á þriðja hæfnisþrepi',
        description: 'Third level checkbox label',
      },
      thirdLevelDescription: {
        id: 'uni.application:formerEducation.educationOptions.thirdLevelDescription#markdown',
        defaultMessage: 'Sjá upplýsingar hér',
        description: 'Third level checkbox description',
      },
    }),
    educationDetails: defineMessages({
      pageTitle: {
        id: 'uni.application:formerEducation.educationDetails.pageTitle',
        defaultMessage: 'Námsferill',
        description: 'Former education page title',
      },
      pageDescription: {
        id: 'uni.application:formerEducation.educationDetails.pageDescription',
        defaultMessage:
          'Mikilvægt er að setja inn öll gögn frá fyrra námi sem þarf að meta. Nauðsynlegt er að á þeim gögnum komi fram námskeið, einkunnir, loknar einingar ásamt prófgráðu og staðfestingu á námslokum. Hér fyrir neðan eru upplýsingar um stúdentsprófið þitt það er sótt í Innu og allar upplýsingar um námskeið og einkunir verða sendar til háskólana.',
        description: 'Former education page description',
      },
      diplomaInformationLabel: {
        id: 'uni.application:formerEducation.educationDetails.diplomaInformationLabel',
        defaultMessage: 'Stúdentspróf (sótt úr Innu)',
        description: 'Label for diploma information',
      },
      schoolLabel: {
        id: 'uni.application:formerEducation.educationDetails.schoolLabel',
        defaultMessage: 'Skóli',
        description: 'School input label',
      },
      degreeLevelLabel: {
        id: 'uni.application:formerEducation.educationDetails.degreeLevelLabel',
        defaultMessage: 'Námsstig',
        description: 'Degree level input label',
      },
      degreeMajorLabel: {
        id: 'uni.application:formerEducation.educationDetails.degreeMajorLabel',
        defaultMessage: 'Námsbraut',
        description: 'Degree major input label',
      },
      finishedUnitsLabel: {
        id: 'uni.application:formerEducation.educationDetails.finishedUnitsLabel',
        defaultMessage: 'Fjöldi lokina eininga',
        description: 'Finished units input label',
      },
      averageGradeLabel: {
        id: 'uni.application:formerEducation.educationDetails.averageGradeLabel',
        defaultMessage: 'Meðaleinkun',
        description: 'Average grade input label',
      },
      degreeCountryLabel: {
        id: 'uni.application:formerEducation.educationDetails.degreeCountryLabel',
        defaultMessage: 'Námsland',
        description: 'Degree country input label',
      },
      beginningDateLabel: {
        id: 'uni.application:formerEducation.educationDetails.beginningDateLabel',
        defaultMessage: 'Upphaf náms',
        description: 'Beginning date input label',
      },
      endDateLabel: {
        id: 'uni.application:formerEducation.educationDetails.endDateLabel',
        defaultMessage: 'Námslok',
        description: 'End date input label',
      },
      moreDetailsLabel: {
        id: 'uni.application:formerEducation.educationDetails.moreDetailsLabel',
        defaultMessage: 'Nánari upplýsingar um nám eða annað sem skiptir máli',
        description: 'More info input label',
      },
      degreeFinishedCheckboxLabel: {
        id: 'uni.application:formerEducation.educationDetails.degreeFinishedCheckboxLabel',
        defaultMessage: 'Námi lokið',
        description: 'Degree finised checkbox label',
      },
      degreeFileUploadTitle: {
        id: 'uni.application:formerEducation.educationDetails.degreeFileUploadTitle',
        defaultMessage: 'Prófskírteini/Námsferill',
        description: 'Degree file upload label',
      },
      degreeExemptionUploadTitle: {
        id: 'uni.application:formerEducation.educationDetails.degreeExemptionUploadTitle',
        defaultMessage: 'Fylgigögn',
        description: 'Degree exemption file upload label',
      },
      informationAlertDescription: {
        id: 'uni.application:formerEducation.educationDetails.informationAlertDescription',
        defaultMessage:
          'Athugið að upplýsingar um stúdentspróf koma sjálfkrafa inn frá Innu eftir að prófi er lokið, en hægt er að hlaða inn upplýsingum um annað nám sem skiptir máli  fyrir umsóknina.',
        description: 'Infomration alert description',
      },
    }),
    otherDocuments: defineMessages({
      pageTitle: {
        id: 'uni.application:formerEducation.otherDocuments.pageTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'other education documents page title',
      },
      pageDescription: {
        id: 'uni.application:formerEducation.otherDocuments.pageDescription',
        defaultMessage:
          'Vinsamlegast settu inn eftirfarandi fylgigögn sem nauðsynleg eru fyrir umsóknina þína.',
        description: 'other education documents page description',
      },
    }),
  },
}
