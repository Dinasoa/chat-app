import {useRouter} from "next/router";
import {useAuthStore} from "@/stores/auth-store";
import {useMessageStore} from "@/stores/message-store";
import {ChangeEvent, useEffect, useState} from "react";
import {api} from "@/providers/api";
import styles from "@/styles/Chat.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMessage, faSearch} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export const ChannelMessage = () => {
    const router = useRouter()
    const {id} = router.query;
    const {user} = useAuthStore();
    const token = user?.token;
    const { messages, message, setMessage, setMessages} = useMessageStore();

    const deconnect = () => {
        localStorage.removeItem("userInfo");
        router.push("/login")
    }

    useEffect(() => {
        const getChannelMessage = async () => {
            try{
                const responses = await api.get(`/messages/channel/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setMessages(responses.data);
                console.log("Channel Message: ", responses.data)
            } catch(error){
                alert(error)
            }
        }
        if(id != undefined){
            getChannelMessage()
        }
    }, [])


    const saveMessage = (event:ChangeEvent<HTMLInputElement>) => {
        const message = {
            "channelId": id,
            "recipientId": null,
            "content": event.target.value
        }
        setMessage(message);
    }

    const sendMessage = async () => {
        console.log("Message to send: ", message)
        try{
            const messagesToCreate = await api.post("/message", message, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const allMessages = await api.get(`/messages/channel/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("CurrentChannelId: " ,id)
            setMessages(allMessages.data)
        } catch (error) {
            alert("There is an error. ")
        }
    }
    return (
        <>
            <div>
                {/*__NAVIGATION BAR__*/}
                <nav className={styles.navbar}>
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Rechercher..."/>
                        <button>
                            <FontAwesomeIcon
                                className={styles.icons}
                                icon={faSearch}
                                style={{width: 15, color: "black"}}
                            />
                        </button>

                        {user?.name}

                        <svg style={{width: 30}}  onClick={() => router.push("/profile")} xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icons}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>

                        <FontAwesomeIcon
                            icon={faMessage}
                            className={styles.icons}
                            style={{ width: 15, color: "black" }}
                            onClick={() => {router.push("/message")}}
                        />

                        <button
                            className={styles.logoutButton + " logoutButton"}
                            onClick={deconnect}>Logout
                        </button>
                    </div>
                </nav>

                {/*__SIDEBAR_NAVIGATION__ AND __CHAT_SECTION*/}
                <div className={styles.container}>
                    <aside className={styles.sidebar}>
                        <div>
                          {/*TODO: add the channel name here*/}
                        </div>
                    </aside>

                    <main className={styles.chat}>
                        <Link href={`/channel/edit/${id}`} >
                            <button className={styles.channelButton}> Edit current channel</button>
                        </Link>
                        <div >
                            {
                                messages?.messages?.length >= 1 ?
                                    <div className={styles.chatHistory}>

                                        {
                                            messages?.messages?.map(message =>
                                                <>
                                                    <li style={{fontWeight: "bold"}}>Envoyé le: {new Date(message.createdAt).toLocaleTimeString()}</li>
                                                    <p>
                                                        {message.sender.name}:
                                                        {message.content}
                                                    </p>
                                                </>
                                            )
                                        }
                                    </div>
                                    : <p>No message to display</p>
                            }
                        </div>

                        <div className={styles.chatInput}>
                            <textarea className={styles.textarea} type="text" name="message"
                                      placeholder="Type a message..." onChange={saveMessage}></textarea>
                            <button className={styles.sendMessageButton + " sendMessageButton"} onClick={sendMessage}>Send</button>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );

}

export default ChannelMessage;