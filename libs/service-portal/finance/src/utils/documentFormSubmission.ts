export const formSubmit = (url: string, token: string) => {
  // Create form elements
  const form = document.createElement('form')
  // const documentIdInput = document.createElement('input')
  const tokenInput = document.createElement('input')

  // form.appendChild(documentIdInput)
  form.appendChild(tokenInput)

  // Form values
  form.method = 'post'
  // TODO: Use correct url
  form.action = url
  form.target = '_blank'

  // National Id values
  tokenInput.type = 'hidden'
  tokenInput.name = '__accessToken'
  tokenInput.value = token

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
