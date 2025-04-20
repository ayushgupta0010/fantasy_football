import json

with open("player_scores.csv", 'r') as file:
    data = file.readlines()
    
dataJSON = {}
for person in data[1:]:
    p = person.split(",")
    p[-1] = p[-1].removesuffix("\n")
    
    p[1] = float(p[1])
    if p[1] < 0: p[1] = 0
    p[2] = float(p[2])
    if p[2] < 0: p[2] = 0
    p[3] = float(p[3])
    if p[3] < 0: p[3] = 0
    p[4] = float(p[4])
    if p[4] < 0: p[4] = 0
    p[5] = float(p[5])
    if p[5] < 0: p[5] = 0
    
    dataJSON[p[0]] = p[1:]
    
with open('predictions.json', 'w') as file:
    json.dump(dataJSON, file, indent=4)