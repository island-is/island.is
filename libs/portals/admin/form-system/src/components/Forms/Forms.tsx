import { useMutation } from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { FormStatus } from '@island.is/form-system/enums'
import { CREATE_FORM, IMPORT_FORM } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Checkbox,
  Filter,
  FilterInput,
  GridRow,
  Icon,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { FormsContext } from '../../context/FormsContext'
import { FormSystemPaths } from '../../lib/paths'
import { OrganizationSelect } from '../OrganizationSelect'
import * as tableStyles from '../tableHeader.css'
import {
  SortColumn,
  SortDirection,
  TableHeader,
} from './components/Table/TableHeader'
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

  const [sort, setSort] = useState<{
    column: SortColumn | null
    direction: SortDirection
  }>({
    column: null,
    direction: 'asc',
  })

  const [isCreatingForm, setIsCreatingForm] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const importInProgress = useRef(false)
  const [isImportingForm, setIsImportingForm] = useState(false)
  const [importFormMutation] = useMutation(IMPORT_FORM)

  const importForm = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || importInProgress.current || !organizationNationalId) return

    importInProgress.current = true
    setIsImportingForm(true)
    try {
      const formJson = await file.text()
      JSON.parse(formJson)
      const { data } = await importFormMutation({
        variables: { input: { organizationNationalId, formJson } },
      })
      const form = data?.importFormSystemForm?.form
      if (!form?.id) throw new Error('Missing imported form')
      setForms((forms) => [form, ...forms])
      navigate(
        `${FormSystemPaths.Form.replace(
          ':formId',
          form.id,
        )}?organizationNationalId=${organizationNationalId}`,
      )
    } catch {
      toast.error(formatMessage(m.importFormError))
    } finally {
      importInProgress.current = false
      setIsImportingForm(false)
    }
  }

  const importButton = (
    <Button
      variant="ghost"
      size="default"
      nowrap
      onClick={() => fileInput.current?.click()}
      loading={isImportingForm}
      disabled={isCreatingForm || isImportingForm || !organizationNationalId}
    >
      <Box
        component="span"
        display="inlineFlex"
        alignItems="center"
        columnGap={1}
      >
        {formatMessage(m.importForm)}
        <Icon icon="upload" size="large" type="outline" ariaHidden />
      </Box>
    </Button>
  )

  const defaultDirection: Record<SortColumn, SortDirection> = {
    name: 'asc',
    lastModified: 'desc',
    status: 'asc',
  }

  const handleSort = (column: SortColumn) => {
    setSort((prev) => ({
      column,
      direction:
        prev.column === column
          ? prev.direction === 'asc'
            ? 'desc'
            : 'asc'
          : defaultDirection[column],
    }))
  }

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
    setIsCreatingForm(true)
    try {
      const { data } = await formSystemCreateFormMutation({
        variables: {
          input: {
            organizationNationalId: organizationNationalId,
          },
        },
      })
      navigate(
        `${FormSystemPaths.Form.replace(
          ':formId',
          String(data?.createFormSystemForm?.form?.id),
        )}?organizationNationalId=${organizationNationalId}`,
      )
    } catch (error) {
      setIsCreatingForm(false)
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
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        aria-label={formatMessage(m.importForm)}
        hidden
        onChange={importForm}
      />
      {isAdmin && (
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
              ></Box>
              {isAdmin && <OrganizationSelect />}
            </Box>
          </Box>
        </GridRow>
      )}
      <Box
        display={['flex', 'flex', 'none']}
        marginBottom={2}
        columnGap={2}
        flexWrap="wrap"
        rowGap={2}
      >
        <Box display="flex" style={{ minWidth: 144 }}>
          <Button
            fluid
            size="small"
            onClick={createForm}
            disabled={isCreatingForm || isImportingForm}
          >
            {formatMessage(m.newForm)}
          </Button>
        </Box>
        {importButton}
      </Box>
      <Box
        display="flex"
        width="full"
        marginBottom={2}
        justifyContent="flexEnd"
        alignItems="baseline"
      >
        <Box display={['none', 'none', 'flex']} columnGap={2}>
          <Box display="flex" style={{ minWidth: 144 }}>
            <Button
              fluid
              size="small"
              onClick={createForm}
              disabled={isCreatingForm || isImportingForm}
            >
              {formatMessage(m.newForm)}
            </Button>
          </Box>
          {importButton}
        </Box>
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
      <Box className={tableStyles.tableWrapper}>
        <TableHeader
          sortColumn={sort.column}
          sortDirection={sort.direction}
          onSort={handleSort}
        />
        {forms &&
          [...forms]
            .filter((form) => formFilter(form))
            .sort((a, b) => {
              const dir = sort.direction === 'asc' ? 1 : -1
              if (sort.column === 'name') {
                return dir * (a.name?.is ?? '').localeCompare(b.name?.is ?? '')
              }
              if (sort.column === 'lastModified') {
                return (
                  dir *
                  (new Date(a.modified ?? 0).getTime() -
                    new Date(b.modified ?? 0).getTime())
                )
              }
              if (sort.column === 'status') {
                return dir * (a.status ?? '').localeCompare(b.status ?? '')
              }
              return 0
            })
            .map((f) => (
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
                lastModifiedBy={f?.lastModifiedBy ?? ''}
              />
            ))}
      </Box>
    </>
  )
}
