import React, { FC, useState } from 'react'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { gql, useLazyQuery } from '@apollo/client'
import { Modal } from '@island.is/service-portal/core'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { useLocale, useNamespaces } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'

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
  query NationalRegistryChildCorrectionQuery {
    nationalRegistryChildCorrection
  }
`

export const ChildRegistrationModal: FC<Props> = ({ data }) => {
  useNamespaces('sp.family')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { handleSubmit, control, errors } = useForm()
  const { formatMessage } = useLocale()
  const [
    postChildrenCorrection,
    { data: correctionData, error, loading },
  ] = useLazyQuery(NATIONAL_REGISTRY_CHILDREN_CORRECTION)

  const handleSubmitForm = async (data: FormDataType) => {
    await postChildrenCorrection()
    console.log('SUBMIT DATA', data)
  }

  console.log('correctionDatacorrectionDatacorrectionData', correctionData)
  return (
    <Modal
      id="child-registration-modal"
      isVisible={isModalOpen}
      toggleClose={false}
      initialVisibility={false}
      disclosure={
        <Box paddingBottom={1}>
          <Button
            size="small"
            variant="text"
            onClick={() => setIsModalOpen(true)}
          >
            Breyta skráningu
          </Button>
        </Box>
      }
    >
      <Box marginTop={[3, 0]}>
        <Box paddingBottom={4}>
          <Text variant="h4" paddingBottom={3}>
            {formatMessage({
              id: 'sp.family:child-registration-text',
              defaultMessage: 'Athugasemdir vegna skráningar barns',
            })}
          </Text>
          <BulletList>
            <Bullet>
              {`${formatMessage({
                id: 'sp.family:child-registration-parent-name',
                defaultMessage: 'Nafn þess sem tilkynnir ranga skráningu: ',
              })} ${data.parentName}`}
            </Bullet>
            <Bullet>
              {`${formatMessage({
                id: 'sp.family:child-registration-parent-id',
                defaultMessage:
                  'Kennitala þess sem tilkynnir ranga skráningu: ',
              })} ${data.parentNationalId}`}
            </Bullet>
            <Bullet>
              {`${formatMessage({
                id: 'sp.family:child-registration-name',
                defaultMessage: 'Nafn barns sem tilkynning á við: ',
              })} ${data.childName}`}
            </Bullet>
            <Bullet>
              {`${formatMessage({
                id: 'sp.family:child-registration-ssn',
                defaultMessage: 'Kennitala barns sem tilkynning á við: ',
              })} ${data.childNationalId}`}
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
                  defaultValue="test@island.is"
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
                  defaultValue="661 2850"
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
                  defaultValue="Þetta er prufu texti"
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
            >
              {formatMessage({
                id: 'sp.family:child-registration-send',
                defaultMessage: 'Senda tilkynningu',
              })}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default ChildRegistrationModal
