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

type UseParams = {
  id: string
}

const Subpoena = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams

  const { data, error, loading } = useGetSubpoenaQuery({
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
    defenseChoice,
    lawyerSelected,
    subpoenaModalVisible,
    setSubpoenaModalVisible,
  } = useLawAndOrderContext()

  useEffect(() => {
    if (subpoena && !subpoenaAcknowledged) {
      setSubpoenaAcknowledged(subpoena.data?.acknowledged ?? undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const toggleModal = () => {
    setSubpoenaModalVisible(!subpoenaModalVisible)
  }

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
    console.log('is false')
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

      {subpoena?.data?.groups && subpoena.data.groups.length > 0 && (
        <>
          <InfoLines groups={subpoena.data.groups} loading={loading} />
          {(subpoena?.data?.chosenDefender ||
            lawyerSelected ||
            defenseChoice) && (
            <>
              <Box paddingTop={1} />
              <UserInfoLine
                loading={loading}
                label={messages.defenseAttorney}
                content={
                  subpoena?.data?.chosenDefender ??
                  lawyerSelected?.name ??
                  defenseChoice
                }
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

          {!loading && !subpoena?.data?.chosenDefender && !defenseChoice && (
            <DefenderChoices id={id} />
          )}

          {defenderPopUp && (
            <Modal
              id="defender-pop-up"
              onCloseModal={() => setDefenderPopUp(false)}
            >
              <DefenderChoices popUp={{ setPopUp: setDefenderPopUp }} id={id} />
            </Modal>
          )}
        </>
      )}
    </>
  )
}

export default Subpoena
