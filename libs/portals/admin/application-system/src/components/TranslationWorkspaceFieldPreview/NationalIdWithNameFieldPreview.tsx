import { Box, GridRow, GridColumn, Input } from '@island.is/island-ui/core'
import { coreErrorMessages } from '@island.is/application/core'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { previewWorkspaceInputBackgroundColor } from '../../utils/translationWorkspaceFieldConstants'
import type { FieldPreviewBaseProps } from './types'

export const NationalIdWithNameFieldPreview = ({
  screen,
  resolvePreviewString,
}: FieldPreviewBaseProps) => {
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)

  const nationalIdLabel = screen.nationalIdWithNameCustomNationalIdLabelText
    ? resolveTranslatableStaticText(
        screen.nationalIdWithNameCustomNationalIdLabelText,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : resolvePreviewString(
        coreErrorMessages.nationalRegistryNationalId.id,
        coreErrorMessages.nationalRegistryNationalId.defaultMessage,
      )

  const nameLabel = screen.nationalIdWithNameCustomNameLabelText
    ? resolveTranslatableStaticText(
        screen.nationalIdWithNameCustomNameLabelText,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : resolvePreviewString(
        coreErrorMessages.nationalRegistryName.id,
        coreErrorMessages.nationalRegistryName.defaultMessage,
      )

  const showPhone = screen.nationalIdWithNameShowPhoneField === true
  const showEmail = screen.nationalIdWithNameShowEmailField === true

  const inputBg = previewWorkspaceInputBackgroundColor(screen)

  const phoneLabel = showPhone
    ? screen.nationalIdWithNamePhoneLabelText
      ? resolveTranslatableStaticText(
          screen.nationalIdWithNamePhoneLabelText,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : resolvePreviewString(
          coreErrorMessages.nationalRegistryPhone.id,
          coreErrorMessages.nationalRegistryPhone.defaultMessage,
        )
    : ''

  const emailLabel = showEmail
    ? screen.nationalIdWithNameEmailLabelText
      ? resolveTranslatableStaticText(
          screen.nationalIdWithNameEmailLabelText,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : resolvePreviewString(
          coreErrorMessages.nationalRegistryEmail.id,
          coreErrorMessages.nationalRegistryEmail.defaultMessage,
        )
    : ''

  return (
    <Box key={key} {...layout}>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
          <Input
            label={nationalIdLabel}
            name={`${key}.__preview.nationalId`}
            placeholder="######-####"
            backgroundColor={inputBg}
            readOnly
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
          <Input
            label={nameLabel}
            name={`${key}.__preview.name`}
            readOnly
            backgroundColor={inputBg}
          />
        </GridColumn>
      </GridRow>
      {(showPhone || showEmail) && (
        <GridRow>
          {phoneLabel ? (
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={3}>
              <Input
                label={phoneLabel}
                name={`${key}.__preview.phone`}
                backgroundColor={inputBg}
                readOnly
              />
            </GridColumn>
          ) : null}
          {emailLabel ? (
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={3}>
              <Input
                label={emailLabel}
                name={`${key}.__preview.email`}
                type="email"
                backgroundColor={inputBg}
                readOnly
              />
            </GridColumn>
          ) : null}
        </GridRow>
      )}
    </Box>
  )
}
