interface Category {
  id:
    | 'A'
    | 'AM'
    | 'A1'
    | 'A2'
    | 'B'
    | 'Ba'
    | 'BE'
    | 'Bff'
    | 'C'
    | 'CE'
    | 'Ca'
    | 'C1'
    | 'C1a'
    | 'C1E'
    | 'D'
    | 'DE'
    | 'D1'
    | 'Da'
    | 'D1a'
    | 'D1E'
    | 'T'

  color:
    | 'blue'
    | 'darkerBlue'
    | 'purple'
    | 'white'
    | 'red'
    | 'mint'
    | 'rose'
    | 'blueberry'
  name: string
}

export const mapCategory = (id: string): Category => {
  switch (id) {
    case 'A':
      return { id, color: 'rose', name: 'Bifhjól' }

    case 'AM':
      return { id, color: 'rose', name: 'Létt bifhjól' }

    case 'A1':
      return { id, color: 'rose', name: 'Bifhjól' }

    case 'A2':
      return { id, color: 'rose', name: 'Bifhjól' }

    case 'B':
      return { id, color: 'purple', name: 'Fólksbifreið' }

    case 'BE':
      return { id, color: 'purple', name: 'Fólksbifreið með eftirvagn' }

    case 'Ba':
      return { id, color: 'mint', name: 'Fólksbifreið í atvinnuskyni' }

    case 'Bff':
      return { id, color: 'mint', name: 'Leigubifreið' }

    case 'C':
      return { id, color: 'blue', name: 'Vörubifreið' }

    case 'CE':
      return { id, color: 'blue', name: 'Vörubifreið með eftirvagn' }

    case 'C1':
      return { id, color: 'blue', name: 'Lítil vörubifreið' }

    case 'C1E':
      return { id, color: 'blue', name: 'Lítil vörubifreið með eftirvagn' }

    case 'Ca':
      return { id, color: 'mint', name: 'Vörubifreið í atvinnuskyni' }

    case 'C1a':
      return { id, color: 'mint', name: 'Lítil vörubifreið í atvinnuskyni' }

    case 'D':
      return { id, color: 'red', name: 'Hópbifreið' }

    case 'DE':
      return { id, color: 'red', name: 'Hópbifreið með eftirvagn' }

    case 'D1':
      return { id, color: 'red', name: 'Lítil hópbifreið' }

    case 'D1E':
      return { id, color: 'red', name: 'Lítil hópbifreið með eftirvagn' }

    case 'Da':
      return { id, color: 'mint', name: 'Hópbifreið í atvinnuskyni' }

    case 'D1a':
      return { id, color: 'mint', name: 'Lítil hópbifreið í atvinnuskyni' }

    case 'T':
      return { id, color: 'blueberry', name: 'Dráttarvél' }

    default:
      return {
        id: id as Category['id'],
        color: 'white',
        name: id,
      }
  }
}
