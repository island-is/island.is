import { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/client'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import { Select, Spinner, TextInput } from '@contentful/f36-components'
import { useCMA, useSDK } from '@contentful/react-apps-toolkit'

const GET_CHARGE_ITEM_CODES = gql`
  query getChargeItemCodesByCourseId(
    $input: GetChargeItemCodesByCourseIdInput!
  ) {
    getChargeItemCodesByCourseId(input: $input) {
      items {
        code
        name
      }
    }
  }
`

const CourseInstanceChargeItemCodeField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const cma = useCMA()
  const [value, setValue] = useState(sdk.field.getValue() ?? '')
  const [loading, setLoading] = useState(true)

  const [fetchChargeItemCodes, { data }] = useLazyQuery(GET_CHARGE_ITEM_CODES, {
    onCompleted: () => setLoading(false),
    onError: () => setLoading(false),
  })

  // Find the parent course that links to this course instance
  useEffect(() => {
    const entryId = sdk.entry.getSys().id
    cma.entry
      .getMany({
        query: {
          content_type: 'course',
          links_to_entry: entryId,
          limit: 1,
        },
      })
      .then((response) => {
        const id = response.items[0]?.sys.id
        if (id)
          fetchChargeItemCodes({
            variables: { input: { courseId: id } },
          })
        else setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [cma.entry, fetchChargeItemCodes, sdk.entry])

  const chargeItemCodes = data?.getChargeItemCodesByCourseId?.items ?? []

  return (
    <>
      {!loading && !data?.getChargeItemCodesByCourseId?.items.length && (
        <TextInput value={value} onChange={(e) => setValue(e.target.value)} />
      )}
      {!loading && Boolean(data?.getChargeItemCodesByCourseId?.items.length) && (
        <Select
          value={value}
          onChange={(e) => {
            const newValue = e.target.value
            setValue(newValue)
            sdk.field.setValue(newValue)
          }}
        >
          <Select.Option value="">
            No charge item code selected (course is free)
          </Select.Option>
          {chargeItemCodes.map((item: { code: string; name: string }) => (
            <Select.Option key={item.code} value={item.code}>
              ({item.code}) {item.name}
            </Select.Option>
          ))}
        </Select>
      )}
      {loading && <Spinner />}
    </>
  )
}

export default CourseInstanceChargeItemCodeField
