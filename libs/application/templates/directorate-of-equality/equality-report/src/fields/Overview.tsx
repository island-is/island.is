import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { Box, Divider, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { messages } from '../lib/messages'
import { ApplicationAnswers } from '../lib/dataSchema'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box marginBottom={5}>
    <Text variant="h3" marginBottom={3}>{title}</Text>
    {children}
    <Box marginTop={4}><Divider /></Box>
  </Box>
)

const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <GridRow marginBottom={2}>
    <GridColumn span="6/12">
      <Text variant="h5">{label}</Text>
    </GridColumn>
    <GridColumn span="6/12">
      <Text>{value || '—'}</Text>
    </GridColumn>
  </GridRow>
)

export const Overview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as ApplicationAnswers

  const subsidiaryList = answers.subsidiaries?.list ?? []
  const hasSubsidiaries = answers.subsidiaries?.includesSubsidiaries === 'yes'

  const genderLabel = (gender?: string) => {
    if (gender === 'MALE') return formatMessage(messages.aboutTheCompany.chiefExecutive.genderMale)
    if (gender === 'FEMALE') return formatMessage(messages.aboutTheCompany.chiefExecutive.genderFemale)
    if (gender === 'NON_BINARY') return formatMessage(messages.aboutTheCompany.chiefExecutive.genderNonBinary)
    return '—'
  }

  const equalityPlanText = (() => {
    const base64 = getValueViaPath<string>(application.answers, 'information.customField') ?? ''
    try {
      return atob(base64).replace(/<[^>]*>/g, '').trim()
    } catch {
      return ''
    }
  })()

  return (
    <Box>
      <Section title={formatMessage(messages.overview.companyInfo)}>
        <Row label={formatMessage(messages.aboutTheCompany.generalInformation.companyName)} value={answers.generalInformation?.companyName} />
        <Row label={formatMessage(messages.aboutTheCompany.generalInformation.nationalId)} value={answers.generalInformation?.nationalId} />
        <Row label={formatMessage(messages.aboutTheCompany.generalInformation.address)} value={answers.generalInformation?.address} />
        <Row label={formatMessage(messages.aboutTheCompany.generalInformation.postalCode)} value={answers.generalInformation?.postalCode} />
        <Row label={formatMessage(messages.aboutTheCompany.generalInformation.municipality)} value={answers.generalInformation?.municipality} />
        <Row label={formatMessage(messages.aboutTheCompany.generalInformation.numberOfEmployees)} value={answers.generalInformation?.numberOfEmployees} />
        <Row label={formatMessage(messages.aboutTheCompany.generalInformation.isatClassification)} value={answers.generalInformation?.isatClassification} />
      </Section>

      <Section title={formatMessage(messages.overview.chiefExecutive)}>
        <Row label={formatMessage(messages.aboutTheCompany.chiefExecutive.name)} value={answers.chiefExecutive?.name} />
        <Row label={formatMessage(messages.aboutTheCompany.chiefExecutive.email)} value={answers.chiefExecutive?.email} />
        <Row label={formatMessage(messages.aboutTheCompany.chiefExecutive.gender)} value={genderLabel(answers.chiefExecutive?.gender)} />
      </Section>

      <Section title={formatMessage(messages.overview.contactPerson)}>
        <Row label={formatMessage(messages.aboutTheCompany.contactPerson.name)} value={answers.contactPerson?.name} />
        <Row label={formatMessage(messages.aboutTheCompany.contactPerson.email)} value={answers.contactPerson?.email} />
        <Row label={formatMessage(messages.aboutTheCompany.contactPerson.phone)} value={answers.contactPerson?.phone} />
      </Section>

      <Section title={formatMessage(messages.overview.employeeCount)}>
        <Row label={formatMessage(messages.overview.women)} value={answers.employeeCount?.women} />
        <Row label={formatMessage(messages.overview.men)} value={answers.employeeCount?.men} />
        <Row label={formatMessage(messages.overview.nonBinary)} value={answers.employeeCount?.nonBinary} />
      </Section>

      <Section title={formatMessage(messages.overview.subsidiaries)}>
        <Row
          label={formatMessage(messages.overview.hasSubsidiaries)}
          value={hasSubsidiaries ? 'Já' : formatMessage(messages.overview.noSubsidiaries)}
        />
        {hasSubsidiaries && subsidiaryList.map((s, i) => (
          <Row
            key={i}
            label={s.nationalIdWithName.name}
            value={s.nationalIdWithName.nationalId}
          />
        ))}
      </Section>

      <Section title={formatMessage(messages.overview.equalityPlan)}>
        <Text whiteSpace="preWrap">{equalityPlanText}</Text>
      </Section>
    </Box>
  )
}

export default Overview
