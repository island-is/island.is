import { Box, Button } from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  ErrorScreen,
  IntroHeader,
  LinkResolver,
  m,
  NotFound,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { getCase } from '../../helpers/mockData'
import { useParams } from 'react-router-dom'
import { LawAndOrderPaths } from '../../lib/paths'
import InfoLines from '../../components/InfoLines/InfoLines'
import { useEffect } from 'react'
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'
import { useGetCourtCaseQuery } from './CourtCaseDetail.generated'

type UseParams = {
  id: string
}

const CourtCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()

  const { id } = useParams() as UseParams

  const { data, error, loading } = useGetCourtCaseQuery({
    variables: {
      input: {
        id: id,
      },
    },
  })

  const noInfo = data?.courtCaseDetail === null
  const courtCase = data?.courtCaseDetail

  const {
    subpeonaAcknowledged,
    setSubpeonaAcknowledged,
    subpeonaModalVisible,
    setSubpeonaModalVisible,
  } = useLawAndOrderContext()

  useEffect(() => {
    if (courtCase && subpeonaAcknowledged === undefined) {
      setSubpeonaAcknowledged(courtCase?.data?.acknowledged ?? undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleModal = () => {
    setSubpeonaModalVisible(!subpeonaModalVisible)
  }

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
        loading={loading}
        title={
          courtCase?.data?.caseNumberTitle ??
          formatMessage(messages.courtCaseNumberNotRegistered)
        }
        intro={messages.courtCasesDescription}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      <Box marginBottom={3} display="flex" flexWrap="wrap">
        <Box paddingRight={2} marginBottom={[1]}>
          {subpeonaAcknowledged ? (
            <LinkResolver
              href={LawAndOrderPaths.SubpeonaDetail.replace(
                ':id',
                id?.toString() || '',
              )}
            >
              <Button
                as="span"
                unfocusable
                colorScheme="default"
                icon="receipt"
                iconType="outline"
                size="default"
                variant="utility"
              >
                {formatMessage(messages.seeSubpoena)}
              </Button>
            </LinkResolver>
          ) : (
            <Button
              as="span"
              unfocusable
              colorScheme="default"
              icon="receipt"
              iconType="outline"
              size="default"
              variant="utility"
              onClick={() => toggleModal()}
            >
              {formatMessage(messages.seeSubpoena)}
            </Button>
          )}
        </Box>
        <Box paddingRight={2} marginBottom={[1]}>
          {courtCase?.actions?.map((x, y) => {
            return (
              <Button
                as="span"
                unfocusable
                colorScheme="default"
                icon="download"
                iconType="outline"
                size="default"
                variant="utility"
                key={`'courtcase-button-'${y}`}
                onClick={() => alert('hleður niður PDF')}
              >
                {x.title}
              </Button>
            )
          })}
        </Box>
      </Box>
      {courtCase?.data?.groups && (
        <InfoLines groups={courtCase?.data?.groups} loading={loading} />
      )}
      {subpeonaModalVisible && !subpeonaAcknowledged && (
        <ConfirmationModal id={courtCase?.data?.id ?? undefined} />
      )}
    </Box>
  )
}
export default CourtCaseDetail
