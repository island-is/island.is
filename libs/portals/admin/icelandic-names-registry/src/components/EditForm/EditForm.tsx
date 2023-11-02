import React, { useEffect, useState } from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'

import {
  Box,
  Text,
  Divider,
  Button,
  Input,
  Select,
  Checkbox,
  GridRow,
  GridContainer,
  GridColumn,
} from '@island.is/island-ui/core'

import { IcelandicNameType } from '../../types'
import { NameStatusStrings, NameTypeStrings } from '../../constants'

interface PropTypes {
  closeModal: () => void
  onSubmit: (formState: IcelandicNameType) => Promise<void>
  nameData?: IcelandicNameType
}

export const nameTypeOptions = Object.keys(NameTypeStrings).map((x: string) => {
  return {
    label: NameTypeStrings[x],
    value: x,
  }
})

export const statusTypeOptions = Object.keys(NameStatusStrings).map(
  (x: string) => {
    return {
      label: NameStatusStrings[x],
      value: x,
    }
  },
)

const spacing = 3

const initialNameData: IcelandicNameType = {
  icelandicName: '',
  type: '',
  status: '',
  description: null,
  url: null,
  verdict: null,
  visible: true,
}

const EditForm: React.FC<React.PropsWithChildren<PropTypes>> = ({
  closeModal,
  onSubmit,
  nameData = initialNameData,
}) => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const hookFormData = useForm<IcelandicNameType>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: nameData,
    shouldFocusError: true,
    shouldUnregister: false,
  })

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, isSubmitted, isValid, isDirty, errors },
  } = hookFormData

  useEffect(() => {
    register('icelandicName', {
      required: 'Nafn vantar',
      pattern: {
        value: /^\S*$/i,
        message: 'Nafn má ekki innihalda bil',
      },
    })
    register('type', {
      required: 'Tegund nafns vantar',
    })
    register('status', {
      required: 'Stöðu nafns vantar',
    })
    register('url', {
      validate: (x) => {
        if (x && !x.match(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/i)) {
          return 'Vefslóð virðist ekki vera á réttu formi'
        }
      },
    })
    register('description')
    register('verdict')
    register('id')

    if (nameData.id) {
      setIsUpdating(true)
    }
  }, [])

  const inputsDisabled = isSubmitting

  return (
    <FormProvider {...hookFormData}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
          paddingX={[1, 4, 4, 8]}
          paddingY={[6, 6, 6, 12]}
          paddingBottom={6}
        >
          <GridContainer position="none">
            <GridRow>
              <GridColumn span="12/12" paddingBottom={6}>
                <Text variant="h3" as="h1">
                  {!isUpdating
                    ? 'Skráning íslensks nafns'
                    : 'Breyta íslensku nafni'}
                </Text>
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn span="12/12" paddingBottom={spacing}>
                <Controller
                  name="icelandicName"
                  control={control}
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Input
                        name={name}
                        label="Nafn"
                        placeholder="Nafn"
                        size="xs"
                        value={value ?? ''}
                        errorMessage={errors?.icelandicName?.message}
                        backgroundColor="blue"
                        onChange={(e) => onChange(e.target.value)}
                        disabled={inputsDisabled}
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn
                span={['12/12', '12/12', '6/12']}
                paddingBottom={spacing}
              >
                <Controller
                  name="type"
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Select
                        name={name}
                        options={nameTypeOptions}
                        label="Tegund nafns"
                        placeholder="Veldu tegund"
                        value={nameTypeOptions.find(
                          (option) => option.value === value,
                        )}
                        onChange={(option) => onChange(option?.value)}
                        size="xs"
                        hasError={Boolean(errors?.type?.message)}
                        errorMessage={errors?.type?.message}
                        backgroundColor="blue"
                        isDisabled={inputsDisabled}
                        required
                      />
                    )
                  }}
                />
              </GridColumn>
              <GridColumn
                span={['12/12', '12/12', '6/12']}
                paddingBottom={spacing}
              >
                <Controller
                  name="status"
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Select
                        name={name}
                        options={statusTypeOptions}
                        label="Staða"
                        placeholder="Veldu stöðu"
                        value={statusTypeOptions.find(
                          (option) => option.value === value,
                        )}
                        onChange={(option) => onChange(option?.value)}
                        size="xs"
                        hasError={Boolean(errors?.status?.message)}
                        errorMessage={errors?.status?.message}
                        backgroundColor="blue"
                        isDisabled={inputsDisabled}
                        required
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>

            <GridRow marginTop={3}>
              <GridColumn span="12/12" paddingBottom={spacing}>
                <Controller
                  name="description"
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Input
                        name={name}
                        label="Skýring"
                        size="xs"
                        backgroundColor="blue"
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={inputsDisabled}
                        textarea
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>

            <GridRow marginTop={3}>
              <GridColumn span="12/12" paddingBottom={spacing}>
                <Controller
                  name="url"
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Input
                        name={name}
                        label="Vefslóð á úrskurð"
                        placeholder="Vefslóð á úrskurð mannanafnanefndar"
                        size="xs"
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        errorMessage={errors?.url?.message ?? ''}
                        disabled={inputsDisabled}
                        backgroundColor="blue"
                      />
                    )
                  }}
                />
              </GridColumn>

              <GridColumn span="6/12" paddingBottom={spacing}>
                <Controller
                  name="verdict"
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Input
                        name={name}
                        label="Dags. úrskurðar"
                        placeholder="t.d. 23.08.2014"
                        size="xs"
                        value={value ?? ''}
                        onChange={(e) => onChange(e.target.value)}
                        errorMessage={errors?.verdict?.message ?? ''}
                        disabled={inputsDisabled}
                        backgroundColor="blue"
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>

            <GridRow marginTop={3}>
              <GridColumn span="12/12" paddingBottom={spacing}>
                <Controller
                  name="visible"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Checkbox
                        name="visible"
                        label="Birta nafn á ísland.is"
                        onChange={(e) => {
                          const isChecked = Boolean(e.target.checked)
                          setValue('visible', isChecked)
                          onChange(isChecked)
                        }}
                        checked={value}
                        backgroundColor="white"
                        disabled={inputsDisabled}
                        large
                      />
                    )
                  }}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>

        <Divider weight="blueberry200" />

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
          paddingX={[1, 4, 4, 8]}
          paddingTop={6}
          paddingBottom={3}
        >
          <GridContainer position="none">
            <GridRow>
              <GridColumn span="6/12" paddingBottom={3}>
                <Box>
                  <Button
                    onClick={() => {
                      reset()
                      closeModal()
                    }}
                    variant="ghost"
                    colorScheme="destructive"
                    disabled={inputsDisabled}
                  >
                    Hætta við
                  </Button>
                </Box>
              </GridColumn>
              <GridColumn span="6/12" paddingBottom={3}>
                <Box display="flex" justifyContent="flexEnd" width="full">
                  <Button
                    type="submit"
                    icon="checkmark"
                    loading={isSubmitting}
                    iconType="outline"
                    disabled={!isValid || inputsDisabled || !isDirty}
                  >
                    {isUpdating ? 'Uppfæra nafn' : 'Skrá nafn'}
                  </Button>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </form>
    </FormProvider>
  )
}

export default EditForm
