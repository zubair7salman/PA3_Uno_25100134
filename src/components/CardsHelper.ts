//      HELPER FUNCTIONS!

//helper function for displaying relevant card color
export const getColor = (card : string) : string => {
    
    if(card==='W'){
        return 'white';
    }

    let color : string = card[1];

    if(color==='R'){
        return 'red';
    }
    else if(color==='G'){
        return 'mediumseagreen';
    }
    else if(color==='B'){
        return 'dodgerblue';
    }
    else if(color==='Y'){
        return 'yellow';
    }
    else if(color==='W'){
        return 'white';
    }

    return 'orange';

}

//helper function to display relevant card type/value
export const cardVal = (card:string) : string => {
    
    if(card==='4W'){
        return '+4';
    }
    else if(card==='W'){
        return 'W';
    }
    else if(card[0]==='s'){
        return 'S';
    }
    else if(card[0]==='r'){
        return 'R';
    }
    else if(card[0]==='d'){
        return 'D';
    }


    return card[0];

}

//helper function to compare card being played with top burn card to see if move is legal or not
export const cardPlayable = (playCard : string, topCard : string) : boolean => {
    
    if(playCard === '4W' || topCard==='4W'){      //if a +4 wild card, it can be played regardless
        return true;
    }
    else if(playCard === 'W' || topCard==='W'){    //if wild card, anything can be played!
        return true;
    }
    else if (playCard[0] === topCard[0]){   //if card is same type
        return true;
    }
    else if(playCard[1] === topCard[1]){    //if card is same color
        return true;
    }
    
    //in any other case
    return false;
}

//for when 2 cards needed to be drawn into hand
export const drawTwo = (hand : string[], drawn : string[]) => {
    let l : number = drawn.length;
    let newHand : string[] = hand;

    for(let x=0; x<l; x++){
        newHand.push(drawn[x]);
    }

    return newHand;
}

//check if picked card is playable or not!
export const checkPickedCard = (hand : string[], top : string) => {
    let l : number = hand.length;

    return cardPlayable(hand[l-1], top);
}