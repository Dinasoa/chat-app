import {useRouter} from "next/router";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import {useMessageStore} from "@/stores/message-store";
import styles from "@/styles/Chat.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faMessage, faSearch} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {ChangeEvent, useEffect, useState} from "react";

const DirectMessage = () => {
    const router = useRouter()
    const {id} = router.query;
    const {user} = useAuthStore();
    // const userJSON = localStorage.getItem('user');
    // const parseUser = JSON.parse(userJSON);
    // const token = parseUser?.token;
    const token = user?.token
    const { messages, message, setMessage, setMessages} = useMessageStore();
    const [users, setUsers] = useState<>([]);

    const deconnect = () => {
        localStorage.removeItem("userInfo");
        router.push("/login")
    }

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const response = await api.get('/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("All users: ", response.data);
                console.log("Users: " , response.data.users)
                setUsers(response.data.users);
            } catch (error) {
                console.log("BEARER: ", token);
                console.log("ERROR: ", error);
            }
        };
        getAllUsers();
    }, [])

    useEffect(() => {
        const getDirectMessage = async () => {
            try{
                const responses = await api.get(`/messages/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setMessages(responses.data);
                console.log("messages: ", responses.data)
            } catch (error) {
                alert(error)
            }
        }
        getDirectMessage()
    }, [])


    const saveMessage = (event:ChangeEvent<HTMLInputElement>) => {
        const message = {
            "channelId": null,
            "recipientId": id,
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

            const allMessages = await api.get(`/messages/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
            })
                setMessages(allMessages.data)
                console.log("Message sent: ", messagesToCreate.data)
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
                            {
                                users.map((user) => {
                                     if(user.id == id){
                                         return <p>{user.name}</p>
                                     }
                                })
                            }
                        </div>
                    </aside>

                    <main className={styles.chat}>

                        <div >

                            {
                                messages?.messages?.length >= 1 ?
                                    <div className={styles.chatHistory}>

                                        {
                                            messages?.messages?.map(message =>
                                                <p>
                                                    {message.sender.name}:
                                                    {message.content}
                                                </p>
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

export default DirectMessage;