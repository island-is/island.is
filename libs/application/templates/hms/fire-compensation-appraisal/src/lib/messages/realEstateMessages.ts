import { defineMessages } from 'react-intl'

export const realEstateMessages = defineMessages({
  title: {
    id: 'fca.application:realEstate.title',
    defaultMessage: 'Fasteign',
    description: 'Real estate section title',
  },
  multifieldTitle: {
    id: 'fca.application:realEstate.multifieldTitle',
    defaultMessage: 'Fasteignir og notkunareiningar',
    description: 'Real estate section multifield title',
  },
  description: {
    id: 'fca.application:realEstate.description',
    defaultMessage:
      'Veldu eina af þínum fasteignum úr listanum hér fyrir neðan. Því næst þarftu að velja hvaða notkunareiningar innan fasteignarinnar á að endurmeta brunabótamat fyrir.',
    description: 'Real estate section description',
  },
  units: {
    id: 'fca.application:realEstate.units',
    defaultMessage: 'Einingar',
    description: 'Unit',
  },
  usageUnit: {
    id: 'fca.application:realEstate.usageUnit',
    defaultMessage: 'Notkunareining',
    description: 'Usage unit',
  },
  usageUnitDescription: {
    id: 'fca.application:realEstate.usageUnitDescription',
    defaultMessage:
      'Athugaðu að endurmat mun aðeins fara fram á þeim notkunareiningum sem valdar eru. Ef ekki er hakað í einhverja notkunareiningu þarf að sækja um aftur ef taka á hana með til endurmats.',
    description: 'Usage unit description',
  },
  usageUnitsFireCompensation: {
    id: 'fca.application:realEstate.usageUnitsFireCompensation',
    defaultMessage: 'Brunabótamat valdra notkunareininga',
    description: 'Usage units fire compensation',
  },
  totalFireCompensation: {
    id: 'fca.application:realEstate.totalFireCompensation',
    defaultMessage: 'Heildar brunabótamat fasteignar',
    description: 'Total fire compensation',
  },
  otherPropertiesTitle: {
    id: 'hms.fireCompensationAppraisal.confirmRead.otherPropertiesTitle',
    defaultMessage: 'Aðrar eignir.',
    description: 'Title for other properties section',
  },
  applyingForOtherProperty: {
    id: 'hms.fireCompensationAppraisal.confirmRead.applyingForOtherProperty',
    defaultMessage: 'Ég er að sækja um eign sem ég á ekki.',
    description: 'Checkbox label for applying on behalf of property owner',
  },
})
