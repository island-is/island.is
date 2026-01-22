import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Box, Button, Text, TextInput } from '@contentful/f36-components'
import { DeleteIcon, PlusIcon } from '@contentful/f36-icons'
import { useSDK } from '@contentful/react-apps-toolkit'

const DEBOUNCE_TIME = 300

interface Contact {
  name?: string
  email?: string
  phone?: string
  jobTitle?: string
}

const VacancyContactsField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [contacts, setContacts] = useState<Contact[]>(
    sdk.field.getValue() ?? [],
  )

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  useDebounce(
    () => {
      sdk.field.setValue(contacts)
    },
    DEBOUNCE_TIME,
    [contacts],
  )

  return (
    <Box>
      <Box
        marginBottom="spacing2Xl"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button
          onClick={() => {
            const newValue = contacts.concat({ name: '', email: '', phone: '' })
            setContacts(newValue)
          }}
          startIcon={<PlusIcon />}
        >
          Add Contact
        </Button>
      </Box>
      <Box>
        {contacts.map((contact, index) => (
          <Box
            style={{
              padding: '16px',
              border: '1px solid #cfd9e0',
              borderRadius: '4px',
            }}
            marginBottom="spacing2Xl"
            key={index}
          >
            <Box
              marginBottom="spacingS"
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                onClick={() => {
                  setContacts((prevContacts) => {
                    return prevContacts.filter(
                      (_, prevIndex) => prevIndex !== index,
                    )
                  })
                }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Box>
            <Box
              style={{ display: 'flex', flexFlow: 'column nowrap', gap: '8px' }}
            >
              <Text>Name</Text>
              <TextInput
                value={contact.name}
                onChange={(ev) => {
                  setContacts((prevContacts) =>
                    prevContacts.map((prevContact, prevIndex) => {
                      if (prevIndex !== index) return prevContact
                      return {
                        ...prevContact,
                        name: ev.target.value,
                      }
                    }),
                  )
                }}
              />

              <Text>Job Title</Text>
              <TextInput
                value={contact.jobTitle}
                onChange={(ev) => {
                  setContacts((prevContacts) =>
                    prevContacts.map((prevContact, prevIndex) => {
                      if (prevIndex !== index) return prevContact
                      return {
                        ...prevContact,
                        jobTitle: ev.target.value,
                      }
                    }),
                  )
                }}
              />

              <Text>Email</Text>
              <TextInput
                value={contact.email}
                onChange={(ev) => {
                  setContacts((prevContacts) =>
                    prevContacts.map((prevContact, prevIndex) => {
                      if (prevIndex !== index) return prevContact
                      return {
                        ...prevContact,
                        email: ev.target.value,
                      }
                    }),
                  )
                }}
              />

              <Text>Phone</Text>
              <TextInput
                value={contact.phone}
                onChange={(ev) => {
                  setContacts((prevContacts) =>
                    prevContacts.map((prevContact, prevIndex) => {
                      if (prevIndex !== index) return prevContact
                      return {
                        ...prevContact,
                        phone: ev.target.value,
                      }
                    }),
                  )
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default VacancyContactsField
