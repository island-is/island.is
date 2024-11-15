import { createBffUrlGenerator } from '@island.is/react-spa/bff'
import { ServicePortalPaths } from '../lib/navigation/paths'

export const formSubmit = async (url: string, annual?: boolean) => {
  const bffUrlGenerator = createBffUrlGenerator(ServicePortalPaths.Base)
  const bffUrl = bffUrlGenerator('/api', {
    url,
  })

  // Create form elements
  const form = document.createElement('form')
  const tokenInput = document.createElement('input')

  form.appendChild(tokenInput)

  // Form values
  form.method = 'post'
  form.action = bffUrl
  form.target = '_blank'

  if (annual) {
    // Optional param
    const annualInput = document.createElement('input')
    form.appendChild(annualInput)
    annualInput.type = 'hidden'
    annualInput.name = 'annualDoc'
    annualInput.value = 'true'
  }

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
