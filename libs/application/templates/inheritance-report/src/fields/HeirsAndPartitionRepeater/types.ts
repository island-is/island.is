export type HeirsAndPartitionRepeaterProps = {
  field: {
    props: {
      repeaterButtonText: string
      sumField: string
      customFields: {
        sectionTitle?: string
        title: string
        id: string
        readOnly: true
        currency: true
      }[]
    }
  }
}
