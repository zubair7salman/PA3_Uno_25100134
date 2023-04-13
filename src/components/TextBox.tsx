import './Templates/uno.css'

interface TextProps{
    text : string
}


//handles ui for TextBox holding Game updates! 
const TextBox = ({text}:TextProps) => {     //done!

    //textbod doesn't directly communicate to server. Just receives msg's from GamePage as prop, and displays it.

    console.log(`textbox: ${text}`);    //for my own reference!

    return ( 
        <div className="message-box">
            <div className="message-content-container">
                {text}
            </div>
        </div>
     );
}
 
export default TextBox;