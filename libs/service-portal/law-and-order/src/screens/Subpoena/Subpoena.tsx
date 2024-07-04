import {
  AlertMessage,
  Box,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  toast,
} from '@island.is/island-ui/core'
import {
  CardLoader,
  ConfirmationModal,
  DOMSMALARADUNEYTID_SLUG,
  IntroHeader,
  m,
  Modal,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import InfoLines from '../../components/InfoLines/InfoLines'
import DefenderChoices from '../../components/DefenderChoices/DefenderChoices'
import { useEffect, useState } from 'react'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'
import CourtCaseDetail from '../CourtCaseDetail/CourtCaseDetail'
import { useGetSubpoenaQuery } from './Subpoena.generated'
import { Problem } from '@island.is/react-spa/shared'
import { usePostSubpoenaAcknowledgedMutation } from '../CourtCaseDetail/CourtCaseDetail.generated'
import { LawAndOrderPaths } from '../../lib/paths'
import { DefenseChoices } from '../../lib/const'
import { isDefined } from '@island.is/shared/utils'

type UseParams = {
  id: string
}

const Subpoena = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams

  const { data, error, loading, refetch } = useGetSubpoenaQuery({
    variables: {
      input: {
        id,
        locale: lang,
      },
    },
  })

  const subpoena = data?.lawAndOrderSubpoena
  const [defenderPopUp, setDefenderPopUp] = useState<boolean>(false)
  const {
    subpoenaAcknowledged,
    setSubpoenaAcknowledged,
    subpoenaModalVisible,
    setSubpoenaModalVisible,
  } = useLawAndOrderContext()

  useEffect(() => {
    if (subpoena && !subpoenaAcknowledged) {
      setSubpoenaAcknowledged(subpoena.data?.acknowledged ?? undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [postAction, { loading: postActionLoading }] =
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

  const toggleModal = () => {
    setSubpoenaModalVisible(!subpoenaModalVisible)
  }

  const handleSubmit = () => {
    // TODO: Change to service
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
    // TODO: Change to service
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

  if (subpoena?.data && subpoenaAcknowledged === undefined) {
    setSubpoenaModalVisible(true)
    return (
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
    )
  }

  if (subpoenaAcknowledged === false) {
    return <CourtCaseDetail />
  }

  return (
    <>
      <IntroHeader
        loading={loading}
        title={formatMessage(messages.subpoena)}
        intro={subpoena?.texts?.intro ?? undefined}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      {subpoenaAcknowledged && (
        <GridContainer>
          <GridRow>
            <GridColumn span="10/12">
              <AlertMessage
                type="success"
                message={subpoena?.texts?.confirmation}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {loading && !error && (
        <Box width="full">
          <CardLoader />
        </Box>
      )}
      {subpoena?.data?.groups && subpoena.data.groups.length > 0 && (
        <>
          <InfoLines groups={subpoena.data.groups} loading={loading} />
          {isDefined(subpoena?.data.defenderChoice) && (
            <>
              <Box paddingTop={1} />
              <UserInfoLine
                loading={loading}
                label={messages.chooseDefenderTitle}
                content={[
                  formatMessage(
                    DefenseChoices[subpoena.data.defenderChoice].message,
                  ),
                  subpoena.data.chosenDefender,
                ]
                  .filter(Boolean)
                  .join(', ')}
                labelColumnSpan={['1/1', '6/12']}
                valueColumnSpan={['1/1', '4/12']}
                editColumnSpan={['2/12']}
                button={{
                  title: messages.change,
                  onClick: () => {
                    setDefenderPopUp(true)
                  },
                }}
              />
              <Box paddingBottom={1} />
              <Divider />
            </>
          )}

          {subpoena.texts && (
            <GridRow>
              <GridColumn span={['8/8', '8/8', '6/8']} paddingTop={5}>
                <Text>{subpoena?.texts?.description}</Text>
              </GridColumn>
            </GridRow>
          )}

          {!loading && !subpoena?.data.defenderChoice && (
            <DefenderChoices id={id} refetch={refetch} />
          )}

          {defenderPopUp && (
            <Modal
              id="defender-pop-up"
              onCloseModal={() => setDefenderPopUp(false)}
            >
              <DefenderChoices
                popUp={{ setPopUp: setDefenderPopUp }}
                id={id}
                refetch={refetch}
              />
            </Modal>
          )}
        </>
      )}
      {!loading && !error && data?.lawAndOrderSubpoena === null && (
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

export default Subpoena
