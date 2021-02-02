import React, { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import Markdown from 'markdown-to-jsx'
import {
  Button,
  Box,
  ModalBase,
  Text,
  Stack,
  FocusableBox,
  Icon,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { APPLICANT_APPLICATIONS } from '@island.is/application/graphql'
import { Address } from '@island.is/api/schema'
import * as styles from './ErrorModal.treat'
import { m } from '../../forms/messages'

interface ContentType {
  title?: string
  description?: string
  buttonText?: string
  buttonAction?: () => void
}

const ErrorModal: FC<FieldBaseProps> = ({ application }) => {
  const { typeId } = application

  const { formatMessage } = useLocale()
  const history = useHistory()

  const [content, setContent] = useState<ContentType>()

  const { data: applicationData, error: applicationsError } = useQuery(
    APPLICANT_APPLICATIONS,
    {
      variables: {
        typeId: typeId,
      },
    },
  )

  // TODO: Add conditions if former country is outside EU and if paper application is active
  useEffect(() => {
    const { externalData } = application
    const address = (externalData?.nationalRegistry?.data as {
      address?: Address
    })?.address
    const isInsured = externalData?.healthInsurance?.data
    const oldPendingApplications = externalData?.oldPendingApplications
      ?.data as string[]

    if (isInsured === true) {
      setContent({
        title: 'Already insured',
        description:
          'It seems like you already have a health insurance in Iceland',
        buttonText: 'OK',
        buttonAction: () => history.push(`../umsoknir/${typeId}`),
      })
    } else if (
      applicationData &&
      applicationData.getApplicationsByApplicant.length > 1
    ) {
      setContent({
        title: formatText(m.activeApplicationTitle, application, formatMessage),
        description: formatText(
          m.activeApplicationDescription,
          application,
          formatMessage,
        ),
        buttonText: formatText(
          m.activeApplicationButtonText,
          application,
          formatMessage,
        ),
      })
    } else if (oldPendingApplications?.length > 0) {
      setContent({
        title: formatText(m.activeApplicationTitle, application, formatMessage),
        description: formatText(
          () => ({
            ...m.oldPendingApplicationDescription,
            values: { applicationNumber: oldPendingApplications[0] },
          }),
          application,
          formatMessage,
        ),
        buttonText: formatText(
          m.oldPendingApplicationButtonText,
          application,
          formatMessage,
        ),
      })
    }
    // if user is not registered in Island, display error modal
    else if (
      !address ||
      (address && !(address.streetAddress && address.postalCode))
    ) {
      setContent({
        title: formatText(m.registerYourselfTitle, application, formatMessage),
        description: formatText(
          m.registerYourselfDescription,
          application,
          formatMessage,
        ),
        buttonText: formatText(
          m.registerYourselfButtonText,
          application,
          formatMessage,
        ),
      })
    }
  }, [applicationData])

  return (
    <ModalBase
      baseId="healthInsuranceErrorModal"
      initialVisibility={true}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <Box
          background="white"
          paddingX={[3, 3, 3, 15]}
          paddingY={[7, 7, 7, 12]}
          borderRadius="large"
        >
          <FocusableBox
            component="button"
            onClick={closeModal}
            className={styles.close}
          >
            <Icon icon="close" color="blue400" size="medium" />
          </FocusableBox>
          <Stack space={[5, 5, 5, 7]}>
            <Stack space={2}>
              <Text variant={'h1'}>{content?.title}</Text>
              <Text variant={'intro'}>
                <Markdown>{content?.description as string}</Markdown>
              </Text>
            </Stack>
            <GridRow align="spaceBetween" className={styles.gridFix}>
              <GridColumn span={['12/12', '12/12', '1/3']}>
                <Button
                  size="default"
                  variant="ghost"
                  colorScheme="destructive"
                  onClick={() => {
                    closeModal()
                    if (content?.buttonAction) content?.buttonAction()
                  }}
                  fluid
                >
                  {formatText(
                    m.modalCloseButtonText,
                    application,
                    formatMessage,
                  )}
                </Button>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '1/3']}>
                <Button
                  size="default"
                  onClick={() => {
                    closeModal()
                    history.push(`../umsoknir/${typeId}`)
                  }}
                  fluid
                >
                  {content?.buttonText}
                </Button>
              </GridColumn>
            </GridRow>
          </Stack>
        </Box>
      )}
    </ModalBase>
  )
}

export default ErrorModal
