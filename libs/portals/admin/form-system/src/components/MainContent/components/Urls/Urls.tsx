import { useContext } from 'react'
import { Box, Checkbox, GridColumn, GridRow } from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import { ControlContext } from '../../../../context/ControlContext'
import { useIntl } from 'react-intl'
import {
  CREATE_FORM_URL,
  DELETE_FORM_URL,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'

export const Urls = () => {
  const { control, submitUrls, setSelectedUrls, selectedUrls } =
    useContext(ControlContext)
  const { form } = control
  const { formatMessage } = useIntl()

  const [formSystemCreateFormUrlMutation] = useMutation(CREATE_FORM_URL, {
    onCompleted: (newUrlData) => {
      if (newUrlData?.createFormSystemFormUrl) {
        setSelectedUrls((prevUrls) => [
          ...prevUrls,
          newUrlData.createFormSystemFormUrl.organizationUrlId,
        ])
      }
    },
  })

  const handleCreateFormUrl = async (organizationUrlId: string) => {
    try {
      await formSystemCreateFormUrlMutation({
        variables: {
          input: {
            organizationUrlId,
            formId: form?.id,
          },
        },
      })
    } catch (error) {
      throw new Error(
        `Error creating form URL: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  const [deleteUrl] = useMutation(DELETE_FORM_URL)
  const handleDeleteFormUrl = async (organizationUrlId: string) => {
    try {
      await deleteUrl({
        variables: {
          input: {
            organizationUrlId,
            formId: form?.id,
          },
        },
      })
      setSelectedUrls((prevUrls) =>
        prevUrls.filter((url) => url !== organizationUrlId),
      )
    } catch (error) {
      throw new Error(
        `Error deleting form URL: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      )
    }
  }

  return (
    <GridRow>
      <GridColumn span="5/10">
        <Box marginTop={3}>
          <strong>{formatMessage(m.prodUrl)}</strong>
          {submitUrls &&
            submitUrls
              ?.filter((url) => !url?.isTest)
              .map((url) => (
                <Box
                  key={url?.id}
                  display="flex"
                  alignItems="center"
                  marginTop={1}
                >
                  <Checkbox
                    checked={selectedUrls?.some((u) => u === url?.id)}
                    onChange={(e) => {
                      if (typeof url?.id === 'string') {
                        if (e.target.checked) {
                          handleCreateFormUrl(url.id)
                        } else {
                          handleDeleteFormUrl(url.id)
                        }
                      }
                    }}
                    name={`prod-url-${url?.id}`}
                    label={url?.url}
                  />
                </Box>
              ))}
        </Box>
      </GridColumn>
      <GridColumn span="5/10">
        <Box marginTop={3}>
          <strong>{formatMessage(m.devUrl)}</strong>
          {submitUrls &&
            submitUrls
              ?.filter((url) => url?.isTest)
              .map((url) => (
                <Box
                  key={url?.id}
                  display="flex"
                  alignItems="center"
                  marginTop={1}
                >
                  <Checkbox
                    checked={selectedUrls?.some((u) => u === url?.id)}
                    onChange={(e) => {
                      if (typeof url?.id === 'string') {
                        if (e.target.checked) {
                          handleCreateFormUrl(url.id)
                        } else {
                          handleDeleteFormUrl(url.id)
                        }
                      }
                    }}
                    name={`test-url-${url?.id}`}
                    label={url?.url}
                  />
                </Box>
              ))}
        </Box>
      </GridColumn>
    </GridRow>
  )
}
