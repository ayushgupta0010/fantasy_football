const fs = require('node:fs')

export default function Stats(){
    const data = fs.readFileSync('public/data.csv', 'utf8').split("\n");

    return(
        <div>
            {data.map(player => <p key={player}>{player}</p>)}
        </div>
    )
}