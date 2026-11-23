import { FC } from 'react'
import {
  Box,
  Checkbox,
  Hidden,
  InputError,
  Stack,
  Table as T,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { employmentHistory as m } from '../../lib/messages'
import { EmploymentHistoryInstitution } from '../../lib/types'
import { formatDate } from '../../utils/formatDate'

interface Props {
  institutions: EmploymentHistoryInstitution[]
  selected: string[]
  onToggle: (id: string) => void
  error?: string
}

const ERROR_ID = 'institutionIds-error'

export const InstitutionTable: FC<Props> = ({
  institutions,
  selected,
  onToggle,
  error,
}) => {
  const { formatMessage } = useLocale()

  const endDate = (institution: EmploymentHistoryInstitution) =>
    institution.to ? formatDate(institution.to) : formatMessage(m.noEndDate)

  const checkboxLabel = (institution: EmploymentHistoryInstitution) =>
    formatMessage(m.includeInstitution, { name: institution.name })

  return (
    <div
      role="group"
      aria-label={formatMessage(m.tableCaption)}
      aria-describedby={error ? ERROR_ID : undefined}
    >
      <Hidden below="md">
        <T.Table>
          <caption>
            <VisuallyHidden>{formatMessage(m.tableCaption)}</VisuallyHidden>
          </caption>
          <T.Head>
            <T.Row>
              <T.HeadData width="56">
                <VisuallyHidden>{formatMessage(m.selectColumn)}</VisuallyHidden>
              </T.HeadData>
              <T.HeadData>{formatMessage(m.institutionColumn)}</T.HeadData>
              <T.HeadData>{formatMessage(m.fromColumn)}</T.HeadData>
              <T.HeadData>{formatMessage(m.toColumn)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {institutions.map((institution) => {
              return (
                <T.Row key={institution.id}>
                  <T.Data>
                    <Checkbox
                      id={`institution-${institution.id}`}
                      name={`institution-${institution.id}`}
                      ariaLabel={checkboxLabel(institution)}
                      checked={selected.includes(institution.id)}
                      onChange={() => onToggle(institution.id)}
                    />
                  </T.Data>
                  <T.Data>{institution.name}</T.Data>
                  <T.Data>{formatDate(institution.from)}</T.Data>
                  <T.Data>{endDate(institution)}</T.Data>
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>
      </Hidden>

      <Hidden above="sm">
        <Stack space={2}>
          {institutions.map((institution) => (
            <Checkbox
              key={institution.id}
              id={`institution-mobile-${institution.id}`}
              name={`institution-mobile-${institution.id}`}
              large
              backgroundColor="white"
              label={institution.name}
              subLabel={formatMessage(m.institutionPeriod, {
                from: formatDate(institution.from),
                to: endDate(institution),
              })}
              checked={selected.includes(institution.id)}
              onChange={() => onToggle(institution.id)}
            />
          ))}
        </Stack>
      </Hidden>

      <Box marginTop={2} aria-live="polite">
        <Text variant="small">
          {formatMessage(m.selectedCount, {
            selected: selected.length,
            total: institutions.length,
          })}
        </Text>
      </Box>

      {error && (
        <div role="alert">
          <InputError id={ERROR_ID} errorMessage={error} />
        </div>
      )}
    </div>
  )
}
