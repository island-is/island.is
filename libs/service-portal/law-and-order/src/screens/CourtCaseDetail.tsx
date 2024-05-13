import {
  Box,
  Divider,
  Icon,
  ProgressMeter,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  ErrorScreen,
  formatDate,
  formatDateLong,
  formatDateWithTimeLong,
  IntroHeader,
  m,
  NotFound,
  THJODSKRA_SLUG,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { messages } from '../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { getCase } from '../helpers/mockData'
import { useParams } from 'react-router-dom'
import { LawAndOrderPaths } from '../lib/paths'
import { StateProgressMeter } from '../components/StateProgressMeter'

type UseParams = {
  id: string
}

const CourtCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()

  const { id } = useParams() as UseParams

  const { data, loading, error } = getCase(parseInt(id))

  const noInfo = data?.courtCaseDetail === null
  const courtCase = data?.courtCaseDetail

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.courtCases).toLowerCase(),
        })}
      />
    )
  }

  if (noInfo && !loading) {
    return <NotFound title={formatMessage(messages.courtCaseNotFound)} />
  }

  return (
    <Box marginTop={3}>
      <IntroHeader
        title={
          courtCase?.caseNumber ??
          formatMessage(messages.courtCaseNumberNotRegistered)
        }
        intro={messages.courtCasesDescription}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      <Stack space={1}>
        <UserInfoLine
          title={formatMessage(messages.defendant)}
          label={formatMessage(m.name)}
          content={courtCase?.defendant.name}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.natreg)}
          content={courtCase?.defendant.nationalId.toString()}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.legalResidence)}
          content={courtCase?.defendant.address}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.subpoenaSent)}
          //Todo: lagfæra dagsetningu
          content={formatDateLong(lang, courtCase?.defendant.subpoenaDateTime)}
          editLink={{
            title: formatMessage(messages.seeSubpoena),
            url: LawAndOrderPaths.SubpeonaPopUp,
            icon: 'arrowForward',
          }}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '3/12']}
        />
        <Divider />
      </Stack>
      <Box marginTop={4} />
      <Text
        variant="eyebrow"
        color="purple400"
        paddingBottom={4}
        paddingTop={2}
      >
        {formatMessage(messages.process)}
      </Text>
      {courtCase?.data.process && (
        <StateProgressMeter process={courtCase?.data.process} />
      )}
      <Box marginTop={4} />

      <Stack space={1}>
        {courtCase?.defenseAttorney.map((x, i) => (
          <>
            <UserInfoLine
              title={formatMessage(messages.defenseAttorney)}
              label={formatMessage(m.name)}
              content={x.name}
              labelColumnSpan={['1/1', '6/12']}
              valueColumnSpan={['1/1', '6/12']}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(m.email)}
              content={x.email}
              labelColumnSpan={['1/1', '6/12']}
              valueColumnSpan={['1/1', '6/12']}
            />
            <Divider />
            <UserInfoLine
              label={formatMessage(m.phone)}
              content={x.phone.toString()}
              labelColumnSpan={['1/1', '6/12']}
              valueColumnSpan={['1/1', '6/12']}
            />
            <Divider />
          </>
        ))}
      </Stack>
      <Box marginTop={4} />
      <Stack space={1}>
        <UserInfoLine
          title={formatMessage(messages.caseInformation)}
          label={formatMessage(messages.type)}
          content={courtCase?.type}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.LOKECaseNumber)}
          content={courtCase?.detail.LOKECaseNumber}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.caseNumberCourt)}
          content={courtCase?.caseNumber}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.court)}
          content={courtCase?.detail.court}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.prosecution)}
          content={courtCase?.detail.prosecution}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.judge)}
          content={courtCase?.detail.judge}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.requestedDateTime)}
          content={formatDateWithTimeLong(
            lang,
            courtCase?.detail.requestedDateTime,
          )}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.prosecutor)}
          content={courtCase?.detail.prosecutor}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.timeOfArrest)}
          content={formatDateWithTimeLong(
            lang,
            courtCase?.detail.arrestDateTime,
          )}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.confirmedHearingDateTime)}
          content={formatDateWithTimeLong(
            lang,
            courtCase?.detail.hearingDateTime,
          )}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(messages.state)}
          renderContent={() => (
            <Box display="flex" alignItems="center">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                textAlign="center"
              >
                <Box
                  marginRight={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <Icon
                    //icon={isInvalid ? 'closeCircle' : 'checkmarkCircle'}
                    icon={'checkmarkCircle'}
                    color={
                      'mint600'
                      // isInvalid
                      //   ? 'red600'
                      //   : expireWarning
                      //   ? 'yellow600'
                      //   : 'mint600'
                    }
                    type="filled"
                  />
                </Box>
                {/* <Text variant="eyebrow">
                  {isInvalid
                    ? formatMessage(licenseLost ? m.lost : m.isExpired)
                    : formatMessage(m.isValid)}
                </Text> */}
              </Box>
              <Text fontWeight="medium" variant="small">
                {courtCase?.status}
              </Text>
            </Box>
          )}
          loading={loading}
          labelColumnSpan={['1/1', '6/12']}
          valueColumnSpan={['1/1', '6/12']}
          translate="no"
        />
        <Divider />
        {courtCase?.texts?.footnote && (
          <Text variant="small" paddingTop={1}>
            {courtCase?.texts?.footnote}
          </Text>
        )}
      </Stack>
    </Box>
  )
}
export default CourtCaseDetail
