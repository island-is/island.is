export const signatureConfig = {
  plugins: [],
  menu: {},
  forced_root_block: 'signature basic',
  toolbar: `
    undo redo | bold italic link inlineformat | styleselect alignment | bullist numlist`,
  style_formats: [
    {
      title: 'Undirskrift',
      block: 'p',
      attributes: { class: 'signature basic', style: '' },
    },
    {
      title: 'Tvöföld undirskrift',
      block: 'p',
      attributes: { class: 'signature double', style: '' },
    },
    {
      title: 'Undirskrift nefndar',
      block: 'p',
      attributes: { class: 'signature committee', style: '' },
    },
  ],
}
