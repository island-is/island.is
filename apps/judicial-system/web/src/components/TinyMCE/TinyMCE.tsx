import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function App() {
  return (
    <Editor
      apiKey={process.env.TINY_MCE_API_KEY}
      init={{
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        branding: false,
        statusbar: false,
        placeholder: 'Start typing...',
      }}
      initialValue=""
      onEditorChange={(content) => console.log(content)}
    />
  )
}
