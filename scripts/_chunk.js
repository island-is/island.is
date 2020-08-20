// This a script that given a list of strings, returns a list of comma-separated chunks of the original list

// source: https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-265.php
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  )

// Chunk size
const chunkSize = parseInt(process.env['CHUNK_SIZE'] || '2')

let chunks = chunk(
  process.argv[2].split(',').map((s) => s.trim()),
  chunkSize,
)
  .map((ch) => ch.join(','))
  .filter((job) => job.length > 0)

if (chunks.length == 0) chunks = ['dummy']

process.stdout.write(JSON.stringify(chunks))
