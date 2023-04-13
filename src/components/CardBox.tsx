import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import './Templates/uno.css'
import './Templates/uno-cards.css'
import { cardPlayable, cardVal, checkPickedCard, getColor } from "./CardsHelper";
import React from "react";



interface CBProp {
    socket : Socket<DefaultEventsMap, DefaultEventsMap>;
    hand : string[];
    top : string;
    name : string;
    turn : boolean;
    didPickCard : boolean
    gameState : boolean
}

const CardBox = ({socket, hand, top, name, turn, didPickCard, gameState}:CBProp) => {

  console.log(`cardbox: ${hand}`);

  //handles event when cards are picked from deck! (checks if it's players turn or not)
  const pickFromDeck = (e : React.MouseEvent) => {
    if(turn){
      if(!didPickCard){
        socket.emit('pick_card', {name, hand});
      }
      else{
        alert('Cannot pick card Continuously! Only pick one card per turn!');
      }
    }
    else{
      alert('Cannot pick card! Please wait for your turn!');
    }
  }

  //handles event when turn is passed after card picked up!
  const passTurn = () => {
    if(didPickCard){
      if(checkPickedCard(hand, top)){
        alert('Cannot skip turn! You must play the drawn card, since it matches card on discard pile!');
      }
      else{
        socket.emit('pass_turn', {name});
      }
    }
    else{
      alert('To pass turn, you must first pick a card!')
    }
  }

  //handles event when card is played! (checks if it's players turn and whether selected card is playable or not!)
  const playCard = (card : string) => {
    
    if(turn){
      if(cardPlayable(card, top)){
        console.log(`played ${card}`);  //for reference

        socket.emit('play_card', {name, hand, card});
      }
      else{
        alert('Cannot play card! Card needs to match color or value of burn card!');
      }
    }
    else{
      alert('Cannot play card! Please wait for your turn');
    }
  }

  //just helper funciton to make wildcard black
  const wildCard = (color : string) => {  
    if(color==='white'){
      return 'black'
    }
    return color
  }


  type Props = {
      cards: string[];
    };
  //to display hand in forms of buttons (uses mapping)
  const ButtonList: React.FC<Props> = ({ cards }) => {    
    return (
      <div>
        {cards.map((card) => (
          <button key={card} onClick={() => {playCard(card)}}>
            <div className={`card ${wildCard(getColor(card))}`} style={{color: getColor(card)}}>
                <span className="inner">
                <span className='mark'>{cardVal(card)}</span>
                </span>
            </div>
          </button>
        ))}
      </div>
    );
  };



  //final display  (doesn't display option to pick from deck or pass turn if game ended, or not players turn)
  return ( 
      <div>
          <ButtonList cards={hand}/>
          <br/>
          {turn&&gameState ? <button onClick={pickFromDeck}>Pick From Deck</button> : <div></div>}
          <br/>
          {turn&&gameState ? <button onClick={passTurn}>Pass Turn</button> : <div></div>}
      </div>
    );
}
 
export default CardBox;