import { FC, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Icon,
  IconMapIcon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_SEND_TO_PRISON_ADMIN_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { getIndictmentAppealDeadlineDate } from '@island.is/judicial-system/types'
import { core, errors } from '@island.is/judicial-system-web/messages'

import {
  CaseIndictmentRulingDecision,
  Defendant,
  ServiceRequirement,
} from '../../graphql/schema'
import { formatDateForServer, useDefendants } from '../../utils/hooks'
import DateTime from '../DateTime/DateTime'
import { FormContext } from '../FormProvider/FormProvider'
import { getAppealExpirationInfo } from '../InfoCard/DefendantInfo/DefendantInfo'
import Modal from '../Modal/Modal'
import SectionHeading from '../SectionHeading/SectionHeading'
import { strings } from './BlueBoxWithDate.strings'
import * as styles from './BlueBoxWithIcon.css'

interface Props {
  defendant: Defendant
  icon?: IconMapIcon
}

type VisibleModal = 'REVOKE_SEND_TO_PRISON_ADMIN'

const BlueBoxWithDate: FC<Props> = (props) => {
  const { defendant, icon } = props
  const { formatMessage } = useIntl()
  const [dates, setDates] = useState<{
    verdictViewDate?: Date
    verdictAppealDate?: Date
  }>({
    verdictViewDate: undefined,
    verdictAppealDate: undefined,
  })
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(false)
  const [triggerAnimation2, setTriggerAnimation2] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<VisibleModal>()
  const { setAndSendDefendantToServer, isUpdatingDefendant } = useDefendants()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const router = useRouter()

  const isFine =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  const serviceRequired =
    defendant.serviceRequirement === ServiceRequirement.REQUIRED

  const shouldHideDatePickers = Boolean(
    defendant.verdictAppealDate ||
      defendant.isVerdictAppealDeadlineExpired ||
      defendant.isSentToPrisonAdmin ||
      isFine,
  )

  const handleDateChange = (
    date: Date | undefined,
    valid: boolean,
    type: keyof typeof dates,
  ) => {
    if (!date) {
      // Do nothing
      return
    }

    if (!valid) {
      toast.error(formatMessage(errors.invalidDate))
      return
    }

    setDates((prev) => ({ ...prev, [type]: date }))
  }

  const handleSetDate = (type: keyof typeof dates) => {
    const date = dates[type]

    if (!date) {
      toast.error(formatMessage(errors.invalidDate))
      return
    }

    const payload = {
      caseId: workingCase.id,
      defendantId: defendant.id,
      [type]: formatDateForServer(date),
    }

    setAndSendDefendantToServer(payload, setWorkingCase)

    if (type === 'verdictAppealDate') {
      setTriggerAnimation2(true)
    }
  }

  const handleSendToPrisonAdmin = () => {
    router.push(
      `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_SEND_TO_PRISON_ADMIN_ROUTE}/${workingCase.id}/${defendant.id}`,
    )
  }

  const handleRevokeSendToPrisonAdmin = () => {
    setAndSendDefendantToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        isSentToPrisonAdmin: false,
      },
      setWorkingCase,
    )

    setModalVisible(undefined)
  }

  const handleRevokeAppeal = () => {
    setAndSendDefendantToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        verdictAppealDate: null,
      },
      setWorkingCase,
    )
  }

  const appealExpirationInfo = useMemo(() => {
    const deadline =
      defendant.verdictAppealDeadline ||
      (dates.verdictViewDate &&
        getIndictmentAppealDeadlineDate(
          dates.verdictViewDate,
          false,
        ).toISOString())

    return getAppealExpirationInfo(
      deadline,
      defendant.isVerdictAppealDeadlineExpired,
    )
  }, [
    dates.verdictViewDate,
    defendant.isVerdictAppealDeadlineExpired,
    defendant.verdictAppealDeadline,
  ])

  const textItems = useMemo(() => {
    const texts = []

    if (isFine) {
      texts.push(
        formatMessage(strings.fineAppealDeadline, {
          appealDeadlineIsInThePast: defendant.isVerdictAppealDeadlineExpired,
          appealDeadline: formatDate(defendant.verdictAppealDeadline),
        }),
      )
    } else {
      if (serviceRequired) {
        texts.push(
          formatMessage(strings.defendantVerdictViewedDate, {
            date: formatDate(
              dates.verdictViewDate ?? defendant.verdictViewDate,
            ),
          }),
        )
      }

      texts.push(
        formatMessage(appealExpirationInfo.message, {
          appealExpirationDate: appealExpirationInfo.date,
        }),
      )

      if (defendant.verdictAppealDate) {
        texts.push(
          formatMessage(strings.defendantAppealDate, {
            date: formatDate(defendant.verdictAppealDate),
          }),
        )
      }
    }

    if (defendant.sentToPrisonAdminDate && defendant.isSentToPrisonAdmin) {
      texts.push(
        formatMessage(strings.sendToPrisonAdminDate, {
          date: formatDate(defendant.sentToPrisonAdminDate),
        }),
      )
    }

    return texts
  }, [
    appealExpirationInfo.date,
    appealExpirationInfo.message,
    dates.verdictViewDate,
    defendant.isSentToPrisonAdmin,
    defendant.isVerdictAppealDeadlineExpired,
    defendant.sentToPrisonAdminDate,
    defendant.verdictAppealDate,
    defendant.verdictAppealDeadline,
    defendant.verdictViewDate,
    formatMessage,
    isFine,
    serviceRequired,
  ])

  const verdictViewDateVariants = {
    hidden: { opacity: 0, y: 15, marginTop: '16px' },
    visible: { opacity: 1, y: 0 },
    exit: {
      opacity: 0,
      y: 15,
    },
  }

  const appealDateVariants = {
    hidden: { opacity: 0, y: 15, marginTop: '16px' },
    visible: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: { delay: triggerAnimation ? 0 : 0.4 },
    },
    exit: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      transition: { opacity: { duration: 0.2 } },
    },
  }

  return (
    <>
      <Box className={styles.container} padding={[2, 2, 3, 3]}>
        <Box className={styles.titleContainer}>
          <SectionHeading
            title={formatMessage(
              isFine ? strings.indictmentRulingDecisionFine : strings.keyDates,
            )}
            heading="h4"
            marginBottom={2}
          />
          {icon && (
            <Icon icon={icon} type="outline" color="blue400" size="large" />
          )}
          <Box marginBottom={1}>
            <Text variant="eyebrow">{defendant.name}</Text>
          </Box>
        </Box>
        <AnimatePresence>
          {(!serviceRequired || defendant.verdictViewDate || isFine) &&
            textItems.map((text, index) => (
              <motion.div
                key={index}
                initial={{
                  marginTop: 0,
                  opacity: 0,
                  y: 20,
                  height: triggerAnimation2 ? 0 : 'auto',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: 'auto',
                  marginTop: index === 0 ? 0 : '16px',
                }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                transition={{
                  delay: index < 4 ? index * 0.2 : 0,
                  duration: 0.3,
                }}
                onAnimationComplete={() => setTriggerAnimation(true)}
              >
                <Text>{`• ${text}`}</Text>
              </motion.div>
            ))}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {shouldHideDatePickers ? null : !serviceRequired ||
            defendant.verdictViewDate ? (
            <motion.div
              key="defendantAppealDate"
              variants={appealDateVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box className={styles.dataContainer}>
                <DateTime
                  name="defendantAppealDate"
                  datepickerLabel={formatMessage(
                    strings.defendantAppealDateLabel,
                  )}
                  datepickerPlaceholder={formatMessage(
                    strings.defendantAppealDatePlaceholder,
                  )}
                  size="sm"
                  onChange={(date, valid) =>
                    handleDateChange(date, valid, 'verdictAppealDate')
                  }
                  maxDate={new Date()}
                  blueBox={false}
                  dateOnly
                />
                <Button
                  onClick={() => handleSetDate('verdictAppealDate')}
                  disabled={!dates.verdictAppealDate}
                >
                  {formatMessage(strings.defendantAppealDateButtonText)}
                </Button>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="defendantVerdictViewDate"
              variants={verdictViewDateVariants}
              initial={false}
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.4 }}
            >
              <Box className={styles.dataContainer}>
                <DateTime
                  name="defendantVerdictViewDate"
                  datepickerLabel={formatMessage(
                    strings.defendantVerdictViewDateLabel,
                  )}
                  datepickerPlaceholder={formatMessage(
                    strings.defendantVerdictViewDatePlaceholder,
                  )}
                  size="sm"
                  selectedDate={dates.verdictViewDate}
                  onChange={(date, valid) =>
                    handleDateChange(date, valid, 'verdictViewDate')
                  }
                  blueBox={false}
                  maxDate={new Date()}
                  dateOnly
                />
                <Button
                  onClick={() => handleSetDate('verdictViewDate')}
                  disabled={!dates.verdictViewDate}
                >
                  {formatMessage(strings.defendantVerdictViewDateButtonText)}
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      <Box display="flex" justifyContent="flexEnd" marginTop={1}>
        {defendant.verdictAppealDate ? (
          <Button
            variant="text"
            onClick={handleRevokeAppeal}
            size="small"
            colorScheme="destructive"
          >
            {formatMessage(strings.revokeAppeal)}
          </Button>
        ) : defendant.isSentToPrisonAdmin ? (
          <Button
            variant="text"
            onClick={() => setModalVisible('REVOKE_SEND_TO_PRISON_ADMIN')}
            size="small"
            colorScheme="destructive"
          >
            {formatMessage(strings.revokeSendToPrisonAdmin)}
          </Button>
        ) : (
          <Button
            variant="text"
            onClick={handleSendToPrisonAdmin}
            size="small"
            disabled={
              !workingCase.indictmentReviewDecision ||
              (!isFine && !defendant.verdictViewDate && serviceRequired)
            }
          >
            {formatMessage(strings.sendToPrisonAdmin)}
          </Button>
        )}
      </Box>
      {modalVisible === 'REVOKE_SEND_TO_PRISON_ADMIN' && (
        <Modal
          title={formatMessage(strings.revokeSendToPrisonAdminModalTitle)}
          text={formatMessage(strings.revokeSendToPrisonAdminModalText, {
            courtCaseNumber: workingCase.courtCaseNumber,
            defendant: defendant.name,
          })}
          onPrimaryButtonClick={handleRevokeSendToPrisonAdmin}
          primaryButtonText={formatMessage(strings.revoke)}
          isPrimaryButtonLoading={isUpdatingDefendant}
          secondaryButtonText={formatMessage(core.cancel)}
          onSecondaryButtonClick={() => setModalVisible(undefined)}
        />
      )}
    </>
  )
}

export default BlueBoxWithDate
