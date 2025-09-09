import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Divider,
  Box,
  DropdownMenu,
  Button,
  Icon,
} from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TranslationTag } from '../../../TranslationTag/TranslationTag'
import { FormSystemPaths } from '../../../../lib/paths'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { FormSystemForm } from '@island.is/api/schema'
import { useMutation } from '@apollo/client'
import { DELETE_FORM, PUBLISH_FORM } from '@island.is/form-system/graphql'
import { FormStatus } from '@island.is/form-system/enums'

interface Props {
  id?: string | null
  name?: string
  created?: Date
  lastModified?: Date
  org?: string | null
  state?: number
  options?: string
  isHeader: boolean
  translated?: boolean
  slug?: string
  beenPublished?: boolean
  setFormsState: Dispatch<SetStateAction<FormSystemForm[]>>
  status?: string
}

const PATH = `https://beta.dev01.devland.is/form`

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
  org,
  state,
  translated,
  setFormsState,
  slug,
  status,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { formatMessage, formatDate } = useIntl()
  const [deleteForm] = useMutation(DELETE_FORM)
  const [publishForm] = useMutation(PUBLISH_FORM)

  const dropdownItems = useMemo(() => {
    const copy = {
      title: formatMessage(m.copy),
    }

    const json = {
      title: 'Json',
    }

    const del = {
      title: formatMessage(m.delete),
      onClick: async () => {
        try {
          await deleteForm({
            variables: { input: { id } },
          })
          setFormsState((prevForms) =>
            prevForms.filter((form) => form.id !== id),
          )
        } catch (error) {
          console.error('Error deleting form:', error)
        }
      },
    }

    const publish = {
      title: formatMessage(m.publish),
      onClick: async () => {
        try {
          await publishForm({
            variables: { input: { id } },
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

    const unPublish = {
      title: formatMessage(m.unpublish),
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

    const items = [copy, json, del]

    if (status === FormStatus.PUBLISHED) {
      items.push(unPublish)
    } else {
      items.push(publish)
    }

    items.push(test)

    return items
  }, [id, slug, status, formatMessage, deleteForm, publishForm, setFormsState])

  const goToForm = () => {
    navigate(FormSystemPaths.Form.replace(':formId', String(id)), {
      state: {
        id,
      },
    })
  }
  return (
    <Box
      paddingTop={2}
      paddingBottom={1}
      onClick={() => setIsOpen(!isOpen)}
      style={{ cursor: '' }}
    >
      <Row key={id}>
        <Column span="5/12">
          <ColumnText text={name ? name : ''} />
        </Column>
        <Column span="2/12">
          <ColumnText
            text={formatDate(lastModified ? lastModified : new Date(), {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            })}
          />
        </Column>
        <Column span="1/12">
          <Box display="flex">
            <TranslationTag translated={translated ? translated : false} />
          </Box>
        </Column>
        <Column span="2/12">
          <ColumnText text={status ?? ''} />
        </Column>
        <Column span="1/12">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box marginRight={1} onClick={goToForm} cursor="pointer">
              <Icon icon="pencil" color="blue400" type="filled" />
            </Box>
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
        </Column>
      </Row>
      <Divider />
    </Box>
  )
}
