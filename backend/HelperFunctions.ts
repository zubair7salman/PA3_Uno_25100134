//Helper functions


//shuffles deck!
export const shuffleDeck = (arr: string[])=> {   //i used the Fisher-Yates algorithm (discovered online)      
    
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}


//takes 7 cards from top of deck as the initial hand of a player, so it can send this to players
export const distributeHand = (arr: string[]) => {

    //replicates picking card from top of shuffled deck (via the pop function)

    const hand : string[] = [];     //hand variable
    let length : number = 0;

    for(let x=0; x<7; x++){     //loops over first 7 indexes

        length = arr.length;

        hand.push(arr[length-1]);  //adds card to hand 
        arr.pop();      //removes card from deck

    }
    return hand;

}


//for when player chooses to pick card from deck! (take card from shuffled deck, and remove it)
export const pickCard = (arr: string[], hand: string[]) => {

    const l : number = arr.length;

    let card : string = arr[l-1];
    arr.pop();

    
    hand.push(card);    //add this picked card to the hand
    return hand;

}


//updates players hand by removing card they played!
export const playCard = (hand : string[], card : string) => {

    let cardIndex : number = hand.indexOf(card);
    let updatedHand : string[] = hand.filter((c, ind) => ind !== cardIndex);

    return updatedHand;
}


//below 3 functions help in displaying message for card. (they tell which card and color it is!)
const cardColor = (col : string) => {
    if(col==='R'){
        return 'red';
    }
    else if(col==='B'){
        return 'blue';
    }
    else if(col==='G'){
        return 'green';
    }
    else if(col==='Y'){
        return 'yellow';
    }
    return '';
}

const cardType = (t : string) => {
    if(t==='s'){
        return 'skip';
    }
    else if(t==='d'){
        return 'draw';
    }
    else if(t==='r'){
        return 'reverse';
    }
    else {
        return t;
    }
    return '';
}

export const cardName = (card: string) => {

    let color : string = '';
    let type : string = '';

    if(card==='4W'){
        return '+4 Wild';
    }
    else if(card==='W'){
        return 'Wild';
    }
    
    color = cardColor(card[1]);
    type = cardType(card[0]);

    let name : string = color + ' ' + type;

    return name;
}


//3 helper functions to update turn cycle and relevant variables! (handles cases of skip too!)
export const getTurn = (card:string, cycle:boolean, turnsPlayed:number) : number => {   //done  

    if(card==='W'){
        return turnsPlayed;
    }

    if(cycle){
        if(card[0]==='s' || card==='4W'){
            turnsPlayed+=2;
        }
        else if(card[0]==='r'){
            turnsPlayed-=1;
        }
        else{
            turnsPlayed+=1;
        }
    }
    else{
        if(card[0]==='s' || card==='4W'){
            turnsPlayed-=2;
        }
        else if(card[0]==='r'){
            turnsPlayed+=1;
        }
        else{
            turnsPlayed-=1;
        }
    }

    if(turnsPlayed>=4){
        turnsPlayed -= 4;
    }
    else if(turnsPlayed<0){
        turnsPlayed += 4;
    }

    return turnsPlayed;

}

export const updateCycle = (card : string, cycle : boolean) => {
    if(card[0]==='r'){
        return !cycle;
    }
    else{
        return cycle;
    }
}

export const passTurn = (cycle:boolean, turnsPlayed : number) => {
    if(cycle){
        
        turnsPlayed+=1;

    }
    else{

        turnsPlayed-=1;

    }

    if(turnsPlayed>=4){
        turnsPlayed -= 4;
    }
    else if(turnsPlayed<0){
        turnsPlayed += 4;
    }

    return turnsPlayed;
}


//helper function to check if deck is finished. If yes, it is a draw
export const checkDraw = (deck : string[]) => {
    if(deck.length === 0){
        return true;
    }
    else{
        return false;
    }
}


//helper to check if player has won or not (checks if hand is 0)
export const checkWin = (hand : string[]) => {
    if(hand.length === 0){
        return true;
    }
    else{
        return false;
    }
}

export const drawTwo = (arr: string[], hand : string[]) => {     //try handling for when deck finished!

    const l : number = arr.length;

    hand.push(arr[l-1]);
    hand.push(arr[l-2]);
    arr.pop();
    arr.pop();

    return hand;

}