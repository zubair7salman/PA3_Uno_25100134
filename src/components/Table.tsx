import './Templates/uno.css'
import './Templates/uno-cards.css'
import { cardVal, getColor } from './CardsHelper';

interface TableData {
    card : string;
    players : string[];
}


//handles ui for Table. Displays burn card, deck, and player tags
const Table = ({card, players}:TableData) => {  //done
    
    //doesn't communicate to server. Gets burn card and player names as props from GamePage and displays them

    const wildCard = (color : string) => {
       
        if(color==='white'){
          return 'black'
        }
        return color
    }
    
    //function to display players!
    const playersDisplay = () => {
        return (
            <div className="game-players-container">
                
                    <div className="player-tag player-three">
                        {players[2]}
                    </div>
                
                    <div className="player-tag player-two">
                        {players[3]}
                    </div>

                    <div className="player-tag player-four">
                        {players[1]}
                    </div>
                
                    <div className="player-tag player-one">
                        {players[0]}
                    </div>

            </div>
        );
    }
    

    //function to display deck and burn card!
    const cardDisplay = () => {     

        let cardColor : string = getColor(card);


        return(
            <div className='game-table-card-area'>
                <div>
                    <div className="card discard-pile black">
                        <span className="inner">
                         <span className="mark">U</span>
                        </span>
                    </div>
                    <div className={`card ${wildCard(cardColor)}`} style={{color: cardColor}}>
                        <span className='inner'>
                            <span className='mark'>{cardVal(card)}</span>
                        </span>
                        
                    </div>
                </div>
            </div>
        );
    }
    




    //final display!
    return ( 
        <div >
            <div className='heading-container'>
                <h1>UNO!</h1>
            </div>

                <div className='game-table'>

                    {playersDisplay()}
                    {cardDisplay()}
                    
                      
                </div>


        </div> 
    );
}
 
export default Table;