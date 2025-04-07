import csv
import os
import pandas as pd
import time
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import mean_absolute_error,mean_squared_error
from sklearn.preprocessing import LabelEncoder
import json
    

def getData():
    import requests
    from bs4 import BeautifulSoup
    
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

def linearRegression():
    df = pd.read_csv("data.csv")
    
    labelencoder = LabelEncoder()
    df['Player'] = labelencoder.fit_transform(df['Player'])
    
    stats = df.drop("VBD", axis=1).values
    VBD = df['VBD'].values
    VBD = VBD/np.max(VBD)

    
    X_train,X_test,y_train,y_test = train_test_split(stats,
                                                 VBD,
                                                 test_size=0.2,
                                                 random_state=42)
    
    normalizer = StandardScaler()
    X_train = normalizer.fit_transform(X_train)
    X_test = normalizer.transform(X_test)
    
    # linear regression
    
    lr = LinearRegression()
    lr.fit(X_train,y_train)

    y_train_pred = lr.predict(X_train)
    
    y_test_pred = lr.predict(X_test)

    mae = mean_absolute_error(y_test_pred,y_test)
    mse = mean_squared_error(y_test_pred,y_test)
    rmse = np.sqrt(mse)
    
    # ridge - no difference, not overfitting    
    
    # ridge2 = Ridge(alpha=0.5) # medium alpha
    # ridge2.fit(X_train, y_train) # fit it for the training set
    
    # thingToPredict_test_2 = ridge2.predict(X_test)
    # mae2 = mean_absolute_error(thingToPredict_test_2, y_test)
    # mse2 = mean_squared_error(thingToPredict_test_2, y_test)
    # rmse2 = np.sqrt(mse2)

    # print('prediction for testing set:')
    # # print('MAE is: {}'.format(mae2))
    # # print('MSE is: {}'.format(mse2))
    # # print('RMSE is: {}'.format(rmse2))
    
    # print('MAE is: {}'.format(mae))
    # print('MSE is: {}'.format(mse))
    # print('RMSE is: {}'.format(rmse))
    
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
        
linearRegression()