export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () =>
      resolve(reader.result.toString().replace('data:', '').replace(/^.+,/, ''))
    reader.onerror = (error) => reject(error)
  })
