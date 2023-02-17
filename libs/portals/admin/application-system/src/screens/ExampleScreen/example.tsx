import React, { useState } from 'react'
import {
  useForm,
  FormProvider,
  Controller,
  SubmitHandler,
} from 'react-hook-form'
// import { ApplicationApplicationsAdminInput } from '@island.is/api/schema'
import {
  Box,
  Stack,
  Text,
  GridRow,
  GridColumn,
  GridContainer,
  SkeletonLoader,
  Button,
  Input,
  Divider,
} from '@island.is/island-ui/core'
import { useGetApplicationsQuery } from '../../queries/overview.generated'

const TODAY = new Date()

export type ApplicationFilters = {
  nationalId?: string
  period: {
    from?: Date
    to?: Date
  }
  institution?: string
}

const Overview = () => {
  const hookFormData = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: false,
  })

  const [filters, setFilters] = useState<ApplicationFilters>({
    nationalId: '',
    institution: '',
    period: {
      from: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1, 0, 0, 0, 0),
      to: new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        TODAY.getDate(),
        23,
        59,
        59,
        999,
      ),
    },
  })

  const { data, loading: queryLoading, refetch } = useGetApplicationsQuery({
    ssr: false,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        nationalId: filters.nationalId || '',
      },
    },
  })

  const { applicationApplicationsAdmin: ApplicationAdminList = [] } = data ?? {}

  const applyFilters: SubmitHandler<ApplicationFilters> = (
    data: ApplicationFilters,
  ) => {
    setFilters(data)
    refetch()
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '4/12', '3/12']}
          order={[2, 2, 2, 0]}
        >
          <Stack space={3}>
            <Box marginY={3} borderRadius="large">
              <Box paddingX={4} paddingY={3}>
                <Text variant="h4">Síun</Text>
              </Box>
              <Divider weight="purple200" />
              <Box padding={4}>
                <FormProvider {...hookFormData}>
                  <Box
                    component="form"
                    display="flex"
                    flexDirection="column"
                    justifyContent="spaceBetween"
                    height="full"
                    onSubmit={hookFormData.handleSubmit(applyFilters)}
                  >
                    <Controller
                      name="nationalId"
                      defaultValue="0101307789"
                      render={({ onChange, value }) => (
                        <Input
                          name="nationalId"
                          label="Kennitala"
                          size="xs"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                    <Button type="submit" fluid>
                      Beita síu
                    </Button>
                  </Box>
                </FormProvider>
              </Box>
            </Box>
          </Stack>
        </GridColumn>

        <GridColumn
          span={['12/12', '12/12', '12/12', '8/12']}
          offset={['0', '0', '0', '0', '1/12']}
        >
          {queryLoading ? (
            <SkeletonLoader height={500} />
          ) : (
            <Box marginBottom={[3, 3, 3, 12]}>
              <Stack space={3}>
                <Box paddingBottom={2} paddingTop={3}>
                  <Text variant="h3" as="h3">
                    <span>Niðurstaða</span>
                    {/* map over data here */}
                    {ApplicationAdminList?.map((application) => {
                      console.log(application)
                      return (
                        <div key={application.id}>
                          <Divider weight="purple200" />
                          <p>{application.name}</p>
                          <p>{application.typeId}</p>
                          <p>{application.applicant}</p>
                          <p>{application.created}</p>
                          <p>{application.modified}</p>
                          <p>{application.status}</p>
                          <p>{application.id}</p>
                        </div>
                      )
                    })}
                  </Text>
                </Box>
              </Stack>
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Overview
