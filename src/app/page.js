'use client'
import Model from "./components/model";
import players from "../../public/players";
import predictions from "../../public/predictions.json";
import React, {useState} from 'react';

function addToTeam(team, setTeam){
  if(team.length == 9){
    alert("Team cannot exceed 9 Players")
    return
  }
  let player = document.getElementById("playerForm").value
  document.getElementById("playerForm").value = ""
  if (player == ''){
    alert("Please input a player!")
    return
  }
  if (!players.players.includes(player)){
    alert(`${player} is not a valid football player. Please choose from the list!`)
    return
  }

  if (team.includes(player)){
    alert(`Player ${player} is already member ${team.indexOf(player) + 1 } in your team!`)
    return
  }
  setTeam(team => [...team, player])
}

function removePlayer(player, setTeam){
  setTeam(team => team.filter((item) => item != player))
}

function toggleModel(model, setModel, setActive, active){
  if (!active){
    setModel(models => [...models, model])
    setActive(true)
  }
  else{
    setModel(models => models.filter((item) => item != model))
    setActive(false)
  }
}

function showResults(team, models, results, setResults, modelLookup){
  let modelsIndex = []
  let playerResults = []
  let r = []
  models.forEach(element => {
    modelsIndex.push(modelLookup.indexOf(element))
  });
  let playerPreds = null;
  setResults([])

  for (let player of team){
    playerResults = [player]
    playerPreds = predictions[player]

    for (let modelIndex of modelsIndex){
      playerResults.push(playerPreds[modelIndex])
    }
    
    r.push(playerResults)
  }
  setResults(r)

  let cumVBDHTML = document.getElementById("cumulativeVBD")
  let cumVBDs = []

  for(let k = 1; k < r[0].length; k++){
    cumVBDs[k - 1] = 0
  }

  for(let i = 0; i < r.length; i++){
    for(let j = 1; j < r[0].length; j++){
      cumVBDs[j - 1] += r[i][j]
    }
  }

  for(let i = 0; i < cumVBDs.length; i++){
    cumVBDs[i] = Math.round(cumVBDs[i] * 100) / 100
  }

  cumVBDHTML.innerHTML = ''

  let label = document.createElement("td")
  label.innerHTML = "Team Score"

  cumVBDHTML.append(label)

  let sum = 0
  for(let vbd of cumVBDs){
    let td = document.createElement("td")
    td.key = sum
    td.innerHTML = vbd
    cumVBDHTML.append(td)
    sum += vbd
  }
  let avg = sum / cumVBDs.length
  avg = Math.round(avg * 100) / 100
  document.getElementById("average").innerHTML = avg
}

export default function Home() {
  var modelColors = [[143,176,126], [29,111,179]]
  let modelLookup = ['Linear Regression', 'Random Trees', 'XG Boost', 'MLP', 'Bayesian Linear Regression']
  const [team, setTeam] = useState([])
  const [models, setModels] = useState([])
  const [results, setResults] = useState([])
  return (
    <div className="items-center justify-items-center">

      <div className="flex flex-col items-center absolute w-15 h-5 mt-2">
        <img className="h-20 w-30" src="..\..\bird.png"></img>
        <p className="text-tiny">go birds!</p>
      </div>

      <div className="absolute w-15 h-5 top-0 right-0">
        <img src="https://img.pokemondb.net/sprites/platinum/normal/tyranitar.png" alt="Tyranitar sponsors this project"/>
      </div>

      <div className="text-center p-5">
        <h1 className="text-8xl text-align font-bold p-5 text-shadow-lg">
          Fantasy Football Predictions
        </h1>
        <h2 className="font-bold text-5xl pt-2.5 text-shadow-lg">
          Ayush Gupta & Nathan Cherny
        </h2>

        <div className="m-0 mt-15 grid grid-cols-2 justify-evenly border-1 backdrop-brightness-125 items-center">
          <a href="/stats" target="_blank">Stats</a>
          <a href="/data" target="_blank">Predictions</a>
        </div>
      </div>

      <hr className="w-11/12 m-15 border-2"/>

      <div className="flex w-11/12 flex-col border-1 backdrop-brightness-125 items-center mb-15">

        <div className="flex m-15 border-1 flex-wrap flex-row p-10 w-11/12 justify-evenly">
          <Model name="Linear Regression" color={modelColors[0]} toggle={toggleModel} setModel={setModels}/>
          <Model name="Random Trees" color={modelColors[1]} toggle={toggleModel} setModel={setModels}/>
          <Model name="XG Boost" color={modelColors[0]} toggle={toggleModel} setModel={setModels}/>
          <Model name="MLP" color={modelColors[1]} toggle={toggleModel} setModel={setModels}/>
          <Model name="Bayesian Linear Regression" color={modelColors[0]} toggle={toggleModel} setModel={setModels}/>
        </div>

        <div className="flex flex-row items-center justify-around w-11/12 m-15 p-10 border-1">
          <div className="flex h-20">
            <datalist id="players">
              {players.players.map(player => <option key={player}>{player}</option>)}
            </datalist>
            <input id="playerForm" placeholder="Enter A Player Here" className="text-3xl p-5 bg-gray-800 border-black border-3 mt-10 mb-10" type="text" autoComplete="on" list="players"/> 
            <button onClick={() => addToTeam(team, setTeam)} className="text-3xl leading-0 p-5 bg-green-800 border-black border-3 mt-10 mb-10 cursor-pointer hover:brightness-85 duration-150">Add</button>
            <button onClick={() => setTeam([])} className="text-3xl leading-0 p-5 bg-red-800 border-black border-3 mt-10 mb-10 cursor-pointer hover:brightness-85 duration-150">Reset</button>
          </div>

          <div className="flex flex-col items-center max-h-50 h-50 w-11/12 ml-15">
            <h1 className="font-bold text-5xl pt-2.5 mb-5">Team</h1>
            <div className="flex flex-col text-left flex-wrap w-full min-h-10 content-center">
              {team.map(player => <p onClick={() => removePlayer(player, setTeam)} className="player" key={team.indexOf(player)}>{player}</p>)}
            </div>
          </div>
        </div>
          
        <button onClick={() => showResults(team, models, results, setResults, modelLookup)} className="runButton text-3xl leading-0 p-5 bg-red-800 border-black border-3 mt-10 mb-10 w-3/4 cursor-pointer hover:brightness-85 duration-150">Run</button>

      </div>

      <div className="flex w-11/12 flex-col border-1 backdrop-brightness-125 p-5 mb-10 items-center text-4xl">
        <table className="table-auto border-spacing-x-2.5">
          {/* <caption className="caption-top mb-5">
            Predictions
          </caption> */}
          <thead>
            <tr>
              <th className="border-b-2 border-zinc-500">Player</th>
              {models.map(model => <th className="border-b-2 border-zinc-500" key={model}>{model}</th>)}
            </tr>
          </thead>
          <tbody>
            {results.map(result => <tr key={`${result}-person`}>{result.map((data, i) => <td key={`${data}-num-${i}`}>{data}</td>)}</tr>)}
            <tr id="cumulativeVBD"></tr>
          </tbody>
        </table>
        <p className="text-center mt-5 text-gray-300 text-2xl">Average Team Score: <span id="average" className="text-yellow-300 font-bold"></span></p>
      </div>

    </div>


  );
}
