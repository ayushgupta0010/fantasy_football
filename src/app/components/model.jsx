import {useState} from 'react'

export default function Model({name, color, toggle, setModel}){
    const [active, setActive] = useState(false)
    return (
        <div className={(active ? "modelActive " : "") + `border-3 border-solid border-black p-7.5 justify-center 
                        text-center content-center hover:brightness-85 cursor-pointer duration-150
                        shadow-2xl flex-1/5`} 
        style={{ backgroundColor: `rgb(${color})`}}
        onClick={() => toggle(name, setModel, setActive, active)}>
            <h1 className="text-3xl">{name}</h1>
        </div>
    )
}
