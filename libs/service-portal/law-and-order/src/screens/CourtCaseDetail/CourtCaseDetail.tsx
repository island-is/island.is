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
import { useParams } from 'react-router-dom'
import { LawAndOrderPaths } from '../../lib/paths'
import InfoLines from '../../components/InfoLines/InfoLines'
import { useEffect } from 'react'
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'
import { useGetCourtCaseQuery } from './CourtCaseDetail.generated'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  id: string
}

const CourtCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()

  const { id } = useParams() as UseParams

  const { data, error, loading, refetch } = useGetCourtCaseQuery({
    variables: {
      input: {
        id,
        locale: lang,
      },
    },
  })

  const courtCase = data?.lawAndOrderCourtCaseDetail

  const {
    subpoenaAcknowledged,
    setSubpoenaAcknowledged,
    subpoenaModalVisible,
    setSubpoenaModalVisible,
  } = useLawAndOrderContext()

  useEffect(() => {
    refetch()
  }, [lang])

  useEffect(() => {
    if (courtCase && subpoenaAcknowledged === undefined) {
      setSubpoenaAcknowledged(courtCase?.data?.acknowledged ?? undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleModal = () => {
    setSubpoenaModalVisible(!subpoenaModalVisible)
  }

  //TODO: Samræma við þjónustu
  if (data?.lawAndOrderCourtCaseDetail == null && !loading) {
    return <NotFound title={formatMessage(messages.courtCaseNotFound)} />
  }

  return (
    <>
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
          {subpoenaAcknowledged ? (
            <LinkResolver
              href={LawAndOrderPaths.SubpoenaDetail.replace(
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
        {error && !loading && <Problem error={error} noBorder={false} />}
        {!error && !loading && !courtCase && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noDataFoundVariable, {
              arg: formatMessage(messages.courtCases).toLowerCase(),
            })}
            message={formatMessage(m.noDataFoundVariableDetail, {
              arg: formatMessage(messages.courtCases).toLowerCase(),
            })}
            imgSrc="./assets/images/sofa.svg"
          />
        )}
        {!error && !loading && courtCase && (
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
        )}
      </Box>
      {!error && !loading && courtCase && (
        <>
          {courtCase?.data?.groups && (
            <InfoLines groups={courtCase?.data?.groups} loading={loading} />
          )}
          {courtCase?.data && subpoenaModalVisible && !subpoenaAcknowledged && (
            <ConfirmationModal id={courtCase.data.id} />
          )}
        </>
      )}
    </>
  )
}
export default CourtCaseDetail
