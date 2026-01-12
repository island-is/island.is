import { defineMessages } from 'react-intl'

import { Substance } from '@island.is/judicial-system/types'
import { Gender } from '@island.is/judicial-system-web/src/graphql/schema'

export const strings = {
  ...defineMessages({
    incidentDescriptionDrunkDrivingAutofill: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_drunk_driving_auto_fill',
      defaultMessage: 'undir áhrifum áfengis',
      description:
        'Notaður sem ástæða í atvikalýsingu fyrir "ölvunarakstur" brot.',
    },
    incidentDescriptionIllegalDrugsDrivingAutofill: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_illegal_drugs_driving_auto_fill',
      defaultMessage: 'ávana- og fíkniefna',
      description:
        'Notaður sem ástæða í atvikalýsingu fyrir "fíkniefnaakstur" brot.',
    },
    incidentDescriptionPrescriptionDrugsDrivingAutofill: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_prescription_drugs_driving_auto_fill',
      defaultMessage: 'slævandi lyfja',
      description:
        'Notaður sem ástæða í atvikalýsingu fyrir "lyfjaakstur" brot.',
    },
    incidentDescriptionSubstancesPrefixAutofill: {
      id: 'judicial.system.core:indictments_indictment.indictment_count.incident_description_substances_prefix_auto_fill',
      defaultMessage: 'í blóðsýni mældist',
      description:
        'Notaður sem upphafstexti fyrir efni í blóði í atvikalýsingu.',
    },
    [Substance.ALCOHOL]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.alcohol',
      defaultMessage: 'vínandamagn {amount} \u2030',
      description: 'Notaður fyrir vínandamagn í blóði.',
    },
    [Substance.AMPHETAMINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.amphetamine',
      defaultMessage: 'amfetamín {amount} ng/ml',
      description: 'Notaður fyrir amfetamín í blóði.',
    },
    [Substance.ETIZOLAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.etizolam',
      defaultMessage: 'etízólam {amount} ng/ml',
      description: 'Notaður fyrir etízólam í blóði.',
    },
    [Substance.PHENAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.phenazepam',
      defaultMessage: 'fenazepam {amount} ng/ml',
      description: 'Notaður fyrir fenazepam í blóði.',
    },
    [Substance.KETAMINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.ketamine',
      defaultMessage: 'ketamín {amount} ng/ml',
      description: 'Notaður fyrir ketamín í blóði.',
    },
    [Substance.KETOBEMIDONE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.ketobemidone',
      defaultMessage: 'ketobemidone {amount} ng/ml',
      description: 'Notaður fyrir ketobemidone í blóði.',
    },
    [Substance.COCAINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.cocaine',
      defaultMessage: 'kókaín {amount} ng/ml',
      description: 'Notaður fyrir kókaín í blóði.',
    },
    [Substance.MDMA]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.mdma',
      defaultMessage: 'mDMA {amount} ng/ml',
      description: 'Notaður fyrir mDMA í blóði.',
    },
    [Substance.METHAMPHETAMINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.methamphetamine',
      defaultMessage: 'metamfetamín {amount} ng/ml',
      description: 'Notaður fyrir metamfetamín í blóði.',
    },
    [Substance.METHYLPHENIDATE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.methylphenidate',
      defaultMessage: 'metýlfenídat {amount} ng/ml',
      description: 'Notaður fyrir metýlfenídat í blóði.',
    },
    [Substance.OLANZAPIN]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.olanzapin',
      defaultMessage: 'olanzapín {amount} ng/ml',
      description: 'Notaður fyrir olanzapín í blóði.',
    },
    [Substance.O_DESMETHYLTRAMADOL]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.o_desmethyltramadol',
      defaultMessage: 'o-Desmetýltramadól {amount} ng/ml',
      description: 'Notaður fyrir O-desmetýltramadól í blóði.',
    },
    [Substance.TETRAHYDROCANNABINOL]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.tetrahydrocannabinol',
      defaultMessage: 'tetrahýdrókannabínól {amount} ng/ml',
      description: 'Notaður fyrir tetrahýdrókannabínól í blóði.',
    },
    [Substance.TRAMADOL]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.tramadol',
      defaultMessage: 'tramadól {amount} ng/ml',
      description: 'Notaður fyrir tramadól í blóði.',
    },
    [Substance.ZOPICLONE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.zopiclone',
      defaultMessage: 'zópíklón {amount} ng/ml',
      description: 'Notaður fyrir zópíklón í blóði.',
    },
    [Substance.ALPRAZOLAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.alprazolam',
      defaultMessage: 'alprazólam {amount} ng/ml',
      description: 'Notaður fyrir alprazólam í blóði',
    },
    [Substance.BROMAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.bromazepam',
      defaultMessage: 'brómazepam {amount} ng/ml',
      description: 'Notaður fyrir brómazepam í blóði',
    },
    [Substance.BROMAZOLAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.bromazolam',
      defaultMessage: 'brómazólam {amount} ng/ml',
      description: 'Notaður fyrir brómazólam í blóði',
    },
    [Substance.BUPRENORPHINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.buprenorphine',
      defaultMessage: 'búprenorfín {amount} ng/ml',
      description: 'Notaður fyrir búprenorfín í blóði',
    },
    [Substance.DEMOXEAPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.demoxeapam',
      defaultMessage: 'demoxeapam {amount} ng/ml',
      description: 'Notaður fyrir demoxeapam í blóði',
    },
    [Substance.DESMETHYLCHLORDIAZEPOXIDE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.desmethylchlordiazepoxide',
      defaultMessage: 'desmetýlklórdíazepoxíð {amount} ng/ml',
      description: 'Notaður fyrir desmetýlklórdíazepoxíð í blóði',
    },
    [Substance.DIAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.diazepam',
      defaultMessage: 'díazepam {amount} ng/ml',
      description: 'Notaður fyrir díazepam í blóði',
    },
    [Substance.FENTANYL]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.fentanyl',
      defaultMessage: 'fentanýl {amount} ng/ml',
      description: 'Notaður fyrir fentanýl í blóði',
    },
    [Substance.FLUNITRAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.flunitrazepam',
      defaultMessage: 'flúnitrazepam {amount} ng/ml',
      description: 'Notaður fyrir flúnitrazepam í blóði',
    },
    [Substance.FLUALPRAZOLAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.flualprazolam',
      defaultMessage: 'flúalprazólam {amount} ng/ml',
      description: 'Notaður fyrir flúalprazólam í blóði',
    },
    [Substance.GABAPENTIN]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.gabapentin',
      defaultMessage: 'gabapentín {amount} µg/ml',
      description: 'Notaður fyrir gabapentín í blóði',
    },
    [Substance.CLONAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.clonazepam',
      defaultMessage: 'klónazepam {amount} ng/ml',
      description: 'Notaður fyrir klónazepam í blóði',
    },
    [Substance.CHLORDIAZEPOXIDE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.chlordiazepoxide',
      defaultMessage: 'klórdíazepoxíð {amount} ng/ml',
      description: 'Notaður fyrir klórdíazepoxíð í blóði',
    },
    [Substance.CODEINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.codeine',
      defaultMessage: 'kódein {amount} ng/ml',
      description: 'Notaður fyrir kódein í blóði',
    },
    [Substance.LORAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.lorazepam',
      defaultMessage: 'lorazepam {amount} ng/ml',
      description: 'Notaður fyrir lorazepam í blóði',
    },
    [Substance.METHADONE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.methadone',
      defaultMessage: 'metadón {amount} ng/ml',
      description: 'Notaður fyrir metadón í blóði',
    },
    [Substance.MIDAZOLAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.midazolam',
      defaultMessage: 'mídazólam {amount} ng/ml',
      description: 'Notaður fyrir mídazólam í blóði',
    },
    [Substance.MORPHINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.morphine',
      defaultMessage: 'morfín {amount} ng/ml',
      description: 'Notaður fyrir morfín í blóði',
    },
    [Substance.NITRAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.nitrazepam',
      defaultMessage: 'nítrazepam {amount} ng/ml',
      description: 'Notaður fyrir nítrazepam í blóði',
    },
    [Substance.NORBUPRENORPHINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.norbuprenorphine',
      defaultMessage: 'norbúprenorfín {amount} ng/ml',
      description: 'Notaður fyrir norbúprenorfín í blóði',
    },
    [Substance.NORDIAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.nordiazepam',
      defaultMessage: 'nordíazepam {amount} ng/ml',
      description: 'Notaður fyrir nordíazepam í blóði',
    },
    [Substance.OXAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.oxazepam',
      defaultMessage: 'oxazepam {amount} ng/ml',
      description: 'Notaður fyrir oxazepam í blóði',
    },
    [Substance.OXYCODONE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.oxycodone',
      defaultMessage: 'oxýkódon {amount} ng/ml',
      description: 'Notaður fyrir oxýkódon í blóði',
    },
    [Substance.PREGABALIN]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.pregabalin',
      defaultMessage: 'pregabalín {amount} µg/ml',
      description: 'Notaður fyrir pregabalín í blóði',
    },
    [Substance.QUETIAPINE]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.quetiapine',
      defaultMessage: 'quetíapín {amount} ng/ml',
      description: 'Notaður fyrir quetíapín í blóði',
    },
    [Substance.TEMAZEPAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.temazepam',
      defaultMessage: 'temazepam {amount} ng/ml',
      description: 'Notaður fyrir temazepam í blóði',
    },
    [Substance.TRIAZOLAM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.triazolam',
      defaultMessage: 'tríazólam {amount} ng/ml',
      description: 'Notaður fyrir tríazólam í blóði',
    },
    [Substance.ZOLPIDEM]: {
      id: 'judicial.system.core:indictments_indictment.indictment_offense_count_enum.zolpidem',
      defaultMessage: 'zolpídem {amount} ng/ml',
      description: 'Notaður fyrir zolpídem í blóði',
    },
  }),
  incidentDescriptionDrivingWithoutLicenceAutofill: {
    [Gender.MALE]: 'sviptur ökurétti',
    [Gender.FEMALE]: 'svipt ökurétti',
    [Gender.OTHER]: 'svipt ökurétti',
  },
  incidentDescriptionDrugsDrivingPrefixAutofill: {
    [Gender.MALE]: 'óhæfur til að stjórna henni örugglega vegna áhrifa',
    [Gender.FEMALE]: 'óhæf til að stjórna henni örugglega vegna áhrifa',
    [Gender.OTHER]: 'óhæft til að stjórna henni örugglega vegna áhrifa',
  },
  incidentDescriptionDrivingWithoutValidLicenceAutofill:
    'án gildra ökuréttinda',
  incidentDescriptionDrivingWithoutEverHavingLicenceAutofill:
    'án þess að hafa öðlast ökurétt',
}
