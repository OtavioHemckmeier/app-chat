import React, {useEffect, useState} from 'react';
import io from "socket.io-client";
import axios from "axios";

import Messages from "./Messages";

const socket = io(`http://localhost:8080/api/socket`);

const fetchMessages = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/messages/getMessages`);

        return response.data.messages
    } catch (error) {
        console.log("Error with fetching thoughts: ", error);
        alert(
            "Ocorreu um erro ao buscar as mensagems"
        );
    }
};

const addMessage = async (doc) => {
    try {
        await axios.post(`http://localhost:5000/api/messages/addMessage`, doc);
    } catch (error) {
        console.log("Error with fetching thoughts: ", error);
        alert(
            "Ocorreu um erro ao adicionar a mensagem"
        );
    }
};

const App = () => {
    const [sessionId, setSessionId] = useState("")
    const [userName, setUserName] = useState("")
    const [sessionUser, setSessionUser] = useState(false)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])

    const createUser = (event) => {
        event.preventDefault()
        setSessionUser({name: userName, id: sessionId})

        setTimeout(function (){
            const objDiv = document.getElementById("containerMessages");
            objDiv.scrollTop = objDiv.scrollHeight;
        }, 500)
        fetchMessages().then(m => setMessages(m.sort(function(a,b) {
            return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
        })))
    }

    const sendMessage = (event) => {
        event.preventDefault()
        const dataMessage = {
            user: sessionUser,
            message,
        }

        setMessage("")
        addMessage(dataMessage)
    }

    useEffect(function () {
        socket.on("newConnection", (id) => {
            setSessionId(id);
            setSessionUser(false)
        });
    }, [])

    useEffect(function () {
        const addMessageInList = (newMessage) => {

            setTimeout(function (){
                const objDiv = document.getElementById("containerMessages");
                objDiv.scrollTop = objDiv.scrollHeight;
            })

            setMessages([...messages, newMessage].sort(function(a,b) {
                return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
            }));
        }

        socket.on("newMessage", addMessageInList)
        return () => socket.off("newMessage", addMessageInList)
    }, [messages])

    return (
        <div className="App">
            <header className="App-header">
                {!sessionUser ?
                    <>
                        <form id="createUser" onSubmit={createUser}>
                            <label>Insira seu nome: </label>
                            <input type="text" name="userName" onChange={(event) => setUserName(event.target.value)}/>
                            <button type="submit">Salvar</button>
                        </form>
                    </> :
                    <>
                        Olá <b>{sessionUser.name}</b>
                        <form id="sendMessage" onSubmit={sendMessage}>
                            <label>Enviar mensagem: </label>
                            <input value={message} type="text" name="msg"
                                   onChange={(event) => setMessage(event.target.value)}/>
                            <button type="submit">Enviar</button>
                        </form>
                        <hr/>
                        <div id={"containerMessages"} style={{overflowY: "auto", height:" 500px"}}>
                            {messages.map((m, i) => {
                                return <span key={i}>
                                <Messages data={m} sessionUser={sessionUser}/>
                            </span>
                            })}
                        </div>
                    </>
                }
            </header>
        </div>
    );
};

export default App;
