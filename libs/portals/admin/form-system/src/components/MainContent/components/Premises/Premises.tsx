import { useMutation } from '@apollo/client'
import {
  FormSystemFormCertificationType,
  FormSystemFormCertificationTypeDto,
  Maybe,
} from '@island.is/api/schema'
import {
  CREATE_CERTIFICATION,
  DELETE_CERTIFICATION,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { Box, Checkbox, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { removeTypename } from '../../../../lib/utils/removeTypename'

export const Premises = () => {
  const {
    control,
    controlDispatch,
    certificationTypes: certTypes,
  } = useContext(ControlContext)
  const { certificationTypes } = control.form
  const [formCertificationTypes, setFormCertificationTypes] = useState<
    FormSystemFormCertificationTypeDto[]
  >(
    (certificationTypes ?? []).filter(
      (type): type is FormSystemFormCertificationTypeDto => type !== null,
    ),
  )
  const [createCertification] = useMutation(CREATE_CERTIFICATION)
  const [deleteCertification] = useMutation(DELETE_CERTIFICATION)

  const handleCheckboxChange = async (
    certificationTemplate: FormSystemFormCertificationType,
    checked: boolean,
  ) => {
    if (checked) {
      try {
        const newCertificate = await createCertification({
          variables: {
            input: {
              createFormCertificationTypeDto: {
                formId: control.form.id,
                certificationTypeId: certificationTemplate.id as string,
              },
            },
          },
        }).then((res) => {
          return removeTypename(res.data?.createFormSystemCertification)
        })
        controlDispatch({
          type: 'CHANGE_CERTIFICATION',
          payload: {
            certificate: newCertificate as FormSystemFormCertificationTypeDto,
            checked: true,
          },
        })
        setFormCertificationTypes([...formCertificationTypes, newCertificate])
      } catch (e) {
        console.error(e)
      }
    } else {
      const certificationToDelete = formCertificationTypes.find(
        (certification) =>
          certification.certificationTypeId === certificationTemplate.id,
      )
      try {
        await deleteCertification({
          variables: {
            input: {
              id: certificationToDelete?.id,
            },
          },
        })
        controlDispatch({
          type: 'CHANGE_CERTIFICATION',
          payload: {
            certificate:
              certificationToDelete as FormSystemFormCertificationTypeDto,
            checked: false,
          },
        })
        setFormCertificationTypes(
          formCertificationTypes.filter(
            (certification) => certification.id !== certificationToDelete?.id,
          ),
        )
      } catch (e) {
        console.error(e)
      }
    }
  }
  const { formatMessage, lang } = useLocale()

  const isChecked = (
    certificationTypeId?: Maybe<string> | undefined,
  ): boolean => {
    if (!certificationTypeId) return false
    return formCertificationTypes.some(
      (certification) =>
        certification?.certificationTypeId === certificationTypeId,
    )
  }

  return (
    <div>
      <Box padding={2} marginBottom={2}>
        <Text variant="h4">{formatMessage(m.premisesTitle)}</Text>
      </Box>
      <Stack space={2}>
        {certTypes?.map((d, i) => {
          if (!d) return null
          return (
            <Checkbox
              key={i}
              label={d?.name?.[lang] ?? ''}
              name={d?.name?.is ?? ''}
              subLabel={d?.description?.[lang]}
              rightContent={d?.description?.is}
              value={d?.id ?? ''}
              large
              checked={isChecked(d?.id)}
              onChange={(e) =>
                handleCheckboxChange(
                  d as FormSystemFormCertificationType,
                  e.target.checked,
                )
              }
            />
          )
        })}
      </Stack>
    </div>
  )
}
