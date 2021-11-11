export const formSubmit = (url: string, token: string, annual?: boolean) => {
  // Create form elements
  const form = document.createElement('form')
  const tokenInput = document.createElement('input')

  // form.appendChild(documentIdInput)
  form.appendChild(tokenInput)

  // Form values
  form.method = 'post'
  // TODO: Use correct url
  form.action = url
  form.target = '_blank'

  if (annual) {
    const annualInput = document.createElement('input')
    form.appendChild(annualInput)
    annualInput.type = 'hidden'
    annualInput.name = 'annualDoc'
    annualInput.value = 'true'
  }

  // National Id values
  tokenInput.type = 'hidden'
  tokenInput.name = '__accessToken'
  tokenInput.value = token

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
