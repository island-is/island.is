import {
  FormSystemField,
  FormSystemForm,
  FormSystemSection,
} from '@island.is/api/schema'
import {
  Action,
  ApplicantDisplay,
  ApplicantTypesEnum,
  AssetDisplay,
  CheckBoxDisplay,
  DateDisplay,
  DefaultDisplay,
  FieldTypesEnum,
  FileUploadDisplay,
  hasFieldValueError,
  IndividualApplicant,
  LegalEntity,
  m,
  NationalIdDisplay,
  PhoneNumberDisplay,
  SectionTypes,
} from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  GridColumn,
  GridRow,
  Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { Dispatch, ElementType } from 'react'

export const PreviewPremises = ({ form }: { form: FormSystemForm }) => {
  const { lang, formatMessage } = useLocale()
  return (
    <Box>
      <Box marginTop={2} marginBottom={5}>
        <Box marginBottom={5}>
          <Text variant="h2">{formatMessage(m.externalDataHeader)}</Text>
        </Box>
        <Box display="flex" alignItems="center">
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">{formatMessage(m.externalDataTitle)}</Text>
        </Box>
      </Box>
      <Box marginBottom={5}>
        <Stack space={2}>
          <div>
            <Text variant="h4" color="blue400">
              {formatMessage(m.icelandicRegistryTitle)}
            </Text>
            <Markdown>{formatMessage(m.icelandicRegistryDescription)}</Markdown>
          </div>
          <div>
            <Text variant="h4" color="blue400">
              {formatMessage(m.myPagesTitle)}
            </Text>
            <Markdown>{formatMessage(m.myPagesDescription)}</Markdown>
          </div>
          {form.certificationTypes?.map((certification) => (
            <div key={certification?.id}>
              <Text variant="h4" color="blue400">
                {certification?.certificationTypeId}
              </Text>
              <Markdown>{certification?.id ?? ''}</Markdown>
            </div>
          ))}
          {form.sectionInfo?.additionalPremises?.map((premise, index) => (
            <div key={index}>
              <Text variant="h4" color="blue400">
                {premise.title?.[lang]}
              </Text>
              <Markdown>{premise.description?.[lang] ?? ''}</Markdown>
            </div>
          ))}
        </Stack>
      </Box>
      <Checkbox
        large
        backgroundColor="blue"
        name="previewExternalDataAgreement"
        label={formatMessage(m.externalDataAgreement)}
      />
    </Box>
  )
}

export const PreviewApplicant = ({
  item,
  dispatch,
}: {
  item: FormSystemField
  dispatch: Dispatch<Action>
}) => {
  const applicantType = item.fieldSettings?.applicantType
  const nationalId = item.values?.[0]?.json?.nationalId ?? ''
  return applicantType === ApplicantTypesEnum.LEGAL_ENTITY ||
    applicantType === ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER ? (
    <LegalEntity applicant={item} nationalId={nationalId} />
  ) : (
    <IndividualApplicant
      applicant={item}
      nationalId={nationalId}
      dispatch={dispatch}
    />
  )
}

const displays: Partial<Record<string, ElementType>> = {
  [FieldTypesEnum.APPLICANT]: ApplicantDisplay,
  [FieldTypesEnum.ASSETS]: AssetDisplay,
  [FieldTypesEnum.CHECKBOX]: CheckBoxDisplay,
  [FieldTypesEnum.DATE_PICKER]: DateDisplay,
  [FieldTypesEnum.FILE]: FileUploadDisplay,
  [FieldTypesEnum.NATIONAL_ID]: NationalIdDisplay,
  [FieldTypesEnum.FAMILY]: NationalIdDisplay,
  [FieldTypesEnum.PHONE_NUMBER]: PhoneNumberDisplay,
}

const SummaryField = ({
  field,
  valueIndex,
  requiredMissing = false,
}: {
  field: FormSystemField
  valueIndex: number
  requiredMissing?: boolean
}) => {
  const Display = displays[field.fieldType ?? ''] ?? DefaultDisplay
  return (
    <Box paddingLeft={2} marginTop={1}>
      <Display
        item={field}
        valueIndex={valueIndex}
        labelsOnly={field.fieldType === FieldTypesEnum.APPLICANT}
        requiredMissing={
          requiredMissing ||
          (Boolean(field.isRequired) && hasFieldValueError(field, valueIndex))
        }
      />
    </Box>
  )
}

export const PreviewSummary = ({
  sections,
  onNavigate,
  hasValidationError,
}: {
  sections: FormSystemSection[]
  onNavigate: (sectionId: string, screenId?: string) => void
  hasValidationError?: (field: FormSystemField, valueIndex: number) => boolean
}) => {
  const { lang, formatMessage } = useLocale()
  return (
    <Box marginTop={2}>
      <Text fontWeight="light" as="p">
        {formatMessage(m.reviewApplication2)}
      </Text>
      {sections
        .filter(
          (section) =>
            !section.isHidden &&
            section.sectionType !== SectionTypes.PAYMENT &&
            section.sectionType !== SectionTypes.COMPLETED &&
            section.sectionType !== SectionTypes.SUMMARY,
        )
        .flatMap((section) =>
          (section.screens ?? [])
            .filter((screen) => !!screen && !screen.isHidden)
            .map((screen) => {
              const fields = (screen?.fields ?? []).filter(
                (field): field is FormSystemField =>
                  !!field &&
                  !field.isHidden &&
                  field.fieldType !== FieldTypesEnum.MESSAGE,
              )
              const firstMultisetFieldIndex = screen?.isMulti
                ? fields.findIndex((field) => field.isPartOfMultiset !== false)
                : -1
              const leadingFields =
                firstMultisetFieldIndex === -1
                  ? fields
                  : fields.slice(0, firstMultisetFieldIndex)
              const repeating =
                firstMultisetFieldIndex === -1
                  ? []
                  : fields.filter((field) => field.isPartOfMultiset !== false)
              const trailingFields =
                firstMultisetFieldIndex === -1
                  ? []
                  : fields
                      .slice(firstMultisetFieldIndex)
                      .filter((field) => field.isPartOfMultiset === false)
              const itemCount = Math.max(
                1,
                ...repeating.map((field) => field.values?.length ?? 0),
              )
              return (
                <Box key={screen?.id} marginTop={2}>
                  <Divider />
                  <GridRow>
                    <GridColumn span={['12/12', '10/12']}>
                      <Box marginTop={2}>
                        <Text as="h3" variant="h3" fontWeight="semiBold">
                          {section.sectionType === SectionTypes.PARTIES
                            ? screen?.fields?.[0]?.name?.[lang] ??
                              screen?.name?.[lang]
                            : screen?.name?.[lang]}
                        </Text>
                      </Box>
                      {leadingFields.map((field) => (
                        <SummaryField
                          key={field.id}
                          field={field}
                          valueIndex={0}
                          requiredMissing={hasValidationError?.(field, 0)}
                        />
                      ))}
                      {Array.from({ length: itemCount }).map(
                        (_, valueIndex) => (
                          <Box key={valueIndex}>
                            {itemCount > 1 && (
                              <Text
                                as="p"
                                fontWeight="semiBold"
                                lineHeight="xs"
                              >
                                {valueIndex + 1}.
                              </Text>
                            )}
                            {repeating.map((field) => (
                              <SummaryField
                                key={field.id}
                                field={field}
                                valueIndex={valueIndex}
                                requiredMissing={hasValidationError?.(
                                  field,
                                  valueIndex,
                                )}
                              />
                            ))}
                          </Box>
                        ),
                      )}
                      {trailingFields.map((field) => (
                        <SummaryField
                          key={field.id}
                          field={field}
                          valueIndex={0}
                          requiredMissing={hasValidationError?.(field, 0)}
                        />
                      ))}
                    </GridColumn>
                    <GridColumn span={['12/12', '2/12']}>
                      <Box
                        display="flex"
                        marginTop={4}
                        justifyContent="flexEnd"
                      >
                        <Button
                          icon="pencil"
                          iconType="filled"
                          variant="utility"
                          inline
                          onClick={() => onNavigate(section.id, screen?.id)}
                        >
                          {formatMessage(m.edit)}
                        </Button>
                      </Box>
                    </GridColumn>
                  </GridRow>
                </Box>
              )
            }),
        )}
    </Box>
  )
}
