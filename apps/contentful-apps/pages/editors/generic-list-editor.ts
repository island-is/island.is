import dynamic from 'next/dynamic'

export default dynamic(
  () => import('../../components/lists/GenericListEditor/GenericListEditor'),
  {
    // Dynamically exported with client side rendering since the @contentful/default-field-editors package accesses the window and navigator global objects
    ssr: false,
  },
)
