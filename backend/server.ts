import { cardName, checkDraw, checkWin, distributeHand, drawTwo, getTurn, passTurn, pickCard, playCard, shuffleDeck, updateCycle } from "./HelperFunctions";

const { Socket } = require( "socket.io");
const express = require("express");
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require('cors')




/*            VARIABLES USED BY SERVER!           */


//array of cards
const cards : string[] = [
    '0R', '1R', '1R', '2R', '2R', '3R', '3R', '4R', '4R', '5R', '5R', '6R', '6R', '7R', '7R', '8R', '8R', '9R', '9R', 'sR', 'sR', 'rR', 'rR', 'dR', 'dR',
    '0G', '1G', '1G', '2G', '2G', '3G', '3G', '4G', '4G', '5G', '5G', '6G', '6G', '7G', '7G', '8G', '8G', '9G', '9G', 'sG', 'sG', 'rG', 'rG', 'dG', 'dG',
    '0B', '1B', '1B', '2B', '2B', '3B', '3B', '4B', '4B', '5B', '5B', '6B', '6B', '7B', '7B', '8B', '8B', '9B', '9B', 'sB', 'sB', 'rB', 'rB', 'dB', 'dB',
    '0Y', '1Y', '1Y', '2Y', '2Y', '3Y', '3Y', '4Y', '4Y', '5Y', '5Y', '6Y', '6Y', '7Y', '7Y', '8Y', '8Y', '9Y', '9Y', 'sY', 'sY', 'rY', 'rY', 'dY', 'dY',
    '4W', '4W', '4W', '4W', 'W', 'W', 'W', 'W'
];


//shuffle the cards
let shuffled : string[] = shuffleDeck(cards)      //uses a helper function to re-organize 'cards' array to mimic deck shuffling


//holds player info
const playerNames :string[] = []; //holds player names
let totalPlayers : number = 0;  //number of players joined


//holds turn info
let turn : number = 0;      //var determining which player's turn it is (increment each time, and using %4 find index of player who's turn it is)
let turnOrder : boolean = true;     //determines turn order. true means clockwise, false means anticlockwise!


//gets top burn card
let topCard : string = shuffled[0];  //holds the top card on the burn stack
shuffled.pop(); //removes card from deck


let didPickCard : boolean = false;





/*            COMMUNICATING WITH CLIENTS AND HANDLING EVENTS           */


app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})

server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
})



//holds all events handled by server!
io.on("connection",(socket:any)=>{

    console.log("user connected with a socket id", socket.id)   //reference
    //add custom events here


    //handle's new users joining!
    socket.on("newUser",(data:string)=>{    //done (if time, handle for when >4 users join)!
        totalPlayers += 1;


        // if(totalPlayers>4){
        //     socket.disconnet();
        // }

        playerNames.push(data);

        if(totalPlayers===4){   //if 4 users joined, return true to allow entering gamestate
            console.log(`No of Players: ${totalPlayers}`);  //just for my own use
            console.log(`player names: ${playerNames}`);    //for my own use
            console.log("starting game!");
            io.emit("user_joined", {check: "true"});
        }
    })


    //distributes initial 7 card hand to each player.
    socket.on('request_hand', ()=>{ //done

        console.log('Player requested for starting hand');   //updates on server end

        let hand : string[] = distributeHand(shuffled);     //get hand from shuffled deck!
        const msg : string = `Game Started! ${playerNames[0]} goes first!`;      //create starting message!
        const turnPlayer : string = playerNames[0];     //name of player who goes first!

        socket.emit('get_hand', {hand, topCard, playerNames, msg, turnPlayer});     //sends info back only to user who requested a hand (sends them their hand, the burn card, player names, and starting msg)

    })



    //when player chooses to pick a card from deck (update player's hand, and send msg to all)
    socket.on('pick_card', (data : any)=>{  //done!!

        const newHand : string[] = pickCard(shuffled, data.hand);       //uses helper function to take card from deck, and add to hand
        let msg : string = `${data.name} picked card from deck! Still ${data.name}'s turn`;   //creates update message
        let draw : boolean = checkDraw(shuffled);       //checks if there's a draw (deck finished)
        didPickCard = true;

        //in the case where deck is finished and it's a draw
        if(draw){
            console.log('Game Over! Result: Draw');
            msg = 'Deck is Finished....GAME IS OVER. RESULT: DRAW';
            io.emit('game_result', {draw});
        }

        socket.emit('updated_hand', {newHand, didPickCard});
        console.log(`${data.name} picked a card`);   //for reference 
        io.emit('new_msg', {msg});          //sends updated game msg to everyone!

    })


    //when player plays card => update top burn card, update player's hand, send msg to all, and update turn (also handles draw 2 and 4)
    socket.on('play_card', (data : any)=>{

        turn = getTurn(data.card, turnOrder, turn); //update turn (gives index of player who's turn it is);
        turnOrder = updateCycle(data.card, turnOrder);      //updates order of play (in case skip card played!);

        let turnPlayer : string = playerNames[turn];  //stores name of player who's turn it is!

        const newHand : string[] = playCard(data.hand, data.card);  //get's updated hand for player!
        const cardLabel : string = cardName(data.card);     //get name of card to add to msg    
        let msg : string = `${data.name} played card: ${cardLabel} !   Next turn: ${playerNames[turn]}`   //creates msg to transmit
        const newTopCard : string = data.card;      //updates topmost card in discard/burn pile


        console.log(`${data.name} played a ${data.card}`);  //to keep track on terminal end!
        // console.log(`TURN NO:  ${turn}`);

        const didWin : boolean = checkWin(newHand);        //checks if player has won or not!

        if(didWin){
            msg = `GAME OVER!   WINNER : ${data.name}`;
            io.emit('game_result', {didWin});
            turnPlayer = 'BillCosbybro';
            console.log(msg);
        }

        didPickCard = false;

        socket.emit('updated_hand', {newHand, didPickCard});     //sends updates hand back to player who made move
        io.emit('new_msg', {msg});          //sends msg of gamestate to everyone
        io.emit('new_topcard', {newTopCard});       //updates topmost card on burn/discard pile for everyone
        io.emit('turn_update', {turnPlayer});       //tells who's turn it is to everyone

    })

    //handle's case when turn is being passed!
    socket.on('pass_turn', (data:any)=>{
        turn = passTurn(turnOrder, turn); //update turn (gives index of player who's turn it is);
        const turnPlayer : string = playerNames[turn];

        const msg : string = `${data.name} skipped their turn! Next turn: ${turnPlayer}`;
        didPickCard = false;

        socket.emit('turn_passed', {didPickCard});

        io.emit('new_msg', {msg});
        io.emit('turn_update', {turnPlayer});

        console.log(msg);
    })
    
})
