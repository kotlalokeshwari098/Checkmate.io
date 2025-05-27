import express from 'express'
import { Server } from 'socket.io'; 
import http from 'http'
import path from 'path'
import { Chess } from 'chess.js'
import { fileURLToPath} from 'url';
import { dirname } from 'path'

const app=express();

const __filename=fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

const server=http.createServer(app);
const io = new Server(server);

const chess=new Chess()

let players={}
let currentPlayer="W";

app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))

app.get('/',(req,res)=>{
    res.render("index", {title:"Chess Game"})
})

// socket is unique info we get here
io.on("connection",(socket)=>{
      console.log("Connected")
        
    if(!players.white){
        players.white=socket.id;
        socket.emit("playerRole","w")
    }
    else if(!players.black){
        players.black=socket.id;
        socket.emit("player","b")
    }
    else{
        socket.emit("spectatorRole")
    }
    // console.log(players)

    socket.on("disconnect",()=>{
         if(socket.id===players.white){
            delete players.white;
         }
         else if(socket.id===players.black){
            delete players.black;
         }
    })
    socket.on("move",(move)=>{
        try{
            if(chess.turn()==='w' && socket.id!==players.white) return ;
            if(chess.turn()==='b' && socket.id!==players.black) return ;

            const result=chess.move(move)
            // validate the move of the player
            if(result){
                currentPlayer=chess.turn();
                io.emit("move" , move )
                io.emit("boardState",chess.fen())
            }
            else{
                console.log("something went wrong Invalid move",move);
                socket.emit("Invalid move",move);
            }
        }catch(err){
            socket.emit("Invalid move", move)
            console.log(err.message)
        }
    })
})


server.listen(5656,()=>console.log('listening on port 5656'))