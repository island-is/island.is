import { defineMessages } from 'react-intl'

export const hindrances = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:hindrances.general.sectionTitle',
      defaultMessage: 'Almennt ',
      description: 'Hindrances',
    },
  }),
  carAccident: defineMessages({
    radioFieldTitle: {
      id: 'an.application:hindrances.carAccident.radioFieldTitle',
      defaultMessage:
        'Varðar slysið skráningarskylt ökutæki með lögboðna ábyrgðartryggingu?',
      description: 'Did the accident take place in a car?',
    },
    errorTitle: {
      id: 'an.application:hindrances.carAccident.errorTitle',
      defaultMessage: 'Athugið ',
      description: 'Notice',
    },
    errorDescription: {
      id: 'an.application:hindrances.carAccident.errorDescription',
      defaultMessage:
        'Með lagabreytingu, sem tók gildi 1. janúar 2014,  er tjón sem verður vegna bílslyss ekki bótaskylt hjá Sjúkratryggingum Íslands ef tjónið er bótaskylt hjá vátryggingafélagi samkvæmt lögboðinni ábyrgðartryggingu ökutækis eða lögboðinni slysatryggingu ökumanns og eiganda. Þessi breyting gildir aðeins um slys sem verða 1. janúar 2014 eða síðar.',
      description:
        'With an amendment to the law, which came into force on 1 January 2014, what happens due to a car accident is not liable to Sjúkratryggingar Íslands if the damage is liable to an insurance company according to the compulsory liability insurance of the vehicle or the compulsory accident insurance of the driver and owner. This change only applies to accidents that occur on or after January 1, 2014.',
    },
  }),
  timePassedHindrance: defineMessages({
    radioFieldTitle: {
      id: 'an.application:hindrances.timePassedHindrance.radioFieldTitle',
      defaultMessage: 'Er meira en eitt ár síðan að slysið átti sér stað?',
      description: 'Has it been more than a year since the accident occured?',
    },
    errorTitle: {
      id: 'an.application:hindrances.timePassedHindrance.errorTitle',
      defaultMessage: 'Athugið ',
      description: 'Notice',
    },
    errorDescription: {
      id: 'an.application:hindrances.timePassedHindrance.errorDescription',
      defaultMessage:
        'Öll slys ber að tilkynna innan eins árs. Mikilvægt er að tilkynningar séu rétt útfylltar. Ef tilkynningaskylda er vanrækt skal það ekki vera því til fyrirstöðu að sá slasaði eða vandamenn geti gert kröfu til bóta. Heimilt er að veita undanþágu þótt meira en ár sé liðið ef atvik slyss eru alveg ljós og drátturinn torveldar ekki gagnaöflun um atriði sem skipta máli. Þá er það skilyrði að unnt sé að meta orsakasamband slyssins og heilsutjóns slasaða.',
      description:
        'All accidents must be reported within one year. It is important that the notifications are filled in correctly and in the original. If the duty to notify is neglected, it shall not be an obstacle for the injured party or relatives to make a claim for compensation. An exemption may be granted even if more than one year has elapsed if the circumstances of the accident are completely clear and the delay does not impede the collection of data on matters of importance. It is also a condition that it is possible to assess the causal link between the accident and the health damage to the injured.',
    },
  }),
}
