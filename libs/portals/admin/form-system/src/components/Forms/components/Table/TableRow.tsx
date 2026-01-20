import { useMutation } from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { FormStatus } from '@island.is/form-system/enums'
import { COPY_FORM, UPDATE_FORM_STATUS } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  GridColumn as Column,
  DialogPrompt,
  Divider,
  DropdownMenu,
  GridRow as Row,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../../../lib/paths'
import { StatusTag } from '../../../StatusTag/StatusTag'

interface Props {
  id?: string | null
  name?: string
  created?: Date
  lastModified?: Date
  options?: string
  isHeader: boolean
  translated?: boolean
  slug?: string
  beenPublished?: boolean
  setFormsState: Dispatch<SetStateAction<FormSystemForm[]>>
  status?: string
  url?: string
}

const PATH =
  process.env.NODE_ENV === 'development'
    ? `https://beta.dev01.devland.is/form`
    : 'https://island.is/form'

interface ColumnTextProps {
  text: string | number
}

const ColumnText = ({ text }: ColumnTextProps) => (
  <Box width="full" textAlign="left" paddingLeft={1}>
    <Text variant="medium">{text}</Text>
  </Box>
)

export const TableRow = ({
  id,
  name,
  lastModified,
  setFormsState,
  slug,
  status,
  url,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { formatMessage, formatDate } = useIntl()
  const [updateFormStatus] = useMutation(UPDATE_FORM_STATUS)
  const [copyForm] = useMutation(COPY_FORM)

  const handleToggle = () => setIsOpen((prev) => !prev)

  const dropdownItems = useMemo(() => {
    const copy = {
      title: formatMessage(m.copy),
      onClick: async () => {
        try {
          const { data } = await copyForm({
            variables: {
              input: {
                id,
              },
            },
          })
          setFormsState((prevForms) => {
            const returnedForm = data.copyFormSystemForm.form
            return [returnedForm, ...prevForms]
          })
        } catch (error) {
          // TODO: Add user-facing error notification
        }
      },
    }

    const changePublishedForm = {
      title: formatMessage(m.edit),
      onClick: async () => {
        try {
          const { data } = await updateFormStatus({
            variables: {
              input: {
                id,
                updateFormStatusDto: {
                  newStatus: FormStatus.PUBLISHED_BEING_CHANGED,
                },
              },
            },
          })
          setFormsState((prevForms) => {
            const returnedForm = data.updateFormSystemFormStatus.form
            return [returnedForm, ...prevForms]
          })
        } catch (error) {
          console.error('Error publishing form:', error)
        }
      },
    }

    const publish = {
      title: formatMessage(m.publish),
      onClick: async () => {
        try {
          await updateFormStatus({
            variables: {
              input: {
                id,
                updateFormStatusDto: { newStatus: FormStatus.PUBLISHED },
              },
            },
          })
          setFormsState((prevForms) =>
            prevForms.map((form) =>
              form.id === id ? { ...form, status: FormStatus.PUBLISHED } : form,
            ),
          )
        } catch (error) {
          console.error('Error publishing form:', error)
        }
      },
    }

    const publishChanged = {
      title: formatMessage(m.publish),
      onClick: async () => {
        try {
          const { data } = await updateFormStatus({
            variables: {
              input: {
                id,
                updateFormStatusDto: { newStatus: FormStatus.PUBLISHED },
              },
            },
          })
          setFormsState((prevForms) => {
            const returnedForm = data.updateFormSystemFormStatus.form
            const publishedSlug = returnedForm?.slug?.replace(
              /-archived-\d+$/,
              '',
            )

            return prevForms
              .map((form) =>
                form.id === id
                  ? {
                      ...form,
                      status: FormStatus.PUBLISHED,
                      slug:
                        slug === publishedSlug + '-i-breytingu'
                          ? publishedSlug
                          : slug,
                    }
                  : form,
              )
              .filter((form) => form.id !== returnedForm.id)
          })
        } catch (error) {
          console.error('Error publishing form:', error)
        }
      },
    }

    const test = {
      title: formatMessage(m.tryOut),
      onClick: () => {
        if (slug) {
          window.open(`${PATH}/${slug}`, '_blank', 'noopener,noreferrer')
        } else {
          window.alert(
            formatMessage({
              id: 'slugMissing',
              defaultMessage: 'Það vantar slug',
            }),
          )
        }
      },
    }

    const del = {
      title: formatMessage(m.delete),
      render: () => (
        <DialogPrompt
          title={
            status === FormStatus.PUBLISHED
              ? formatMessage(m.unpublish)
              : formatMessage(m.delete)
          }
          baseId={`delete-form-${id}`}
          ariaLabel={`delete-form-${id}`}
          description={
            status === FormStatus.PUBLISHED
              ? formatMessage(m.unpublishFormWarning, { formName: name })
              : formatMessage(m.deleteFormWarning, { formName: name })
          }
          disclosureElement={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              paddingY={2}
              cursor="pointer"
            >
              <Text variant="eyebrow" color="red600">
                {status === FormStatus.PUBLISHED
                  ? formatMessage(m.unpublish)
                  : formatMessage(m.delete)}
              </Text>
            </Box>
          }
          buttonTextCancel={formatMessage(m.cancel)}
          buttonTextConfirm={
            status === FormStatus.PUBLISHED
              ? formatMessage(m.unpublish)
              : formatMessage(m.delete)
          }
          onConfirm={async () => {
            try {
              const { data } = await updateFormStatus({
                variables: {
                  input: {
                    id,
                    updateFormStatusDto: { newStatus: FormStatus.ARCHIVED },
                  },
                },
              })
              setFormsState((prevForms) => {
                const filtered = prevForms.filter((form) => form.id !== id)
                const returnedForm = data.updateFormSystemFormStatus.form
                return returnedForm ? [returnedForm, ...filtered] : filtered
              })
            } catch (error) {
              console.error('Error deleting form:', error)
            }
          }}
        />
      ),
    }

    if (status === FormStatus.PUBLISHED) {
      return [changePublishedForm, copy, del]
    } else if (status === FormStatus.PUBLISHED_BEING_CHANGED) {
      return [test, publishChanged, del]
    }

    return [test, copy, publish, del]
  }, [
    id,
    slug,
    status,
    formatMessage,
    updateFormStatus,
    copyForm,
    setFormsState,
    name,
  ])

  const updateForm = async (currentStatus: string) => {
    try {
      const { data } = await updateFormStatus({
        variables: {
          input: {
            id,
            updateFormStatusDto: {
              newStatus: currentStatus,
            },
          },
        },
      })
    } catch (error) {
      console.error('Error updating form:', error)
    }

    navigate(FormSystemPaths.Form.replace(':formId', String(id)), {
      state: {
        id,
      },
    })
  }

  return (
    <Box
      paddingTop={2}
      onClick={handleToggle}
      role="button"
      aria-expanded={isOpen}
      tabIndex={0}
      style={{
        cursor: 'pointer',
        border: isOpen ? '1px solid #E5E7EB' : 'none',
        borderRadius: isOpen ? '1px' : 'none',
      }}
    >
      <Row key={id}>
        <Column span="7/12">
          <ColumnText text={name ? name : ''} />
        </Column>
        <Column span="2/12">
          <Box display="flex" justifyContent="flexEnd">
            <Text variant="medium">
              {formatDate(lastModified ? lastModified : new Date(), {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </Text>
          </Box>
        </Column>

        <Column span="2/12">
          <Box display="flex" justifyContent="center">
            <StatusTag status={status ?? ''} />
          </Box>
        </Column>

        <Column span="1/12">
          <Box display="flex" justifyContent="flexEnd" alignItems="center">
            {(status === FormStatus.IN_DEVELOPMENT ||
              status === FormStatus.PUBLISHED_BEING_CHANGED) && (
              <Box
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Button
                  icon="pencil"
                  circle
                  colorScheme="negative"
                  inline
                  onClick={() => updateForm(status)}
                />
              </Box>
            )}
            <Box marginRight={2} onClick={(e) => e.stopPropagation()}>
              <DropdownMenu
                menuLabel={`${formatMessage(m.actions)} ${name}`}
                disclosure={
                  <Button
                    icon="ellipsisVertical"
                    circle
                    colorScheme="negative"
                    title={formatMessage(m.actions)}
                    inline
                    aria-label={`Aðgerðir`}
                  />
                }
                items={dropdownItems}
              />
            </Box>
          </Box>
        </Column>
      </Row>

      {isOpen && (
        <Box paddingTop={1} paddingBottom={2} paddingLeft={1}>
          <Stack space={1}>
            <Row>
              <Column span="12/12">
                <Text variant="medium">
                  <strong>Slug:</strong> {slug}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column span="12/12">
                <Text variant="medium">
                  <strong>Url:</strong> {url}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column span="12/12">
                <Text variant="medium">
                  <strong>Id:</strong> {id}
                </Text>
              </Column>
            </Row>
          </Stack>
        </Box>
      )}

      <Divider />
    </Box>
  )
}
