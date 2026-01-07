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
      id: 'vmst.ub.application:education.general.pageDescription#markdown',
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
    currentStudiesDescriptionTitle: {
      id: 'vmst.ub.application:education.labels.currentStudiesDescriptionTitle',
      defaultMessage: 'Núverandi nám',
      description: 'Currently studying description title',
    },
    studyingLastSemesterDescriptionTitle: {
      id: 'vmst.ub.application:education.labels.studyingLastSemesterDescriptionTitle',
      defaultMessage: 'Nám síðustu annar',
      description: 'Studying last semester description title',
    },
    finishedLastTwelveMonthsDescriptionTitle: {
      id: 'vmst.ub.application:education.labels.finishedLastTwelveMonthsDescriptionTitle',
      defaultMessage: 'Námi lokið á síðustu 12 mánuðum',
      description: 'Studying finished last twelve months description title',
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
    levelOfStudyLabel: {
      id: 'vmst.ub.application:education.labels.levelOfStudyLabel',
      defaultMessage: 'Námsstig',
      description: 'School level of study label',
    },
    courseOfStudyLabel: {
      id: 'vmst.ub.application:education.labels.courseOfStudyLabel',
      defaultMessage: 'Námsbraut',
      description: 'Course of study label',
    },
    schoolProgramUnitsLabel: {
      id: 'vmst.ub.application:education.labels.schoolProgramUnitsLabel',
      defaultMessage: 'Einingafjöldi',
      description: 'School program units label',
    },
    schoolProgramUnitsLabelPerSemester: {
      id: 'vmst.ub.application:education.labels.schoolProgramUnitsLabelPerSemester',
      defaultMessage: 'Einingafjöldi annar',
      description: 'School program units per semester label',
    },
    schoolDegreeLabel: {
      id: 'vmst.ub.application:education.labels.schoolDegreeLabel',
      defaultMessage: 'Prófgráða',
      description: 'School degree label',
    },
    expectedEndOfStudyLabel: {
      id: 'vmst.ub.application:education.labels.schoolEndDateLabel',
      defaultMessage: 'Áætluð námslok',
      description: 'School end date label',
    },
    previousSchoolEndDate: {
      id: 'vmst.ub.application:education.labels.previousSchoolEndDate',
      defaultMessage: 'Námslok',
      description: 'School end date label',
    },
    currentSchoolDegreeInformation: {
      id: 'vmst.ub.application:education.labels.currentSchoolDegreeInformation',
      defaultMessage:
        'Þú þarft að skila inn staðfestingu á að þú hafið verið í námi á önninni. Engar áhyggjur þó þú sért ekki með skjalið klárt. Þú getur vel klárað umsóknina og skilað inn skjalinu á Mínum síðum Vinnumálastofnunar síðar.',
      description: 'current education file description',
    },
    currentSchoolDegreeFileNameLabel: {
      id: 'vmst.ub.application:education.labels.schoolDegreeFileNameLabel',
      defaultMessage: 'Staðfesting á núverandi námi',
      description: 'Current education file name label',
    },
    lastSemesterSchoolDegreeInformation: {
      id: 'vmst.ub.application:education.labels.lastSemesterSchoolDegreeInformation',
      defaultMessage:
        'Þú þarft að skila inn staðfestingu á námi síðustu annar. Engar áhyggjur þó þú sért ekki með skjalið klárt. Þú getur vel klárað umsóknina og skilað inn skjalinu á Mínum síðum Vinnumálastofnunar síðar.',
      description: 'last semester confirmation description',
    },
    lastSemesterSchoolDegreeFileNameLabel: {
      id: 'vmst.ub.application:education.labels.lastSemesterSchoolDegreeFileNameLabel',
      defaultMessage: 'Staðfesting á námi síðustu annar',
      description: 'last semester confirmation file name label',
    },
    graduatedSchoolDegreeInformation: {
      id: 'vmst.ub.application:education.labels.graduatedSchoolDegreeInformation',
      defaultMessage:
        'Hafir þú lokið námi með prófgráðu á síðustu tólf mánuðum kann það að hækka bótarétt þinn og jafngildir þremur mánuðum í 100% starfshlutfalli. Engar áhyggjur þó þú sért ekki með skjalið klárt. Þú getur vel klárað umsóknina og skilað inn skjalinu á Mínum síðum Vinnumálastofnunar síðar.',
      description: 'graduation confirmation file name label',
    },
    graduatedSchoolDegreeFileNameLabel: {
      id: 'vmst.ub.application:education.labels.graduatedSchoolDegreeFileNameLabel',
      defaultMessage: 'Staðfesting á prófgráðu',
      description: 'graduation confirmation file name label',
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
    endOfStudiesPlaceholder: {
      id: 'vmst.ub.application:education.labels.endOfStudiesPlaceholder',
      defaultMessage: 'Námi ólokið',
      description: 'Study not completed label',
    },
    endOfStudies: {
      id: 'vmst.ub.application:education.labels.endOfStudies',
      defaultMessage: 'Námslok',
      description: 'End of studies label',
    },
    sameAsCurrentEducationCheckbox: {
      id: 'vmst.ub.application:education.labels.sameAsCurrentEducationCheckbox',
      defaultMessage: 'Sama og núverandi nám',
      description: 'Same as current education checkbox label',
    },
    sameAsLastSemesterEducationCheckbox: {
      id: 'vmst.ub.application:education.labels.sameAsLastSemesterEducationCheckbox',
      defaultMessage: 'Sama og nám síðustu annar',
      description: 'Same as last semester education checkbox label',
    },
    addItemButtonText: {
      id: 'vmst.ub.application:education.labels.addItemButtonText',
      defaultMessage: 'Bæta við námi',
      description: 'Add item button text',
    },
    educationHistoryTitle: {
      id: 'vmst.ub.application:education.labels.educationHistoryTitle',
      defaultMessage: 'Fyrra nám',
      description: 'Education history title',
    },
  }),
}
