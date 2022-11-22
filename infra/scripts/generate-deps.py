import subprocess
import sys
import json
project = sys.argv[1]
result = subprocess.run(["depcheck", project], stdout=subprocess.PIPE, text=True)
out = result.stdout
split_string = out.split("*")
del split_string[0]
dependencies = []
for dependency in split_string:
    dependencies += dependency.strip(" ").split(":")[0::3]

packages = []

with open ("../../package.json") as f:
    data = json.load(f)
    for i in data['dependencies']:
        for dep in dependencies:
            if i.find(dep):
                print(i)
# TODO: FIX
#    lines = f.readlines()
#    for line in lines:
#        for i in dependencies:
#            if (line.find(i)):
#                packages.append(line)
#            
#print(set(packages))




