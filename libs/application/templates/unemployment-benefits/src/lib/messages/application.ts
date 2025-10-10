import { defineMessages } from 'react-intl'

export const application = defineMessages({
  name: {
    id: 'vmst.ub.application:name',
    defaultMessage: 'Umsókn um atvinnuleysisbætur',
    description: `Application's name`,
  },
  institutionName: {
    id: 'vmst.ub.application:institution',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  actionCardPrerequisites: {
    id: 'vmst.ub.application:actionCardPrerequisites',
    defaultMessage: 'Gagnaöflun',
    description:
      'Description of application state/status when the application is in prerequisites',
  },
  actionCardDraft: {
    id: 'vmst.ub.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description:
      'Description of application state/status when the application is in draft',
  },
  actionCardSubmitted: {
    id: 'vmst.ub.application:actionCardSubmitted',
    defaultMessage: 'Innsend',
    description:
      'Description of application state/status when application is submitted',
  },
  firstSectionTitle: {
    id: 'vmst.ub.application:firstSectionTitle',
    defaultMessage: 'Fyrri hluti: Þinn réttur til atvinnuleysisbóta',
    description: 'Title of first section page',
  },
  firstSectionDescription: {
    id: 'vmst.ub.application:firstSectionDescription',
    defaultMessage:
      'Eftirfarandi kafli snýr að því að safna upplýsingum um núverandi eða fyrrverandi stöðu þína á atvinnumarkaði svo hægt sé að reikna út hvort eða hve miklar atvinnuleysisbætur þú hefur rétt á.',
    description: 'Description of first section page',
  },
  secondSectionTitle: {
    id: 'vmst.ub.application:secondSectionTitle',
    defaultMessage: 'Seinni hluti: Atvinnuleitin',
    description: 'Title of second section page',
  },
  secondSectionDescription: {
    id: 'vmst.ub.application:secondSectionDescription',
    defaultMessage:
      'Í fyrri hluta gafstu upp þær upplýsingar sem ákvarða bótarétt þinn. Til að halda atvinnuleysisbótum þarftu að vera virk/ur í atvinnuleit. Vinnumálastofnun getur aðstoðað þig í atvinnuleitinni. Framundan ert beðið um upplýsingar sem geta hjálpað okkur við að finna starf sem hentar þér. Gangi þér vel!',
    description: 'Description of second section page',
  },
  agreeCheckbox: {
    id: 'vmst.ub.application:agreeCheckbox',
    defaultMessage: 'Ég skil',
    description: 'Agree checkbox label',
  },
  fileUploadAcceptFiles: {
    id: 'vmst.ub.application:fileUploadAcceptFiles',
    defaultMessage:
      'Tekið er við skjölum með endingu: pdf, .doc, .docx, .png, .jpg, .jpeg',
    description: 'description for file uploads',
  },
  successSubmissionTitle: {
    id: 'vmst.ub.application:successSubmissionTitle',
    defaultMessage:
      'Vinnumálastofnun hefur móttekið umsókn þína og er hún komin til afgreiðslu.',
    description: 'Successful submission title',
  },
  successSubmissionDescription: {
    id: 'vmst.ub.application:successSubmissionDescription',
    defaultMessage:
      'Við sendum þér tilkynningu í tölvupósti um skilaboð á Mínum síðum ef þörf er á frekari gögnum eða  þegar umsókn þín hefur verið afgreidd.',
    description: 'Successful submission description',
  },
  whatHappensNextContent: {
    id: 'vmst.ub.application:whatHappensNextContent#markdown',
    defaultMessage: `* Yfirferð umsóknar - Starfsfólk Vinnumálastofnunar fer yfir umsókn þína og öll fylgigögn.
    \n* Vinnsla - Venjulegur afgreiðslutími er 4-6 vikur, en getur verið lengri á álagstímum.
    \n* Ákvörðun - Þú færð senda tilkynningu um úrskurð á Mínum síðum.`,
    description: 'what happens next description',
  },
  infoAlertTitle: {
    id: 'vmst.ub.application:infoAlertTitle',
    defaultMessage: 'Er eitthvað óljóst',
    description: 'Info alert title on confirmation page',
  },
  infoAlertDescription: {
    id: 'vmst.ub.application:infoAlertDescription',
    defaultMessage:
      'Skoðaðu nánari upplýsingar á upplýsingasíðu Vinnumálastofnunar. Spjallaðu við Ask',
    description: 'Info alert title on confirmation page',
  },
})
