import { Box, Button, toast } from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  IntroHeader,
  LinkResolver,
  m,
  NotFound,
  ConfirmationModal,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import { LawAndOrderPaths } from '../../lib/paths'
import InfoLines from '../../components/InfoLines/InfoLines'
import { useEffect } from 'react'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'
import {
  useGetCourtCaseQuery,
  usePostSubpoenaAcknowledgedMutation,
} from './CourtCaseDetail.generated'
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

  const [postAction, { loading: postActionLoading, data: updateData }] =
    usePostSubpoenaAcknowledgedMutation({
      onError: () => {
        toast.error(formatMessage(messages.registrationError))
      },
      onCompleted: () => {
        //TODO: What to do if user closes or cancel the pop up?

        subpoenaAcknowledged &&
          toast.success(formatMessage(messages.registrationCompleted))
        setSubpoenaModalVisible(false)
      },
    })

  const handleSubmit = () => {
    // TODO: What to do if error ?
    setSubpoenaAcknowledged(true)
    postAction({
      variables: {
        input: {
          caseId: id,
          acknowledged: true,
        },
      },
    })
  }
  const handleCancel = () => {
    // TODO: What to do if error ?
    setSubpoenaAcknowledged(false)
    postAction({
      variables: {
        input: {
          caseId: id,
          acknowledged: false,
        },
      },
    })
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
        {!loading && (
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
        )}
        {error && !loading && <Problem error={error} noBorder={false} />}
        {!error &&
          !loading &&
          courtCase?.actions &&
          courtCase.actions.length > 0 && (
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
            <ConfirmationModal
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onClose={toggleModal}
              loading={postActionLoading}
              redirectPath={LawAndOrderPaths.SubpoenaDetail.replace(':id', id)}
              modalText={formatMessage(m.acknowledgeText, {
                arg: formatMessage(messages.modalFromPolice),
              })}
            />
          )}
        </>
      )}
      {!loading &&
        !error &&
        courtCase?.data &&
        courtCase?.data?.groups?.length === 0 && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        )}
    </>
  )
}
export default CourtCaseDetail
