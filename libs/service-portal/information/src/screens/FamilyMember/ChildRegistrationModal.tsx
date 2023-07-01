import React, { FC, useState } from 'react'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  GridColumn,
  GridRow,
  InputError,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useUserProfile } from '@island.is/service-portal/graphql'
import { parseNumber } from '@island.is/service-portal/core'
import { gql, useMutation } from '@apollo/client'
import { formatNationalId, Modal } from '@island.is/service-portal/core'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { useLocale, useNamespaces } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'
import { spmm } from '../../lib/messages'

type RegistrationData = {
  parentName: string
  parentNationalId: string
  childName: string
  childNationalId: string
}

type FormDataType = {
  email: string
  tel: string
  text: string
}

interface Props {
  data: RegistrationData
}

export const NATIONAL_REGISTRY_CHILDREN_CORRECTION = gql`
  mutation NationalRegistryChildCorrectionMutation(
    $input: FamilyCorrectionInput!
  ) {
    nationalRegistryChildCorrection(input: $input) {
      success
      message
    }
  }
`

export const ChildRegistrationModal: FC<React.PropsWithChildren<Props>> = ({
  data,
}) => {
  useNamespaces('sp.family')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDataType>()
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile()

  const [postChildrenCorrection, { error, loading }] = useMutation(
    NATIONAL_REGISTRY_CHILDREN_CORRECTION,
  )

  const handleSubmitForm = async (submitData: FormDataType) => {
    await postChildrenCorrection({
      variables: {
        input: {
          nationalIdChild: data.childNationalId,
          phonenumber: submitData.tel,
          email: submitData.email,
          comment: submitData.text,
        },
      },
    }).then((res) => {
      if (res.data?.nationalRegistryChildCorrection?.success) {
        toast.success(formatMessage(spmm.childRegisterSuccess))
        setIsModalOpen(false)
      } else {
        toast.error(formatMessage(spmm.childRegisterError))
        setIsModalOpen(false)

        throw new Error('Error submitting registration data')
      }
    })
  }

  return (
    <Modal
      id="child-registration-modal"
      isVisible={isModalOpen}
      toggleClose={false}
      initialVisibility={false}
      disclosure={
        <Box display="inlineBlock" paddingBottom={1}>
          <Button
            colorScheme="default"
            icon="receipt"
            iconType="filled"
            size="default"
            type="button"
            variant="utility"
            onClick={() => setIsModalOpen(true)}
          >
            {formatMessage(spmm.childRegisterModalButton)}
          </Button>
        </Box>
      }
    >
      <Box marginTop={[3, 0]}>
        <Box paddingBottom={4}>
          <Text variant="h4" paddingBottom={3}>
            {formatMessage(spmm.childRegisterRegistrationText)}
          </Text>
          <BulletList>
            <Bullet>
              {`${formatMessage(spmm.childRegisterParentName)} ${
                data.parentName
              }`}
            </Bullet>
            <Bullet>
              {`${formatMessage(
                spmm.childRegisterParentSSN,
              )} ${formatNationalId(data.parentNationalId)}`}
            </Bullet>
            <Bullet>
              {`${formatMessage(spmm.childRegisterName)} ${data.childName}`}
            </Bullet>
            <Bullet>
              {`${formatMessage(spmm.childRegisterSSN)} ${formatNationalId(
                data.childNationalId,
              )}`}
            </Bullet>
          </BulletList>
        </Box>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Box>
            <GridRow marginBottom={3}>
              <GridColumn span={['12/12', '6/12']}>
                <InputController
                  control={control}
                  id="email"
                  name="email"
                  defaultValue={userProfile?.email ?? ''}
                  required={true}
                  type="email"
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage({
                        id: 'sp.family:email-required-msg',
                        defaultMessage: 'Skylda er að fylla út netfang',
                      }),
                    },
                  }}
                  label={formatMessage(sharedMessages.email)}
                  error={errors.email?.message}
                  size="xs"
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <InputController
                  control={control}
                  id="tel"
                  name="tel"
                  required={true}
                  type="tel"
                  format={'### ####'}
                  defaultValue={parseNumber(
                    userProfile?.mobilePhoneNumber || '',
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage({
                        id: 'sp.family:tel-required-msg',
                        defaultMessage: 'Skylda er að fylla út símanúmer',
                      }),
                    },
                  }}
                  label={formatMessage(sharedMessages.phoneNumber)}
                  error={errors.tel?.message}
                  size="xs"
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="12/12">
                <InputController
                  control={control}
                  id="text"
                  name="text"
                  required={true}
                  type="text"
                  defaultValue=""
                  textarea
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage({
                        id: 'sp.family:text-required-msg',
                        defaultMessage: 'Skylda er að fylla út athugasemd',
                      }),
                    },
                  }}
                  label={formatMessage({
                    id: 'sp.family:text-required-msg-label',
                    defaultMessage: 'Athugasemd',
                  })}
                  error={errors.text?.message}
                  size="xs"
                />
              </GridColumn>
            </GridRow>
          </Box>
          {error && (
            <Box>
              <InputError
                id="child-registration-error"
                errorMessage={formatMessage(spmm.childRegisterError)}
              />
            </Box>
          )}
          <Box
            display="flex"
            justifyContent="flexEnd"
            alignItems="center"
            flexDirection={['columnReverse', 'row']}
            marginTop={4}
          >
            <Button
              variant="primary"
              type="submit"
              size="small"
              icon="arrowForward"
              disabled={false}
              loading={loading}
            >
              {formatMessage(spmm.childRegisterSend)}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default ChildRegistrationModal
