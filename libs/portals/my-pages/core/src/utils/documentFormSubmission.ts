import { createBffUrlGenerator } from '@island.is/react-spa/bff'

export const formSubmit = async (url: string) => {
  const bffUrlGenerator = createBffUrlGenerator()
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

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
