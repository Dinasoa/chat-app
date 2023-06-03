import { useRouter } from "next/router";
import styles from "@/styles/Chat.module.css";
import {ChangeEvent, useEffect, useState} from "react";
import { api } from "@/providers/api";
import { useAuthStore } from "@/stores/auth-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser, faAdd, faClose, faLongArrowRight, faSearch} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import {Message} from "@/model/Message";
import {useMessageStore} from "@/stores/message-store";

const  Board = () =>  {
    const router = useRouter();
    const { user } = useAuthStore();
    const { messages, message, setMessage, setMessages} = useMessageStore();
    const [channels, setChannels] = useState([]);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [membersToAdd , setMembersToAdd] = useState([]);
    const token = user?.token;
    const [users, setUsers] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [currentChannelId, setCurrentChannelId] = useState<number>();
    const [recipientId, setRecipientId] = useState<number>();

    const deconnect = () => {
        localStorage.removeItem("userInfo");
        router.push("/SignIn");
    };

    const handleClick = () => {
        setShowCreateChannel(true);
        console.log(showCreateChannel);
    };

    const showAddMembersForm = () => {
        setShowAddMembers(true);
    }

    const getChannels = async () => {
        const token = user?.token;

        try {
            const response = await api.get('/channels', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("RESPONSE: ", response.data);
            setChannels(response.data.channels);
            router.push("/ChatHome");
        } catch (error) {
            console.log("BEARER: ", token);
            console.log("ERROR: ", error);
        }
    };

    useEffect(() => {
        getChannels();
        getAllUsers();
        console.log("Value of the show add members: " + showAddMembers)
    }, channels);

    const displayUser = () => {
        router.push("/About");
    };

    const undisplayUser = () => {
        setShowCreateChannel(false);
    };

    const createChannel = async (data) => {
        setShowCreateChannel(false);
        const token = user?.token;
        try {
            const response = await api.post('/channel', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("RESPONSE: ", response.data);
        } catch (error) {
            console.log("BEARER: ", token);
            console.log("ERROR: ", error); try{
            const responses = await api.get(`/messages/channel/${currentChannelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("Channel Message: ", responses.data)
        } catch(error){
            alert(error)
        }
        }
    };

    const getChannelById = async (channelId) => {
        try {
            const response = await api.get(`/channels/?channel_id=${channelId}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            setCurrentChannelId(channelId);
            console.log("Channel Id and its messages: ", response.data);
        } catch (error) {
            console.log("ERROR: ", error);
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await api.get('/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("All users: ", response.data);
            setUsers(response.data.users);
        } catch (error) {
            console.log("BEARER: ", token);
            console.log("ERROR: ", error);
        }
    };

    const undispalyUserModal = () => {
        setShowAddMembers(false)
    }

    const addMembersInChannel = async (data) => {
        setShowAddMembers(false);

        try{
            // TODO: ADD THE ENDPOINT TO ADD MEMBERS IN A CHANNEL
            // TODO: SEE THE REQUEST BODY OF THE ADD MEMBERS IN A CHANNEL REQUEST
            // DATA IS AN OBJECT CONTAINING LIST OF MEMBERS WE'D LIKE TO ADD IN THE CHANNEL
            // {"members":["6"]}
            const responses = await api.post("/channels/{channel_id}/members", data, {
                "headers": {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(responses);
        }catch(error){
            alert("Error from the request: " + error);
        }
    }

    const sendMessage = async () => {
        try{
            const responses = await api.post("/message", message, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Data: ", responses.data)
        } catch (error) {
            alert("There is an error. ")
        }
    }

    const saveMessage = (event:ChangeEvent<HTMLInputElement>) => {
        const message = {
            "channelId": currentChannelId,
            "recipientId": recipientId,
            "content": event.target.value
        }
        setMessage(message);
    }

    const getChannelMessage = async () => {
        try{
            const responses = await api.get(`/messages/channel/${currentChannelId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMessages(responses.data);
            console.log(messages)
            console.log("Channel Message: ", responses.data)
        } catch(error){
            alert(error)
        }
    }

    return (
        <>
            <div>
                {/*__NAVIGATION BAR__*/}
                <nav className={styles.navbar}>
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Rechercher..." />
                        <button>
                            <FontAwesomeIcon
                                className={styles.icons}
                                icon={faSearch}
                                style={{ width: 15, color: "black" }}
                            />
                        </button>

                        <svg style={{width:30}} onClick={displayUser} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icons}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>

                        <FontAwesomeIcon
                            icon={faLongArrowRight}
                            className={styles.icons}
                            style={{ width: 15, color: "black" }}
                            onClick={deconnect}
                        />

                    </div>

                </nav>

                {/*__SIDEBAR_NAVIGATION__ AND __CHAT_SECTION*/}
                <div className={styles.container}>
                    <aside className={styles.sidebar}>
                        <button className={styles.channelButton} onClick={handleClick}>
                            Create channel
                            <FontAwesomeIcon
                                icon={faAdd}
                                style={{ width: 10, color: "white" }}
                                onClick={displayUser}
                            />
                        </button>
                        <button className={styles.channelButton} onClick={showAddMembersForm}>
                            Add members
                            <FontAwesomeIcon
                                icon={faAdd}
                                style={{ width: 10, color: "white" }}
                            />
                        </button>
                        <ul>
                            {channels.map((channel) => (
                                <li className={styles.li} key={channel.id} onClick={() => {getChannelById(channel.id)}}>
                                    {channel.name}_{channel.id} #
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* TODO: Implement the chat logic (use FCM if possible) however use the existent request in the back-end. */}
                    <main className={styles.chat}>
                        {/* TODO: Put the messages exchanged in this section. */}
                        <div className={styles.chatHistory}>
                            {console.log("Les messages: ", messages)}
                            {messages.messages.map(message =>
                                <p>
                                    {message.sender.name}:
                                    {message.content}
                                </p>
                            )}
                        </div>
                        <div className={styles.chatInput}>
                            <input type="text" placeholder="Type a message..." onChange={saveMessage}/>
                            <button className={styles.button} onClick={sendMessage}>Send</button>
                            <button className={styles.button} onClick={getChannelMessage}>Channel Message</button>
                        </div>
                    </main>
                </div>
            </div>


            {showCreateChannel ?
                <div className={styles.createChannel}>
                    <label htmlFor="name" className={styles.label}>
                        Name
                    </label>
                    <input
                        className={styles.input}
                        id="name"
                        name="name"
                        type="text"
                        {...register("name", { required: true })}
                    />
                    <label htmlFor="types" className={styles.label}>
                        Type
                    </label>
                    <select
                        className={styles.select}
                        id="types"
                        name="types"
                        {...register("types", { required: true })}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <label htmlFor="members" className={styles.label}>
                        Member
                    </label>
                    <select
                        className={styles.select}
                        id="members"
                        name="members"
                        {...register("members", { required: true })}
                    >
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <FontAwesomeIcon
                        icon={faClose}
                        style={{ width: 15, color: "white" }}
                        className={styles.close}
                        onClick={undisplayUser}
                    />
                    <button className={styles.button} onClick={handleSubmit(createChannel)}>Create Channel</button>
                </div> : null}

            {showAddMembers ?
                <form>
                    <div className={styles.createChannel}>
                        <label htmlFor="name" className={styles.label}>
                            Name
                        </label>
                        <input
                            className={styles.input}
                            id="name"
                            name="name"
                            type="text"
                            {...register("name", { required: true })}
                        />
                        <label htmlFor="types" className={styles.label}>
                            Type
                        </label>
                        <select
                            className={styles.select}
                            id="types"
                            name="types"
                            {...register("types", { required: true })}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                        <label htmlFor="members" className={styles.label}>
                            Member
                        </label>
                        <select
                            className={styles.select}
                            id="members"
                            name="members"
                            {...register("members", { required: true })}
                        >
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <FontAwesomeIcon
                            icon={faClose}
                            style={{ width: 15, color: "white" }}
                            className={styles.close}
                            onClick={undispalyUserModal}
                        />
                        <button className={styles.button} onClick={handleSubmit(addMembersInChannel)}>Add member(s)</button>
                    </div>
                </form> : null}

        </>
    );
}

export default Board;