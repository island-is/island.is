import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

import * as styles from './TinyMCE.css'

interface Props {
  label: string
}

const TinyMCE = ({ label }: Props) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <Editor
        apiKey={process.env.TINY_MCE_API_KEY}
        init={{
          plugins: 'lists',
          toolbar: 'bold italic | indent outdent | hilitecolor',
          toolbar_mode: 'wrap',
          menubar: false,
          content_style:
            "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;1,300&display=swap'); body { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 300; }",
          branding: false,
          statusbar: false,
          placeholder: 'Start typing...',
        }}
        initialValue=""
        onEditorChange={(content) => console.log(content)}
      />
    </div>
  )
}

export default TinyMCE
