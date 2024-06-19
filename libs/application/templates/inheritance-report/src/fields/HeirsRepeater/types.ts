export type HeirsAndPartitionRepeaterProps = {
  field: {
    props: {
      repeaterButtonText: string
      sumField: string
      customFields: {
        title: string
        id: string
        readOnly: true
        currency: true
      }[]
    }
  }
}
