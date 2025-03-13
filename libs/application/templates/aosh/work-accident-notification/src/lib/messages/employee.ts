import { defineMessages } from 'react-intl'

export const employee = {
  employee: defineMessages({
    pageTitle: {
      id: 'aosh.wan.application:employee.pageTitle',
      defaultMessage: 'Starfsmaður',
      description: 'Title of employee page',
    },
    description: {
      id: 'aosh.wan.application:employee.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of employee page',
    },
    employeeInformation: {
      id: 'aosh.wan.application:employee.employeeInformation',
      defaultMessage: 'Upplýsingar um starfsmann',
      description: 'Heading above employee information section',
    },
    ssn: {
      id: 'aosh.wan.application:employee.ssn',
      defaultMessage: 'Kennitala',
      description: 'Social security number',
    },
    name: {
      id: 'aosh.wan.application:employee.name',
      defaultMessage: 'Nafn starfsmanns',
      description: 'Employee name',
    },
    address: {
      id: 'aosh.wan.application:employee.address',
      defaultMessage: 'Heimilisfang',
      description: 'Employees address',
    },
    municipality: {
      id: 'aosh.wan.application:employee.municipality',
      defaultMessage: 'Póstnúmer og sveitarfélag',
      description: 'Postnumber and municipality',
    },
    nationality: {
      id: 'aosh.wan.application:employee.nationality',
      defaultMessage: 'Þjóðerni',
      description: 'Nationality',
    },
    workArrangement: {
      id: 'aosh.wan.application:employee.workArrangement',
      defaultMessage: 'Starfstillhögun starfsmanns',
      description: 'Work arrangement of employee',
    },
    employmentStatus: {
      id: 'aosh.wan.application:employee.employmentStatus',
      defaultMessage: 'Ráðningarstaðar',
      description: 'Status of employement',
    },
    startDate: {
      id: 'aosh.wan.application:employee.startDate',
      defaultMessage: 'Hóf störf hjá fyrirtækinu',
      description: 'Started working for the company',
    },
    tempEmploymentSSN: {
      id: 'aosh.wan.application:employee.tempEmploymentSSN',
      defaultMessage: 'Kennitala starfsmannaleigu',
      description: 'SSN for temporary employment',
    },
    employmentTime: {
      id: 'aosh.wan.application:employee.employmentTime',
      defaultMessage: 'Starfstími í sama starfi',
      description: 'Employment time in the same job',
    },
    employmentRate: {
      id: 'aosh.wan.application:employee.employmentRate',
      defaultMessage: 'Starfshlutfall',
      description: 'Employment rate %',
    },
    workhourArrangement: {
      id: 'aosh.wan.application:employee.workhourArrangement',
      defaultMessage: 'Tilhögun á vinnutíma',
      description: 'Employees work hour arrangement',
    },
    startOfWorkdayDate: {
      id: 'aosh.wan.application:employee.startOfWorkdayDate',
      defaultMessage: 'Dagsetning',
      description: 'Start of employees workday date',
    },
    time: {
      id: 'aosh.wan.application:employee.time',
      defaultMessage: 'Tími',
      description: 'Start of employees workday time',
    },
    timePlaceholder: {
      id: 'aosh.wan.application:employee.timePlaceholder',
      defaultMessage: '23:59',
      description: 'placeholder for time of accident',
    },
    workstation: {
      id: 'aosh.wan.application:employee.workstation',
      defaultMessage: 'Starfsstöð',
      description: 'Workstation',
    },
    occupationTitle: {
      id: 'aosh.wan.application:employee.occupationTitle',
      defaultMessage: 'Starfsgrein slasaða',
      description: 'Occupation of injured employee',
    },
    postnumberAndMunicipality: {
      id: 'aosh.wan.application:employee.postnumberAndMunicipality',
      defaultMessage: 'Póstnúmer og sveitarfélag',
      description: 'Postnumber and municipality',
    },
    alertTitle: {
      id: 'aosh.wan.application:employee.alertTitle',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
    alertMessage: {
      id: 'aosh.wan.application:employee.alertMessage',
      defaultMessage:
        'Ef fjöldi starfsmanna er fleiri en einn er hægt að bæta við fleirum ...',
      description: 'Message for the alert field in the employee section.',
    },
    searchPlaceholder: {
      id: 'aosh.wan.application:employee.searchPlaceholder',
      defaultMessage: 'Sláðu inn leitarorð',
      description: 'Placeholder for occupation search input bar',
    },
    majorGroupLabel: {
      id: 'aosh.wan.application:employee.majorGroupLabel',
      defaultMessage: 'Starfsgreinaflokkur',
      description: 'Label for major group select field',
    },
    subMajorGroupLabel: {
      id: 'aosh.wan.application:employee.subMajorGroupLabel',
      defaultMessage: 'Yfirflokkur starfsgreinar',
      description: 'Label for sub major group select field',
    },
    minorGroupLabel: {
      id: 'aosh.wan.application:employee.minorGroupLabel',
      defaultMessage: 'Undirflokkur starfsgreinar',
      description: 'Label for minor group select field',
    },
    unitGroupLabel: {
      id: 'aosh.wan.application:employee.unitGroupLabel',
      defaultMessage: 'Starfsgrein',
      description: 'Label for unit group select field',
    },
    chooseFromListPlaceholder: {
      id: 'aosh.wan.application:employee.chooseFromListPlaceholder',
      defaultMessage: 'Veldur úr lista',
      description: 'Placeholder for occupation group select fields',
    },
    errorMessage: {
      id: 'aosh.wan.application:employee.errorMessage',
      defaultMessage:
        'Starfsdagur má byrja allt að 36 tímum fyrir slys og að tímasetningu slyss',
      description: 'Error message for employee start time',
    },
    startTimeAlert: {
      id: 'aosh.wan.application:employee.startTimeAlert',
      defaultMessage:
        'Dagsetning og tími þegar starfsmaður mætti til vinnu á slysadegi',
      description: 'Error message for employee start time',
    },
    samePersonAlert: {
      id: 'aosh.wan.application:employee.samePersonAlert',
      defaultMessage:
        'Vinsamlegast athugaðu að þessi tilkynning um að þú hafir lent í vinnuslysi verður skráð á þig! Ef þú ert starfandi hjá fyrirtæki þá ber fyrirtækinu að tilkynna um vinnuslysið skv. 79 gr. laga 46/1980 og tilkynningum þar sem starfsmaður skráir tilkynninguna á sjálfan sig verður hafnað af Vinnueftirlitinu. Ef þú ert sjálfstætt starfandi þá geturu tilkynnt vinnuslys þar sem þú sjálf/ur ert hinn sladaða/i.',
      description: 'Alert is actor attempt to register accident on himself',
    },
  }),
}
