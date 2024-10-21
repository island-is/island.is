import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { FormSystemFormCertificationType, FormSystemCertificationTypeDtoTypeEnum, FormSystemForm } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../../lib/messages'

export const Premises = () => {
  const { control, controlDispatch, certificationTypes: certTypes, formUpdate } =
    useContext(ControlContext)
  const [formCertificationTypes, setFormCertificationTypes] = useState<
    FormSystemFormCertificationType[]
  >(
    control.form?.certificationTypes?.filter(
      (d): d is FormSystemFormCertificationType => d !== null,
    ) ?? [],
  )

  const handleCheckboxChange = (certificationType?: FormSystemCertificationTypeDtoTypeEnum) => {
    const newCertificationTypes = formCertificationTypes.some(
      (f) => f?.type === certificationType,
    )
      ? formCertificationTypes.filter((f) => f?.type !== certificationType)
      : ([
        ...formCertificationTypes,
        certTypes?.find((d) => d?.type === certificationType),
      ].filter((d) => d !== undefined) as FormSystemFormCertificationType[])
    setFormCertificationTypes(newCertificationTypes)
    const updatedForm: FormSystemForm = { ...control.form, certificationTypes: newCertificationTypes }
    controlDispatch({
      type: 'CHANGE_FORM_SETTINGS',
      payload: {
        newForm: updatedForm,
      },
    })
    formUpdate(updatedForm)
  }
  const { formatMessage } = useIntl()

  return (
    <div>
      <Box padding={2} marginBottom={2}>
        <Text variant="h4">{formatMessage(m.premisesTitle)}</Text>
      </Box>
      <Stack space={2}>
        {certTypes?.map((d, i) => {
          return (
            <Checkbox
              key={i}
              label={d?.name?.is}
              name={d?.name?.is ?? ''}
              subLabel={d?.description?.is}
              rightContent={d?.description?.is}
              value={d?.type ?? ''}
              large
              checked={formCertificationTypes?.some((f) => f?.type === d?.type)}
              onChange={() => handleCheckboxChange(d?.type ?? undefined)}
            />
          )
        })}
      </Stack>
    </div>
  )
}
