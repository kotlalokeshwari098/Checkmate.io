// alert("helloo")
const socket=io()
// connect to backend
const chess=new Chess()

socket.emit("w")
// sending to backend the biryani

socket.on("w",()=>{
    //  all receving from backend
    console.log("You are white")
})

socket.emit("b")

socket.on("b",()=>{
    //  all receving from backend
    console.log("You are black")
})