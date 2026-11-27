import { FormSystemField } from '@island.is/api/schema'
import { FamilyTypes } from '@island.is/form-system/enums'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldTypesEnum } from '../../../lib/enums'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'
import { DefaultDisplay } from '../DefaultDisplay/DefaultDisplay'

interface Props {
  item: FormSystemField
  valueIndex?: number
  requiredMissing?: boolean
}

export const NationalIdDisplay = (props: Props) => {
  const { item } = props
  const { lang, formatMessage } = useLocale()
  if (
    item.fieldType !== FieldTypesEnum.FAMILY ||
    item.fieldSettings?.familyType !== FamilyTypes.CHILD
  ) {
    return <NationalIdValueDisplay {...props} />
  }

  const selectedIndexes = (item.values ?? []).flatMap((value, index) =>
    value?.json?.nationalId &&
    (!item.isPartOfMultiset ||
      props.valueIndex === undefined ||
      index === props.valueIndex)
      ? [index]
      : [],
  )

  if (selectedIndexes.length === 0 && props.requiredMissing) {
    return <DefaultDisplay {...props} valueIndex={props.valueIndex ?? 0} />
  }

  return (
    <Stack space={0}>
      <Text as="p" fontWeight="semiBold" lineHeight="sm">
        {item.name?.[lang]}
      </Text>
      {selectedIndexes.length === 0 ? (
        <Box marginLeft={2}>
          <Text>{formatMessage(m.noChildrenSelected)}</Text>
        </Box>
      ) : (
        <Stack space={2}>
          {selectedIndexes.map((index) => (
            <NationalIdValueDisplay
              key={item.values?.[index]?.id ?? index}
              item={item}
              valueIndex={index}
              requiredMissing={false}
              showLabel={false}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}

const NationalIdValueDisplay = ({
  item,
  valueIndex = 0,
  requiredMissing = false,
  showLabel = true,
}: Props & { showLabel?: boolean }) => {
  const { lang, formatMessage } = useLocale()

  const value = item.values?.[valueIndex]
  const nationalId = value?.json?.nationalId ?? undefined
  const name = value?.json?.name ?? undefined
  const showMaritalStatus =
    item.fieldType === FieldTypesEnum.FAMILY &&
    item.fieldSettings?.familyType === FamilyTypes.SPOUSE
  const maritalStatus = getValue(item, 'maritalStatus', valueIndex)
  const isChild =
    item.fieldType === FieldTypesEnum.FAMILY &&
    item.fieldSettings?.familyType === FamilyTypes.CHILD
  const showAddress = !isChild && (item.fieldSettings?.showAddress ?? false)
  const address = value?.json?.address ?? undefined
  const postalCode = value?.json?.postalCode ?? undefined
  const municipality = value?.json?.municipality ?? undefined

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Stack space={0}>
        {showLabel && (
          <Text as="p" fontWeight="semiBold" lineHeight="sm">
            {item.name?.[lang]}
            {requiredMissing && (
              <>
                {' '}
                <Text as="span" fontWeight="medium" color="red600">
                  *
                </Text>
              </>
            )}
          </Text>
        )}
        <Box marginLeft={2}>
          <Stack space={1}>
            <Stack
              space={
                isChild || item.fieldType === FieldTypesEnum.NATIONAL_ID ? 0 : 1
              }
            >
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.individualName)}:`}
                {'\u00A0\u00A0\u00A0'}
                {!name && requiredMissing && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="red600"
                    lineHeight="sm"
                  >
                    {formatMessage(m.missingValue)}
                  </Text>
                )}
                {name && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {name}
                  </Text>
                )}
              </Text>
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.nationalId)}:`}
                {'\u00A0\u00A0\u00A0'}
                {!nationalId && requiredMissing && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="red600"
                    lineHeight="sm"
                  >
                    {formatMessage(m.missingValue)}
                  </Text>
                )}
                {nationalId && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {nationalId}
                  </Text>
                )}
              </Text>
            </Stack>
            {showMaritalStatus && (
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.maritalStatus)}:`}
                {'\u00A0\u00A0\u00A0'}
                <Text
                  as="span"
                  fontWeight="light"
                  color={
                    !maritalStatus && requiredMissing ? 'red600' : 'dark400'
                  }
                  lineHeight="sm"
                >
                  {!maritalStatus && requiredMissing
                    ? formatMessage(m.missingValue)
                    : maritalStatus}
                </Text>
              </Text>
            )}
            {showAddress && (
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.address)}:`}
                {'\u00A0\u00A0\u00A0'}
                {!address && requiredMissing && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="red600"
                    lineHeight="sm"
                  >
                    {formatMessage(m.missingValue)}
                  </Text>
                )}
                {address && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {address}
                  </Text>
                )}
              </Text>
            )}
            {showAddress && (
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.postalCode)}:`}
                {'\u00A0\u00A0\u00A0'}
                {!postalCode && requiredMissing && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="red600"
                    lineHeight="sm"
                  >
                    {formatMessage(m.missingValue)}
                  </Text>
                )}
                {postalCode && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {postalCode}
                  </Text>
                )}
              </Text>
            )}
            {showAddress && (
              <Text fontWeight="medium" lineHeight="sm">
                {`${formatMessage(m.city)}:`}
                {'\u00A0\u00A0\u00A0'}
                {!municipality && requiredMissing && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="red600"
                    lineHeight="sm"
                  >
                    {formatMessage(m.missingValue)}
                  </Text>
                )}
                {municipality && (
                  <Text
                    as="span"
                    fontWeight="light"
                    color="dark400"
                    lineHeight="sm"
                  >
                    {municipality}
                  </Text>
                )}
              </Text>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
