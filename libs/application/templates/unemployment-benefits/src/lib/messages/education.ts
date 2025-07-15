import { defineMessages } from 'react-intl'

export const education = {
  general: defineMessages({
    sectionTitle: {
      id: 'vmst.ub.application:education.general.sectionTitle',
      defaultMessage: 'Menntun',
      description: 'Education section title',
    },
    pageTitle: {
      id: 'vmst.ub.application:education.general.pageTitle',
      defaultMessage: 'Menntun',
      description: 'education section page title',
    },
    pageDescription: {
      id: 'vmst.ub.application:education.general.pageDescription',
      defaultMessage:
        'Einstaklingar í námi eiga yfirleitt ekki rétt á atvinnuleysisbótum. Það eru þó undantekningar á þessu, til dæmis ef nám er 20 einingar eða minna, einstaklingur missir vinnu eftir að önn hefst eða námið er skilgreint sem nám með vinnu.',
      description: 'education section page description',
    },
  }),
  labels: defineMessages({
    lastTvelveMonthsLabel: {
      id: 'vmst.ub.application:education.labels.lastTvelveMonthsLabel',
      defaultMessage: 'Hefur þú verið í námi á síðastliðnum 12 mánuðum?',
      description: 'Has been in school for the last 12 months',
    },
    typeOfEducationLabel: {
      id: 'vmst.ub.application:education.labels.typeOfEducationLabel',
      defaultMessage: 'Merktu við það sem á við',
      description: 'type of education label',
    },
    currentlyEducationLabel: {
      id: 'vmst.ub.application:education.labels.currentEducationLabel',
      defaultMessage: 'Ég er skráð/ur í nám núna',
      description: 'Currently education label',
    },
    lastSemesterEducationLabel: {
      id: 'vmst.ub.application:education.labels.lastSemesterEducationLabel',
      defaultMessage: 'Ég var skráð/ur í nám á síðustu námsönn',
      description: 'Last semester education label',
    },
    lastTvelveMonthsEducationLabel: {
      id: 'vmst.ub.application:education.labels.lastTvelveMonthsEducationLabel',
      defaultMessage: 'Ég lauk námi á síðustu 12 mánuðum',
      description: 'Last twelve months education label',
    },
    typeOfEducationDescription: {
      id: 'vmst.ub.application:education.labels.typeOfEducationDescription',
      defaultMessage:
        'Vinsamlegast skráðu inn eftirfarandi upplýsingar um námið',
      description: 'Type of education description',
    },
    schoolNameLabel: {
      id: 'vmst.ub.application:education.labels.schoolNameLabel',
      defaultMessage: 'Skóli',
      description: 'School name label',
    },
    schoolProgramLabel: {
      id: 'vmst.ub.application:education.labels.schoolProgramLabel',
      defaultMessage: 'Námsstig',
      description: 'School program label',
    },
    schoolProgramUnitsLabel: {
      id: 'vmst.ub.application:education.labels.schoolProgramUnitsLabel',
      defaultMessage: 'Einingafjöldi',
      description: 'School program units label',
    },
    schoolDegreeLabel: {
      id: 'vmst.ub.application:education.labels.schoolDegreeLabel',
      defaultMessage: 'Námsgráða',
      description: 'School degree label',
    },
    currentSchoolEndDateLabel: {
      id: 'vmst.ub.application:education.labels.schoolEndDateLabel',
      defaultMessage: 'Áætluð námslok',
      description: 'School end date label',
    },
    previousSchoolEndDate: {
      id: 'vmst.ub.application:education.labels.previousSchoolEndDate',
      defaultMessage: 'Námslok',
      description: 'School end date label',
    },
    currentSchoolDegreeFileLabel: {
      id: 'vmst.ub.application:education.labels.schoolDegreeFileLabel',
      defaultMessage:
        'Þú þarft alltaf að skila inn staðfestingu á námi og/eða prófgráðu. Þú getur hlaðið því inn hér að neðan.',
      description: 'School degree file label',
    },
    currentSchoolDegreeFileNameLabel: {
      id: 'vmst.ub.application:education.labels.schoolDegreeFileNameLabel',
      defaultMessage: 'Staðfesting á námi/prófgráðu',
      description: 'School degree file name label',
    },
    currentSchoolDegreeFileNameDescription: {
      id: 'vmst.ub.application:education.labels.currentSchoolDegreeFileNameDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'Upload description for school degree file',
    },
    lastSemesterQuestion: {
      id: 'vmst.ub.application:education.labels.lastSemesterQuestion',
      defaultMessage: 'Lauk því námi með prófgráðu?',
      description: 'Last semester question label',
    },
    lastSemesterAlertMessage: {
      id: 'vmst.ub.application:education.labels.lastSemesterAlertMessage',
      defaultMessage:
        'Hafir þú lokið námi með prófgráðu á síðustu tólf mánuðum kann það að hækka bótarétt þinn og jafngildir þremur mánuðum í 100% starfshlutfalli. Þú þarft þá að hlaða inn útskriftarvottorði t.d. prófskírteini hér að neðan.',
      description: 'Last semester alert message',
    },
    appliedForNextSemesterQuestion: {
      id: 'vmst.ub.application:education.labels.appliedForNextSemesterQuestion',
      defaultMessage: 'Ertu skráð/ur í nám á næstu önn?',
      description: 'Applied for next semester question label',
    },
    appliedForNextSemesterTextarea: {
      id: 'vmst.ub.application:education.labels.appliedForNextSemesterTextarea',
      defaultMessage: 'Skýringar á námslokum',
      description: 'Applied for next semester textarea label',
    },
  }),
}
