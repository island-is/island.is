// took this from https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-265.php
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  )

const chunkSize = parseInt(process.env['CHUNK_SIZE'] || '2')
process.stdout.write(
  JSON.stringify(
    chunk(
      process.argv[2].split(',').map((s) => s.trim()),
      chunkSize,
    ).map((a) => a.join(',')),
  ),
)
