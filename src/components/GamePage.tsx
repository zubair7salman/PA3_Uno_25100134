import { useEffect, useState } from "react"
import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import './Templates/uno.css'
import Table from "./Table"
import TextBox from "./TextBox"
import CardBox from "./CardBox"


interface gamePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>  //socket
    name : string   //player's username
}

const GamePage = ({socket, name}:gamePageProps) => {


    /*       VARIABLES/STATES       */

    const [hand , setHand] = useState(['']);     //holds players hand (string[])
    const [topCard, setTopCard] = useState('');     //holds topmost burn card
    const [players, setPlayers] = useState(['']);       //holds player names (string[]);
    const [msg, setMsg] = useState('');         //holds message sent by user.
    const [turn, setTurn] = useState(false);        //determines if it is this user's turn or not!
    const [pickedCard, setPickedCard] = useState(false);    //determines whether a card was drawn from deck or not!
    const [gameState, setGameState] = useState(true);



    /*       INTERACTING WITH SERVER. EMITTING AND RECEIVING MESSAGES       */


    //send request for starting playing hand on initial render!
    let numCalls : number = 0;
    useEffect(()=>{ //done
        if(numCalls===0){
            socket.emit('request_hand');    //sends request for initial hand
        }
        numCalls +=1;

    },[]);


    //get initial hand of 7 cards, top card from burn deck, names of players, and starting msg
    let getinitial : number = 0;
    useEffect(()=>{ //done
        if(getinitial===0){
            socket.on('get_hand', ({hand, topCard, playerNames, msg, turnPlayer})=>{
                setHand(hand);
                setTopCard(topCard);
                setPlayers(playerNames);
                setMsg(msg);

                if(turnPlayer === name){
                    setTurn(true);
                }
            })
        }
        getinitial += 1;
    },[socket]);


    //get's update of who's turn it is!
    socket.on('turn_update', ({turnPlayer})=>{  //done
        if(turnPlayer===name){
            setTurn(true);
        }
        else{
            setTurn(false)
        }
    })

    //check's draw condition
    socket.on('game_result', ({result})=>{          //done
        if(result){
            setGameState(false);     //suspends game for all!
            setTurn(false);
        }
    })

    //player's hand is updated (either drew card or played one)
    socket.on('updated_hand', ({newHand, didPickCard})=>{        //done    
        setHand(newHand);
        setPickedCard(didPickCard);
    })

    //get's updates gameplay msg
    socket.on('new_msg', ({msg})=>{     //done
        setMsg(msg);
    })

    //get's updates top most card on burn/discard pile
    socket.on('new_topcard', ({newTopCard})=>{  //done
        setTopCard(newTopCard);
    })

    //for when turn is passed!
    socket.on('turn_passed', ({didPickCard})=>{ //done
        setPickedCard(didPickCard)
    })





    /*       DISPLAY       */

    //Table => manages UI component for table
    //TextBox => manages UI component for messages tab
    //CardBox => manages UI component for cards tab

    return ( 

            <div className="main-container">
        
                <div className="game-container">
                    <div className="game-table-container">
                        <Table card={topCard} players={players}/>
                    </div>
                </div>

                <div className="right-side-container">
                    <div className="messages-and-cards-container">

                        <div className="heading-container">
                            <h1>Game Updates!</h1>
                        </div>
                        
                        <div className="messages-container">
                            <TextBox text={msg}/>
                        </div>

                        <div className="heading-container">
                            <h1>{`${name}'s Cards!`}</h1>
                        </div>
                        <div className=".my-cards-container">
                            <div className="my-cards-inner-container">
                                <CardBox socket={socket} hand={hand} top={topCard} name={name} turn={turn} didPickCard={pickedCard} gameState={gameState}/>
                            </div>
                        </div>

                    </div>
                </div>
            
            </div>

    );
}

export default GamePage;