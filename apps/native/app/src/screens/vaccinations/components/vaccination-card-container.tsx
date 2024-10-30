import {
  Badge,
  ExpandableCard,
  LinkText,
  Skeleton,
  Typography,
  dynamicColor,
} from '@ui'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { TouchableOpacity, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { Markdown } from '../../../ui/lib/markdown/markdown'

import chevronDown from '../../../assets/icons/chevron-down.png'
import clockIcon from '../../../assets/icons/clock.png'
import externalLinkIcon from '../../../assets/icons/external-link.png'
import { HealthDirectorateVaccination } from '../../../graphql/types/schema'
import { useBrowser } from '../../../lib/use-browser'

const Row = styled.View<{ border?: boolean }>`
  flex-direction: row;
  flex-wrap: wrap;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: ${({ border }) => (border ? 1 : 0)}px;
`

const Cell = styled.View`
  margin-right: ${({ theme }) => theme.spacing[1]}px;
  margin-left: ${({ theme }) => theme.spacing[1]}px;
  margin-top: ${({ theme }) => theme.spacing.smallGutter}px;
  margin-bottom: ${({ theme }) => theme.spacing.smallGutter}px;
`

const TableRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
  padding-bottom: ${({ theme }) => theme.spacing[2]}px;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: 1px;
`

const NoVaccinations = styled.View`
  padding: ${({ theme }) => theme.spacing[3]}px;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]}px;
  border-width: ${({ theme }) => theme.border.width.standard}px;
  border-color: ${({ theme }) => theme.color.blue200};
  border-radius: ${({ theme }) => theme.border.radius.large};
`

const RowItem = styled.View`
  margin-right: ${({ theme }) => theme.spacing[1]}px;
  margin-left: ${({ theme }) => theme.spacing[1]}px;
  flex: 1;
`

const TableHeading = styled.View`
  flex-direction: row;
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing[1]}px;
  padding-bottom: ${({ theme }) => theme.spacing[1]}px;
  border-bottom-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.blue200,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: 1px;
`
const CommentWrapper = styled.View`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const mapStatusToBadge = (status?: string) => {
  switch (status) {
    case 'expired':
    case 'incomplete':
    case 'rejected':
    case 'undetermined':
      return 'blue'
    case 'undocumented':
      return 'purple'
    case 'unvaccinated':
      return 'red'
    case 'valid':
    case 'complete':
      return 'mint'
    default:
      return 'blue'
  }
}

const convertAgeToString = (months?: number | null, years?: number | null) => {
  let ageString = ''
  if (years === 1) {
    ageString += '1 árs '
  } else if (years && years > 1) {
    ageString += `${years} ára `
  }

  if (months && months > 0) {
    ageString += `${months} mán.`
  }

  return ageString
}

export function VaccinationsCardContainer({
  vaccination,
  loading,
  componentId,
}: {
  vaccination: HealthDirectorateVaccination
  loading: boolean
  componentId: string
}) {
  const intl = useIntl()
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const { openBrowser } = useBrowser()
  return (
    <ExpandableCard
      title={
        vaccination.lastVaccinationDate
          ? intl.formatDate(vaccination.lastVaccinationDate)
          : undefined
      }
      titleIcon={clockIcon}
      message={vaccination.name}
      icon={chevronDown}
      value={
        <Badge
          variant={mapStatusToBadge(vaccination.status ?? undefined)}
          title={vaccination.statusName!}
          outlined
        />
      }
      onPress={() => {
        setOpen((p) => !p)
      }}
      open={open}
    >
      <View style={{ width: '100%', padding: theme.spacing[2] }}>
        {vaccination?.vaccinationsInfo?.length ? (
          <Row style={{ marginTop: 12 }}>
            <TableHeading>
              <Cell style={{ flex: 1, maxWidth: '5%' }}>
                <Typography variant="eyebrow">
                  <FormattedMessage
                    id="health.vaccinations.number"
                    defaultMessage="Nr."
                  />
                </Typography>
              </Cell>
              <Cell style={{ flex: 1, maxWidth: '20%' }}>
                <Typography variant="eyebrow">
                  <FormattedMessage
                    id="health.vaccinations.date"
                    defaultMessage="Dags."
                  />
                </Typography>
              </Cell>
              <Cell style={{ flex: 1, maxWidth: '25%' }}>
                <Typography variant="eyebrow">
                  <FormattedMessage
                    id="health.vaccinations.age"
                    defaultMessage="Aldur"
                  />
                </Typography>
              </Cell>
              <Cell style={{ flex: 1 }}>
                <Typography variant="eyebrow">
                  <FormattedMessage
                    id="health.vaccinations.vaccine"
                    defaultMessage="Bóluefni"
                  />
                </Typography>
              </Cell>
            </TableHeading>
          </Row>
        ) : (
          <NoVaccinations>
            <Badge
              variant="blue"
              title={intl.formatMessage({
                id: 'health.vaccinations.directorativeOfHealth',
              })}
            />
            <Typography
              variant="heading5"
              textAlign="center"
              style={{ marginTop: theme.spacing[1] }}
            >
              <FormattedMessage
                id="health.vaccinations.noVaccinations"
                defaultMessage="Engar bólusetningar skráðar"
              />
            </Typography>
            <Typography variant="body3" textAlign="center">
              <FormattedMessage
                id="health.vaccinations.noVaccinationsDescription"
                defaultMessage="Ef þú telur þig eiga gögn sem ættu að birtast hér, vinsamlegast hafðu samband við þjónustuaðila."
              />
            </Typography>
          </NoVaccinations>
        )}
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Row key={index}>
                <Cell style={{ flex: 1 }}>
                  <Skeleton height={18} />
                </Cell>
              </Row>
            ))
          : vaccination?.vaccinationsInfo?.map((vaccination, index) => {
              return (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? theme.color.blue100 : theme.color.white,
                  }}
                >
                  <RowItem style={{ maxWidth: '5%' }}>
                    <Typography variant="body3">{index + 1}</Typography>
                  </RowItem>
                  <RowItem style={{ maxWidth: '20%' }}>
                    <Typography variant="body3">
                      {vaccination.date
                        ? intl.formatDate(vaccination.date)
                        : ''}
                    </Typography>
                  </RowItem>
                  <RowItem style={{ maxWidth: '25%' }}>
                    <Typography variant="body3">
                      {convertAgeToString(
                        vaccination?.age?.months,
                        vaccination.age?.years,
                      )}
                    </Typography>
                  </RowItem>
                  {vaccination.url && vaccination.name && (
                    <RowItem>
                      <TouchableOpacity
                        style={{ flexWrap: 'wrap' }}
                        onPress={() =>
                          openBrowser(vaccination.url!, componentId)
                        }
                      >
                        <LinkText variant="small" icon={externalLinkIcon}>
                          {vaccination.name}
                        </LinkText>
                      </TouchableOpacity>
                    </RowItem>
                  )}
                </TableRow>
              )
            })}
        {vaccination?.comments && (
          <CommentWrapper>
            {vaccination.comments.map((comment, index) => (
              <Markdown bullets componentId={componentId} key={index}>
                {comment}
              </Markdown>
            ))}
          </CommentWrapper>
        )}
      </View>
    </ExpandableCard>
  )
}
