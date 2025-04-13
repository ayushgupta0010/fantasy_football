import csv
import os
import time
import requests
from bs4 import BeautifulSoup
import json
    

def getData():  
    info = {}
    
    year = 2004
    while year <= 2024:
        info[year] = {}
        request = requests.get(f"https://www.pro-football-reference.com/years/{year}/fantasy.htm")
        text = request.text
        soup = BeautifulSoup(text, "html.parser")
        rows = soup.find_all("tr")
        
        for rowHTML in rows:
            tds = rowHTML.find_all("td")
            if len(tds) > 30:
                info[year][tds[0].find("a").text] = {"VBD": tds[-3].text if tds[-3].text != "" else 0, "Passing Yds": tds[8].text, 
                                                     "Passing Tds": tds[9].text, "Rushing Yds": tds[12].text, "Rushing Tds": tds[14].text,
                                                     "Receiving Yds": tds[15].text, "Receiving Tds": tds[19].text}
        
        print(f"Done year {year}")
        year += 1
    with open("data2.json", 'w') as file:
        json.dump(info, file, indent=4)
    print(info)

    
def convertJSONToCSV():
    with open("data2.json", 'r') as file:
        data = json.load(file)
        
    allData = "Player,Season,Passing Yds,Passing Tds,Rushing Yds,Rushing Tds,Receiving Yds,Receiving Tds,VBD\n"
    
    for year in data:
        for player in data[year]:
            playerInfo = data[year][player]
            
            for key in playerInfo:
                if playerInfo[key] == '':
                    playerInfo[key] = 0
                    
            allData += f"{player},{year},{playerInfo['Passing Yds']},{playerInfo['Passing Tds']},{playerInfo['Rushing Yds']},{playerInfo['Rushing Tds']},{playerInfo['Receiving Yds']},{playerInfo['Receiving Tds']},{playerInfo['VBD']}\n"
    
    with open("data.csv", "w") as csvfile:
        csvfile.write(allData)