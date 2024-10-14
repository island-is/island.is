import { User } from '@island.is/auth/react'
import { ActiveDocumentType2 } from '../lib/types'

export const sendForm = async (id: string, url: string, userInfo: User) => {
  // Create form elements
  const form = document.createElement('form')
  const documentIdInput = document.createElement('input')
  const tokenInput = document.createElement('input')

  const token = userInfo?.access_token

  if (!token) return

  form.appendChild(documentIdInput)
  form.appendChild(tokenInput)

  // Form values
  form.method = 'post'
  form.action = url
  form.target = '_blank'

  // Document Id values
  documentIdInput.type = 'hidden'
  documentIdInput.name = 'documentId'
  documentIdInput.value = id

  // National Id values
  tokenInput.type = 'hidden'
  tokenInput.name = '__accessToken'
  tokenInput.value = token

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

export const downloadFile = async (
  doc: ActiveDocumentType2,
  userInfo: User,
) => {
  let html: string | undefined = undefined
  if (doc?.document.type === 'HTML') {
    html =
      doc.document.value && doc.document.value.length > 0
        ? doc?.document.value
        : undefined
  }
  if (html) {
    setTimeout(() => {
      const win = window.open('', '_blank')
      win && html && win.document.write(html)
      win?.focus()
    }, 250)
  } else {
    // Create form elements
    const form = document.createElement('form')
    const documentIdInput = document.createElement('input')
    const tokenInput = document.createElement('input')

    const token = userInfo?.access_token

    if (!token) return

    form.appendChild(documentIdInput)
    form.appendChild(tokenInput)

    // Form values
    form.method = 'post'
    form.action = doc?.downloadUrl ?? ''
    form.target = '_blank'

    // Document Id values
    documentIdInput.type = 'hidden'
    documentIdInput.name = 'documentId'
    documentIdInput.value = doc?.id ?? ''

    // National Id values
    tokenInput.type = 'hidden'
    tokenInput.name = '__accessToken'
    tokenInput.value = token

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }
}
