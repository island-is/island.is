import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import {
  DescriptionText,
  BorderedAccordion,
  CopyUrl,
} from '@island.is/application/templates/family-matters-core/components'
import {
  formatPhoneNumber,
  getOtherParentInformation,
} from '@island.is/application/templates/family-matters-core/utils'
import { confirmation, copyUrl } from '../../lib/messages'
import { confirmationIllustration } from '../Shared.css'
import { ContractOverview } from '../components'
import { CRCFieldBaseProps } from '../..'
import { Roles } from '../../lib/constants'

const Confirmation = ({ application }: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application
  const children = externalData.childrenCustodyInformation.data
  const otherParent = getOtherParentInformation(
    children,
    answers.selectedChildren,
  )
  return (
    <Box marginTop={3} paddingBottom={5}>
      <DescriptionText
        text={confirmation.general.description}
        // In confirmation.general.description we render conditionally what message appears depending on what values are defined in the application answers counter party object.
        // The emailParagraph, phoneNumberParagraph and count that are passed to format to handle this logic.
        // We could have gone another route of defining three translations strings, one for each situation, but we were not sure what would be better for the translator.
        format={{
          emailParagraph: answers.counterParty.email
            ? formatMessage(confirmation.general.description.paragraphs.email, {
                email: answers.counterParty.email,
              })
            : '',
          phoneNumberParagraph: answers.counterParty.phoneNumber
            ? formatMessage(
                confirmation.general.description.paragraphs.phoneNumber,
                {
                  phoneNumber: formatPhoneNumber(
                    answers.counterParty.phoneNumber,
                  ),
                },
              )
            : '',
          count: [
            answers.counterParty.email,
            answers.counterParty.phoneNumber,
          ].filter((item) => item).length,
        }}
      />
      <Text variant="h4" marginTop={3}>
        {formatMessage(confirmation.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText
          text={confirmation.nextSteps.description}
          format={{
            parentBName: otherParent.fullName,
            date: answers.confirmContract.timestamp,
          }}
        />
      </Box>
      <Box marginTop={4}>
        <CopyUrl
          title={formatMessage(copyUrl.title)}
          inputLabel={formatMessage(copyUrl.inputLabel)}
          buttonLabel={formatMessage(copyUrl.buttonLabel)}
          successMessage={formatMessage(copyUrl.successMessage)}
        />
      </Box>
      <Box marginTop={5}>
        <BorderedAccordion
          title={formatMessage(confirmation.contractOverview.accordionTitle)}
          id="id_1"
        >
          <ContractOverview
            application={application}
            parentKey={Roles.ParentA}
          />
        </BorderedAccordion>
      </Box>
      <Box className={confirmationIllustration}>
        <img
          src={
            'https://images.ctfassets.net/8k0h54kbe6bj/6UGl8bkfOwUDKYveXfKkh0/c09265b9301b0be52c678a7197a64154/crc-application-submitted.svg'
          }
          alt=""
        />
      </Box>
    </Box>
  )
}

export default Confirmation
