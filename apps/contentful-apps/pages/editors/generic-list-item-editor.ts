import dynamic from 'next/dynamic'

export default dynamic(
  () =>
    import(
      '../../components/lists/GenericListItemEditor/GenericListItemEditor'
    ),
  // Dynamically exported with client side rendering since the @contentful/default-field-editors package accesses window and navigator global objects
  { ssr: false },
)
