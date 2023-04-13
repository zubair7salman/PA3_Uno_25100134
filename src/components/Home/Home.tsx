import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import './Home.css'
import { useEffect ,useState } from "react";
import { useNavigate } from "react-router-dom";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    nameChange: React.Dispatch<React.SetStateAction<string>>  //name of user
    //you can always add more functions/objects that you would like as props for this component
}


function HomePage({socket, nameChange}:HomePageProps){

    const navigate = useNavigate(); //allows navigating to gameplay page when users join
    const [join, setJoin] = useState(false);    //helps determine whether to show home or loading screen
    const [userN, setUserN] = useState('');     //allows for name to be changed


    let numRedirect : number = 0;


    //listens for server msg! redirects to gamepage!
    useEffect(()=>{
        socket.on("user_joined", (data:any)=>{

            if(numRedirect===0){
                if(data.check === "true"){
                    navigate('gamepage');
                }
            }
    
            numRedirect += 1;
        })
    },[socket])


    //click handler
    const handleClick = (socket: Socket) => {
        // Do something with the socket object, such as emit an event

        console.log(userN);
        socket.emit('newUser', userN);
        setJoin(true);
    };

    //handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserN(e.target.value);
        nameChange(e.target.value);
    }


    //to print home screen
    const home = () => {
        return(
            <>
            <div className="sampleHomePage">
                <h1 className="sampleTitle">Uno</h1>
                <div className="sampleMessage">
                <input  placeholder = "Enter Name" onChange={handleChange}></input>
                <button  onClick={() => handleClick(socket)}>Join Game</button>
                </div>
            </div>
            </>
        )
    }


    //to print loading screen
    const loading = () => {
        return(
            <>
            <div className="sampleHomePage">
                <h1 className="sampleTitle">Loading...</h1>
                <br/>
                <br/>
                <br/>
                <h3 className="sampleLoad"> waiting for other users </h3>
                <br/>
                <br/>
                <br/>
                <h6 className="sampleLoad"> {`(don't reload page!)`} </h6>
            </div>
            </>
        )
    }



    
    //uses conditional to print loading or home screen
    return(
        <>
        <div>
            {join ? loading() : home()}
        </div>
        </>
    )

}
export default HomePage