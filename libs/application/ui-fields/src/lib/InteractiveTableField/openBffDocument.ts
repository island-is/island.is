import { createBffUrlGenerator } from '@island.is/react-spa/bff'

export const openBffDocument = (url: string) => {
  const bffUrl = createBffUrlGenerator()('/api', { url })

  const form = document.createElement('form')
  form.method = 'post'
  form.action = bffUrl
  form.target = '_blank'

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
