import { defineMessages } from 'react-intl'

export const gender = {
  general: defineMessages({
    title: {
        id: 'ctao.application:gender.title',
        defaultMessage: 'Kyn kvartanda',
        description: 'Gender page title',
    },
    gender: {
        id: 'ctao.application:gender.general.gender',
        defaultMessage: 'Kyn',
        description: 'Complainers gender',
    },
    genderOptionMale: {
        id: 'ctao.application:gender.general.genderOptionMale',
        defaultMessage: 'Karl/Karlkyns',
        description: 'Male gender option',
    },
    genderOptionFemale: {
        id: 'ctao.application:gender.general.genderOptionFemale',
        defaultMessage: 'Kona/Kvenkyns',
        description: 'Female gender option',
    },
    genderOptionNonbinary: {
        id: 'ctao.application:gender.general.genderOptionNonbinary',
        defaultMessage: 'Kvár/Kynsegin',
        description: 'Nonbinary gender option',
    },
    genderOptionOther: {
        id: 'ctao.application:gender.general.genderOptionOther',
        defaultMessage: 'Annað',
        description: 'Other gender option',
    },
    genderOptionDeclinedToAnswer: {
        id: 'ctao.application:gender.general.genderOptionDeclinedToAnswer',
        defaultMessage: 'Vil ekki svara',
        description: 'Declined to answer gender option',
    },
    genderJustification: {
        id: 'ctao.application:gender.general.genderJustification',
        defaultMessage:
            'Þessara upplýsinga er eingöngu óskað til þess að hægt sé að vinna tölfræði um þá hópa sem leita til umboðsmanns Alþingis. Þær verða ekki nýttar í öðrum og ósamrýmanlegum tilgangi.',
        description:
            'Explanation for why the complainers gender is being asked for',
    },
  }),
}
