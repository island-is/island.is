#!/bin/bash

owners=($(cat .github/CODEOWNERS | egrep '^\/[a-zA-Z\/]+' | xargs -0 echo))

echo "${owners[@]}"

files=($(git diff --name-only origin/main))

for i in "${files[@]}"
do
  x=$(echo "/${i}")
  for j in "${owners[@]}"
  do
    # echo "${x}|||||||${j}"
    # echo "'$j' '$x'"
    if [[ $x =~ $j ]]; then
      echo "found ${i} ${j}"
      break
    fi
  done
done
