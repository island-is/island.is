import React, { useState, useEffect } from 'react'
import {
  Box,
  Table as T,
  Pagination,
  Stack,
  Button,
  Text,
  Input,
  toast,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { pages, PAGE_SIZE, paginate } from '../pagination'
import format from 'date-fns/format'
import { ExportAsCSV } from '@island.is/application/ui-components'
import { useMutation } from '@apollo/client'
import { SendEmailPdf } from '../queries'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

const PetitionsTable = (data: any) => {
  const { formatMessage } = useLocale()
  const [sendEmailPdf] = useMutation(SendEmailPdf)

  const onSendEmail = async () => {
    const response = await sendEmailPdf({
      variables: {
        input: {
          listId: data.listId,
          emailAddress: email,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.viewPetition.toastErrorSendList))
    })

    if (response) {
      const isSuccess = response.data?.endorsementSystemsendPdfEmail.success
      if (isSuccess) {
        toast.success(
          formatMessage(m.viewPetition.toastSuccessSendList) + email,
        )
      } else {
        toast.error(formatMessage(m.viewPetition.toastErrorSendList))
      }
      setEmail('')
    }
  }

  const mapToCSVFile = (petitions: any) => {
    return petitions.map((pet: any) => {
      return {
        Dagsetning: formatDate(pet.created),
        Nafn: pet.meta.fullName
          ? pet.meta.fullName
          : formatMessage(m.viewPetition.noNameLabel),
      }
    })
  }

  const [email, setEmail] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [listOfPetitions, setPetitions] = useState(data.petitions?.data ?? [])

  const handlePagination = (page: number, petitions: any) => {
    setPage(page)
    setTotalPages(pages(petitions?.length))
    setPetitions(paginate(petitions, PAGE_SIZE, page))
  }

  useEffect(() => {
    setPetitions(data.petitions?.data ?? [])
    handlePagination(1, data.petitions?.data ?? [])
  }, [data])

  return (
    <Box>
      <Box display="flex" justifyContent="spaceBetween">
        <Text variant="h3" marginBottom={2}>
          {formatMessage(m.viewPetition.enorsementsTableTitle)}
        </Text>
        {data.isViewTypeEdit && (
          <ExportAsCSV
            data={mapToCSVFile(listOfPetitions) as object[]}
            filename="Meðmælalisti"
            title="Sækja lista"
            variant="text"
          />
        )}
      </Box>
      <Stack space={3}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData>
                {formatMessage(m.viewPetition.dateSigned)}
              </T.HeadData>
              <T.HeadData>{formatMessage(m.viewPetition.name)}</T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {listOfPetitions?.map((petition: any) => {
              return (
                <T.Row key={petition.id}>
                  <T.Data>{formatDate(petition.created)}</T.Data>
                  <T.Data>
                    {petition.meta.fullName
                      ? petition.meta.fullName
                      : formatMessage(m.viewPetition.noNameLabel)}
                  </T.Data>
                </T.Row>
              )
            })}
          </T.Body>
        </T.Table>

        {listOfPetitions && !!listOfPetitions.length ? (
          <>
            <Pagination
              page={page}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() => handlePagination(page, data.petitions?.data)}
                >
                  {children}
                </Box>
              )}
            />

            {data.isViewTypeEdit && (
              <Box marginTop={5}>
                <Text variant="h3" marginBottom={2}>
                  {formatMessage(m.viewPetition.sendListTitle)}
                </Text>

                <Box display={['block', 'flex']}>
                  <Input
                    type="email"
                    name={formatMessage(m.viewPetition.sendListButton)}
                    value={email}
                    label={formatMessage(m.viewPetition.sendListButton)}
                    placeholder={formatMessage(
                      m.viewPetition.sendListPlaceholder,
                    )}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                  <Box
                    marginLeft={[0, 5]}
                    marginTop={[3, 0]}
                    display="flex"
                    alignItems="center"
                    justifyContent={['flexEnd', 'center']}
                  >
                    <Button
                      icon="arrowForward"
                      iconType="outline"
                      disabled={email === ''}
                      onClick={() => onSendEmail()}
                    >
                      {formatMessage(m.viewPetition.sendListButton)}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Text>{formatMessage(m.viewPetition.noPetitionsText)}</Text>
        )}
      </Stack>
    </Box>
  )
}

export default PetitionsTable
