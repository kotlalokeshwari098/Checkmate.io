import express from 'express'
import { Socket } from 'socket.io'
import http from 'http'
import { Chess } from 'chess.js'

const app=express();

const server=http.createServer(app);
const io=Socket(server);

const chess=new Chess()





app.listen(5656,()=>console.log('listening on port 5656'))