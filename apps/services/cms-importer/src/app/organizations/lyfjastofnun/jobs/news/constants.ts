export const NEWS_CONTENT_TYPE = 'news'

// Default number of posts per run when `--limit` is not given. This is a
// default, not a ceiling — a historical backfill passes a larger `--limit`.
export const IMPORT_LIMIT = 10

// Default window in months when `--months` is not given.
export const IMPORT_MONTHS_BACK = 12

/*
  Fallback imagery for posts that carry no image of their own, replacing the
  local image bank the first version of this job read off disk. Most
  lyfjastofnun.is posts have no inline image at all (319 of the 414 published
  in the last three years), and the `news` content type requires one, so
  without these the majority of a backfill would be skipped outright.

  Hardcoded rather than looked up at runtime: querying by owner tag would
  quietly absorb any future Lyfjastofnun image upload into the rotation,
  including ones never intended as generic article imagery. Keeping the set
  explicit means it only changes when someone changes it here, in a reviewable
  diff.

  These assets are referenced, never re-uploaded. Note they must be published
  in Contentful before any article referencing them is published — the delivery
  API only serves published assets, so an article pointing at a draft asset
  renders with no image.
*/
export const SEED_IMAGE_ASSET_IDS = [
  '2TS4GJXWdbMUvobFI6lzPd', // Stafraen_stofnun 2.png
  '3KnTBANbS676HVa84nvkYt', // Stafraen_stofnun 6.png
  'kQrHMmTtYO27vpH727jof', // Stafraen_stofnun_7.png
  '5Unrf9xK7ddeljiyzYrIB4', // Straumlinulogud stofnun 3.png
  'WGVBlm2lKez5TZkz3qL0F', // botox.jpg
  '55fFN9cdkYd5lgN6vPxKbK', // jonustukonnun-allir-tenglar.png
  '3NKMMZeO5IJZt1E3dxWyrJ', // kona_i_tolvu_md.jpg
  '3TQcDbKJkC4UN0rHOLMkfH', // kona_med_lyfjaglas.jpg
  '2GLuhF9OxiKdINinpkWJir', // laeknir-tekur-blodsyni.jpg
  '7GUcUoRPI1aTGCc45MUJNM', // lyf_4.jpg
  '3ixekdnu5LJJXA4mxk46Ty', // lyfjaspjald.jpg
  'Jmq2eouatpZ6qMLaHKPx8', // lyfjaspjald_2.jpg
  '15OvQ06jLVUtKtPaJ9W4Kh', // lyfjastofnun_ui.png
  '1HVw2vceYA5IIMeqZnX479', // skodun.jpg
  '3oORoUU7GE7peQbEuImHYp', // skra_lyf.jpg
  '117loKFtUgqIb7xQqYhKJE', // skrifa_blad_lg.jpg
  '6m4GsFLPWhunTc465eH92Q', // sprauta_2.jpg
  '1CN1qVpYOrb5goaXBsdfAb', // taka_lyf.jpg
  '4ilT2Vc2vrrkcTekEniOF1', // taka_lyf_2.jpg
  '3UeSCIwZrEVJbxOJ2WlBJd', // taka_lyf_3.jpg
  'lk8sZPRqe2ZEWCbh4g5Yv', // tom_lyfjaspjold.jpg
] as const
