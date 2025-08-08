import { Box, Button, ToggleSwitchButton } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { TableHeader } from './TableHeader'
import { FormSystemOrganizationUrl } from '@island.is/api/schema'
import { TableRow } from './TableRow'
import {
  CREATE_ORGANIZATION_URL,
  DELETE_ORGANIZATION_URL,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { useContext } from 'react'
import { FormsContext } from '../../../../context/FormsContext'
import { UrlMethods, UrlTypes } from '@island.is/form-system/enums'

interface SubmitUrlsProps {
  submitUrls: FormSystemOrganizationUrl[]
}

export const SubmitUrls = ({ submitUrls }: SubmitUrlsProps) => {
  const { formatMessage } = useIntl()
  const { setSubmitUrls, organizationNationalId } = useContext(FormsContext)

  const [formSystemCreateOrganizationUrlMutation] = useMutation(
    CREATE_ORGANIZATION_URL,
    {
      onCompleted: (newUrlData) => {
        if (newUrlData?.createFormSystemOrganizationUrl) {
          setSubmitUrls((prevUrls) => [
            ...prevUrls,
            newUrlData.createFormSystemOrganizationUrl,
          ])
        }
      },
    },
  )

  const createSubmitUrl = async (isTest: boolean, method: string) => {
    try {
      await formSystemCreateOrganizationUrlMutation({
        variables: {
          input: {
            isTest,
            method,
            type: UrlTypes.SUBMIT,
            organizationNationalId: organizationNationalId,
          },
        },
      })
    } catch (error) {
      throw new Error(
        `Error creating submit URL: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  const [deleteUrl] = useMutation(DELETE_ORGANIZATION_URL)

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl({
        variables: { input: { id } },
      })
      setSubmitUrls((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      throw new Error(
        `Error deleting submit URL: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  return (
    <>
      <Box display="flex" alignItems="center" marginBottom={1} columnGap={6}>
        <Button
          size="small"
          variant="utility"
          onClick={() => createSubmitUrl(false, UrlMethods.SEND_NUDGE)}
        >
          {formatMessage(m.addProdUrl)}
        </Button>
        <Box marginTop={2}>
          <ToggleSwitchButton
            label="Zendesk málakerfið"
            checked={submitUrls.some(
              (url) => url.method === UrlMethods.SEND_TO_ZENDESK && !url.isTest,
            )}
            onChange={function (checked: boolean): void {
              if (checked) {
                createSubmitUrl(false, UrlMethods.SEND_TO_ZENDESK)
              } else {
                const zendeskUrl = submitUrls.find(
                  (url) =>
                    url.method === UrlMethods.SEND_TO_ZENDESK && !url.isTest,
                )
                if (zendeskUrl?.id) {
                  handleDelete(zendeskUrl.id)
                }
              }
            }}
          />
        </Box>
      </Box>
      <TableHeader text={formatMessage(m.prodUrl)} />
      {submitUrls &&
        submitUrls
          .filter((url) => !url.isTest)
          .map((url) => (
            <TableRow
              key={url.id}
              submitUrl={url}
              handleDelete={handleDelete}
            />
          ))}

      <Box
        display="flex"
        alignItems="center"
        marginBottom={1}
        marginTop={20}
        columnGap={6}
      >
        <Button
          size="small"
          variant="utility"
          onClick={() => createSubmitUrl(true, UrlMethods.SEND_NUDGE)}
        >
          {formatMessage(m.addDevUrl)}
        </Button>
        <Box marginTop={2}>
          <ToggleSwitchButton
            label="Zendesk málakerfið"
            checked={submitUrls.some(
              (url) => url.method === UrlMethods.SEND_TO_ZENDESK && url.isTest,
            )}
            onChange={function (checked: boolean): void {
              if (checked) {
                createSubmitUrl(true, UrlMethods.SEND_TO_ZENDESK)
              } else {
                const zendeskUrl = submitUrls.find(
                  (url) =>
                    url.method === UrlMethods.SEND_TO_ZENDESK && url.isTest,
                )
                if (zendeskUrl?.id) {
                  handleDelete(zendeskUrl.id)
                }
              }
            }}
          />
        </Box>
      </Box>
      <TableHeader text={formatMessage(m.devUrl)} />
      {submitUrls &&
        submitUrls
          .filter((url) => url.isTest)
          .map((url) => (
            <TableRow
              key={url.id}
              submitUrl={url}
              handleDelete={handleDelete}
            />
          ))}
    </>
  )
}
