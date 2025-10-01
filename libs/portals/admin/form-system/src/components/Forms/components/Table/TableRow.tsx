import { useMutation } from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { FormStatus } from '@island.is/form-system/enums'
import { DELETE_FORM, PUBLISH_FORM } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  GridColumn as Column,
  DialogPrompt,
  Divider,
  DropdownMenu,
  Icon,
  GridRow as Row,
  Text,
} from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../../../lib/paths'
import { TranslationTag } from '../../../TranslationTag/TranslationTag'

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

    const del = {
      title: formatMessage(m.delete),
      render: () => (
        <DialogPrompt
          title={formatMessage(m.delete)}
          baseId={`delete-form-${id}`}
          ariaLabel={`delete-form-${id}`}
          description={formatMessage(m.deleteFormWarning, { formName: name })}
          disclosureElement={
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              paddingY={2}
              cursor="pointer"
            >
              <Text variant="eyebrow" color="red600">
                {formatMessage(m.delete)}
              </Text>
            </Box>
          }
          buttonTextCancel={formatMessage(m.cancel)}
          buttonTextConfirm={formatMessage(m.delete)}
        />
      ),
    }

    const publishUnpublish =
      status === FormStatus.PUBLISHED ? unPublish : publish

    return [copy, json, test, publishUnpublish, del]
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
