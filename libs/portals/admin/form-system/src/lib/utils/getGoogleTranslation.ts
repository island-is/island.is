// import { GET_GOOGLE_TRANSLATION } from '@island.is/form-system/graphql'
// import { FormSystemGoogleTranslation } from '@island.is/api/schema'

// export const getGoogleTranslation = async (q: string) => {
//   try {
//     const { data } = await apolloClient.query({
//       query: GET_GOOGLE_TRANSLATION,
//       variables: {
//         input: {
//           key: process.env.FORM_SYSTEM_GOOGLE_TRANSLATION_API_KEY,
//           q,
//           source: 'is', // Icelandic to English
//           target: 'en',
//         },
//       },
//     })

//     // Adjust this line based on your actual GraphQL response structure
//     return data?.googleTranslation?.translatedText ?? ''
//   } catch (err) {
//     console.error('Error occurred while getting google translation:', err)
//     throw err
//   }
// }
