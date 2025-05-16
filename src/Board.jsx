import { useRef, useEffect, useState } from "react";
import Card from "./Card";

export default function Board() {
    const [ cards, setCards ] = useState([])
    let lastCard = null

    function buildCards() {
        let vetCards = []
        for(let i=0; i< 16; i=i+2) {
            let imgid = parseInt(Math.random()*100)
            vetCards.push({ id: i, imgid, isOpen: true })
            vetCards.push({ id: i+1, imgid, isOpen: true })
        }
        setCards(vetCards)
        setTimeout(() => {
            console.log("passou 5 segundos");            
            for(let i in vetCards) {
                vetCards[i].isOpen = false
            }
            setCards([...vetCards])
        },5000)
    }

    useEffect(() => {
        buildCards()
    },[])

    function onClick(elem) {
        console.log("onClick",elem);
        cards[elem.id].isOpen = !cards[elem.id].isOpen
        setCards([...cards])
    }

    return (
        <>
            <div className="m-2 border rounded p-2">
                <div>
                    <span>Tentativas:</span>
                    <span className="ml-2 text-xl font-bold">
                        0
                    </span>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-1 w-120">
                    {
                        cards.map((e, idx) => <Card imgid={e.imgid} id={e.id} key={idx} isOpen={e.isOpen} onClick={onClick} />)
                    }
                </div>
            </div>
        </>
    )
}