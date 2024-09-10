import { defineMessages } from 'react-intl'

export const property = {
  general: defineMessages({
    sectionTitle: {
      id: 'mc.application:property.general.sectionTitle',
      defaultMessage: 'Eign',
      description: 'Pending rejected section title',
    },
    pageTitle: {
      id: 'mc.application:property.general.pageTitle',
      defaultMessage: 'Upplýsingar um eign',
      description: 'Pending rejected page title',
    },
  }),
  labels: defineMessages({
    mortgageCertificateInboxLink: {
      id: 'mc.application:property.labels.mortgageCertificateInboxLink',
      defaultMessage: 'https://island.is/minarsidur/postholf',
      description: 'Link to the island.is inbox',
    },
    pendingRejectedTryAgainDescription: {
      id: 'mc.application:property.labels.pendingRejectedTryAgainDescription',
      defaultMessage:
        'Hér birtast upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert þinglýstur eigandi að. Vinsamlegast hakaðu við þá eign sem þú ert að sækja veðbókarvottorð fyrir.',
      description:
        'Here is information from the Property Registry about your real estate, lands and plots that you are a registered owner of. Please check the property for which you are applying for a mortgage certificate.',
    },
    propertyErrorCertificateTitle: {
      id: 'mc.application:property.labels.propertyErrorCertificateTitle',
      defaultMessage: 'Ekki tókst að sækja veðbókavottorð fyrir þessa eign',
      description: 'Failed to retrieve mortgage certificate for this property',
    },
    propertyErrorCertificateMessage: {
      id: 'mc.application:property.labels.propertyErrorCertificateMessage',
      defaultMessage:
        'Því miður getum við ekki sótt rafrænt veðbókarvottorð fyrir valda eign þar sem skráning á viðkomandi eign þarnast uppfærslu. Sýslumanni í því umdæmi sem eignin er í verður send beiðni um lagfæringu, þú munt fá tilkynningu (á netfang) að yfirferð lokinni og getur þá reynt aftur.',
      description:
        'Sorry, we are unable to download an electronic mortgage certificate for the selected property as the listing of the property in question needs updating. The district commissioner of the property in which the property is located will be sent a request for repairs, you will be notified (by email) after the inspection and can then try again.',
    },
    propertyErrorCertificateSheriffTitle: {
      id: 'mc.application:property.labels.propertyErrorCertificateSheriffTitle',
      defaultMessage:
        'Beiðni um lagfæringu á veðbókarvottorði hefur verið send sýslumanni',
      description:
        'A request for correction of the mortgage certificate has been sent to the district commissioner',
    },
    propertyErrorCertificateSheriffMessage: {
      id: 'mc.application:property.labels.propertyErrorCertificateSheriffMessage',
      defaultMessage:
        'Þú munt fá tilkynningu á netfangið [netfang] að yfirferð lokinni og getur þá reynt aftur og klárað umsóknina þína.',
      description:
        'You will be notified by email [email address] after the review and can then try again and complete your application.',
    },
    propertyCertificateError: {
      id: 'mc.application:property.labels.propertyCertificateError',
      defaultMessage: 'Ekki gekk að sækja vottorð fyrir þessa eign',
      description: 'Failed to fetch certificate for this property',
    },
    propertyCertificateErrorContactSheriff: {
      id: 'mc.application:property.labels.propertyCertificateErrorContactSheriff',
      defaultMessage:
        'Vinsamlega hafðu samband við sýslumann, það er búið að senda inn beiðni um leiðréttingu',
      description:
        'Please contact the sheriff, a request for correction has been submitted',
    },
    mysites: {
      id: 'mc.application:property.labels.mysites',
      defaultMessage: 'Mínar síður',
      description: 'My sites',
    },
    requestForProcessing: {
      id: 'mc.application:property.labels.requestForProcessing',
      defaultMessage: 'Eign',
      description: 'Property',
    },
    selectedProperty: {
      id: 'mc.application:property.labels.selectedProperty',
      defaultMessage: 'Valin fasteign',
      description: 'Selected property',
    },
  }),
}
