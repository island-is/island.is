import { Box, GridRow, GridColumn, Input, Text } from '@island.is/island-ui/core'
import { coreDefaultFieldMessages } from '@island.is/application/core'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { previewWorkspaceInputBackgroundColor } from '../../utils/translationWorkspaceFieldConstants'
import type { PreviewFormatMessage } from '../../types/translationWorkspace'
import type { FieldPreviewBaseProps } from './types'
import {
  descriptionTitleVariantToText,
  parseBankAccountPreviewValue,
} from './translationWorkspaceFieldPreviewUtils'

export type BankAccountFieldPreviewProps = FieldPreviewBaseProps & {
  formatMessage: PreviewFormatMessage
  previewValue?: string
  errorMessage?: string
}

export const BankAccountFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
  previewValue,
  errorMessage,
}: BankAccountFieldPreviewProps) => {
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)
  const inputBg = previewWorkspaceInputBackgroundColor(screen)
  const { bankNumber, ledger, accountNumber } =
    parseBankAccountPreviewValue(previewValue)
  const hasError = !!errorMessage

  const titleText =
    screen.title != null && screen.title !== ''
      ? resolveTranslatableStaticText(
          screen.title,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : ''
  const titleV = descriptionTitleVariantToText(screen.titleVariant)

  return (
    <Box key={key} {...layout}>
      {titleText !== '' && (
        <Box marginBottom={1}>
          <Text variant={titleV}>{titleText}</Text>
        </Box>
      )}
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '4/12']}
          paddingBottom={2}
        >
          <Input
            label={formatMessage(
              coreDefaultFieldMessages.defaultBankAccountBankNumber,
            )}
            name={`${key}.__preview.bankNumber`}
            placeholder="0000"
            value={bankNumber}
            readOnly
            hasError={hasError}
            errorMessage={errorMessage}
            backgroundColor={inputBg}
          />
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '12/12', '3/12', '2/12']}
          paddingBottom={2}
        >
          <Input
            label={formatMessage(
              coreDefaultFieldMessages.defaultBankAccountLedger,
            )}
            name={`${key}.__preview.ledger`}
            placeholder="00"
            value={ledger}
            readOnly
            hasError={hasError}
            errorMessage={errorMessage}
            backgroundColor={inputBg}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12', '6/12']}>
          <Input
            label={formatMessage(
              coreDefaultFieldMessages.defaultBankAccountAccountNumber,
            )}
            name={`${key}.__preview.accountNumber`}
            placeholder="000000"
            value={accountNumber}
            readOnly
            hasError={hasError}
            errorMessage={errorMessage}
            backgroundColor={inputBg}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
