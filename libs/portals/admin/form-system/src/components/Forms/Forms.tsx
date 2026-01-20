import { useMutation } from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { FormStatus } from '@island.is/form-system/enums'
import { CREATE_FORM } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Checkbox,
  Filter,
  FilterInput,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { FormsContext } from '../../context/FormsContext'
import { FormSystemPaths } from '../../lib/paths'
import { OrganizationSelect } from '../OrganizationSelect'
import { TableHeader } from './components/Table/TableHeader'
import { TableRow } from './components/Table/TableRow'

const defaultFormState = [
  FormStatus.IN_DEVELOPMENT,
  FormStatus.PUBLISHED,
  FormStatus.PUBLISHED_BEING_CHANGED,
]

export const Forms = () => {
  const {
    forms,
    setForms,
    isAdmin,
    organizationNationalId,
    handleOrganizationChange,
  } = useContext(FormsContext)
  const navigate = useNavigate()
  const { formatMessage } = useIntl()
  const [filter, setFilter] = useState<{
    name: string
    formState: Array<string>
  }>({
    name: '',
    formState: defaultFormState,
  })

  const categories = [
    {
      id: 'formState',
      label: 'Staða',
      selected: filter.formState,
      filters: [
        {
          value: FormStatus.IN_DEVELOPMENT,
          label: 'Í vinnslu',
        },
        {
          value: FormStatus.PUBLISHED,
          label: 'Útgefin',
        },
        {
          value: FormStatus.PUBLISHED_BEING_CHANGED,
          label: 'Útgefin í vinnslu',
        },
      ],
    },
  ]

  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM, {
    onCompleted: (newFormData) => {
      if (newFormData?.createFormSystemForm?.form) {
        setForms((prevForms) => [
          ...prevForms,
          newFormData.createFormSystemForm.form,
        ])
      }
    },
  })

  const createForm = async () => {
    try {
      const { data } = await formSystemCreateFormMutation({
        variables: {
          input: {
            organizationNationalId: organizationNationalId,
          },
        },
      })
      navigate(
        FormSystemPaths.Form.replace(
          ':formId',
          String(data?.createFormSystemForm?.form?.id),
        ),
      )
    } catch (error) {
      throw new Error(
        `Error creating form: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  useEffect(() => {
    if (isAdmin && organizationNationalId && handleOrganizationChange) {
      handleOrganizationChange({ value: organizationNationalId })
    }
  }, [])

  const formFilter = (form: FormSystemForm) => {
    const matchesStatus =
      filter.formState.length === 0 || filter.formState.includes(form.status)

    const matchesName =
      filter.name.length === 0 ||
      (form.name?.is &&
        form.name.is.toLowerCase().includes(filter.name.toLowerCase()))

    return matchesStatus && matchesName
  }

  return (
    <>
      <GridRow>
        <Box
          marginTop={4}
          marginBottom={3}
          marginRight={1}
          marginLeft={2}
          display="flex"
          justifyContent="flexEnd"
          width="full"
        >
          <Box justifyContent="spaceBetween" display="flex" width="full">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              columnGap={4}
            >
              <Button size="default" onClick={createForm}>
                {formatMessage(m.newForm)}
              </Button>
            </Box>
            {isAdmin && <OrganizationSelect />}
          </Box>
        </Box>
      </GridRow>
      <Box
        display="flex"
        width="full"
        marginBottom={3}
        justifyContent="flexEnd"
      >
        <Filter
          labelClearAll="Hreinsa allar síur"
          labelClear="Hreinsa síu"
          labelOpen="Opna síu"
          labelClose="Loka síu"
          labelTitle="Sía API Vörulista"
          labelResult="Sýna niðurstöður"
          align="right"
          onFilterClear={() =>
            setFilter({
              name: '',
              formState: defaultFormState,
            })
          }
          variant="popover"
          filterInput={
            <FilterInput
              name="filter-input"
              placeholder="Sía eftir leitarorði"
              value={filter.name}
              onChange={(value) => setFilter({ ...filter, name: value })}
              button={{
                label: 'Search',
                onClick: () => undefined,
              }}
            />
          }
        >
          <Box
            paddingX={3}
            paddingY={1}
            borderRadius="large"
            background="white"
          >
            <Stack space={2}>
              <Text variant="h4">Staða</Text>
              {categories[0].filters.map((category) => (
                <Checkbox
                  key={category.value}
                  name={category.value}
                  label={category.label}
                  value={category.value}
                  checked={filter.formState.includes(category.value)}
                  onChange={(event) => {
                    const value = event.target.value
                    let newSelected = [...filter.formState]
                    if (newSelected.includes(value)) {
                      newSelected = newSelected.filter((item) => item !== value)
                    } else {
                      newSelected.push(value)
                    }
                    setFilter({ ...filter, formState: newSelected })
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Filter>
      </Box>
      <TableHeader />
      {forms &&
        forms
          ?.filter((form) => formFilter(form))
          .map((f) => {
            return (
              <TableRow
                key={f?.id}
                id={f?.id}
                name={f?.name?.is ?? ''}
                isHeader={false}
                translated={f?.isTranslated ?? false}
                slug={f?.slug ?? ''}
                beenPublished={f?.beenPublished ?? false}
                setFormsState={setForms}
                status={f?.status}
                lastModified={f?.modified}
                url={f?.submissionServiceUrl ?? ''}
              />
            )
          })}
    </>
  )
}
