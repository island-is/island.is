import {
  AlertMessage,
  Box,
  Checkbox,
  InputError,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useId } from 'react'
import { m } from '../../../lib/messages'

interface Props {
  label: string
  required?: boolean
  members: { name: string; nationalId: string }[]
  selectedNationalIds?: string[]
  onSelectionChange?: (nationalId: string, checked: boolean) => void
  errorMessage?: string
  validationMessage?: string
}

export const ChildrenTable = ({
  label,
  required,
  members,
  selectedNationalIds,
  onSelectionChange,
  errorMessage,
  validationMessage,
}: Props) => {
  const { formatMessage } = useLocale()
  const id = useId()

  return (
    <Stack space={2}>
      {label && (
        <Text fontWeight="semiBold">
          {label}
          {required && ' *'}
        </Text>
      )}
      <T.Table aria-label={label || formatMessage(m.custodyChildren)}>
        <T.Head>
          <T.Row>
            <T.HeadData scope="col">
              {formatMessage(m.individualName)}
            </T.HeadData>
            <T.HeadData scope="col">{formatMessage(m.nationalId)}</T.HeadData>
            {onSelectionChange && (
              <T.HeadData scope="col" align="center">
                {formatMessage(m.select)}
              </T.HeadData>
            )}
          </T.Row>
        </T.Head>
        <T.Body>
          {errorMessage ? (
            <T.Row>
              <T.Data colSpan={onSelectionChange ? 3 : 2}>
                <AlertMessage type="error" title={errorMessage} />
              </T.Data>
            </T.Row>
          ) : members.length === 0 ? (
            <T.Row>
              <T.Data colSpan={onSelectionChange ? 3 : 2}>
                {formatMessage(m.noCustodyChildren)}
              </T.Data>
            </T.Row>
          ) : (
            members.map((member) => (
              <T.Row key={member.nationalId}>
                <T.Data>{member.name}</T.Data>
                <T.Data>{member.nationalId}</T.Data>
                {onSelectionChange && (
                  <T.Data align="center">
                    <Box display="inlineBlock" style={{ width: 24 }}>
                      <Checkbox
                        name={`${id}-${member.nationalId}`}
                        ariaLabel={`${member.name} (${member.nationalId})`}
                        checked={
                          selectedNationalIds?.includes(member.nationalId) ??
                          false
                        }
                        onChange={(event) =>
                          onSelectionChange(
                            member.nationalId,
                            event.target.checked,
                          )
                        }
                      />
                    </Box>
                  </T.Data>
                )}
              </T.Row>
            ))
          )}
        </T.Body>
      </T.Table>
      {validationMessage && <InputError errorMessage={validationMessage} />}
    </Stack>
  )
}
