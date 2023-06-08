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

// TODO: only members in a channel can talk in the channel
const  Board = () =>  {
    const router = useRouter();
    const { user } = useAuthStore();
    const { messages, message, setMessage, setMessages} = useMessageStore();
    const [channels, setChannels] = useState([]);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [showUpdateChannel, setShowUpdateChannel] = useState(false);
    const token = user?.token;
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const [membersToAdd, setMembersToAdd] = useState([]);
    const { register, handleSubmit, setValue, watch,formState: { errors } } = useForm({
        defaultValues: {
            members: []
        }
    });
    const [currentChannelId, setCurrentChannelId] = useState<number>();
    const [recipientId, setRecipientId] = useState<number>(1);

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

    const showUpdateChannelForm = () => {
        setShowUpdateChannel(true);
    }

    const getChannels = async () => {
        const token = user?.token;

        try {
            const response = await api.get('/channels', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("All channels: ", response.data);
            setChannels(response.data.channels);
            router.push("/ChatHome");
        } catch (error) {
            console.log("BEARER: ", token);
            console.log("ERROR: ", error);
        }
    };

    useEffect(()=>{
        getAllUsers();
        getChannels();
    }, [messages]);

    useEffect(() => {
        if(recipientId != undefined){
            directMessage(recipientId)
        }
        if(currentChannelId != null || currentChannelId != undefined){
            getChannelMessage(currentChannelId);
        }
    }, [])



    const displayUser = () => {
        router.push("/About");
    };

    const undisplayUser = () => {
        setShowCreateChannel(false);
    };

    const createChannel = async (data) => {
        setShowCreateChannel(false);
        data["members"] = members;
        console.log("Channel to create: ", data)
        const token = user?.token;

        try {
            const response = await api.post('/channel', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Channel to create: ", response.data);
        }  catch(error){
            alert(error)
        }
    };

    const getChannelById = async (channelId) => {
        try {
            if(channelId == undefined){
                setCurrentChannelId(1)
            }

            const response = await api.get(`/channels/?channel_id=${channelId}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            getChannelMessage(channelId)
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
            console.log("Users: " , response.data.users)
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

        data["members"] = membersToAdd;
        console.log("Members to add in the current channel: ", data);

        try{
            // TODO: ADD THE ENDPOINT TO ADD MEMBERS IN A CHANNEL
            // DATA IS AN OBJECT CONTAINING LIST OF MEMBERS WE'D LIKE TO ADD IN THE CHANNEL
            // {"members":["6"]}
            const responses = await api.post(`/channels/${currentChannelId}/members`, data, {
                "headers": {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(responses);
        }catch(error){
            alert("Error from the request: " + error);
        }
    }


    const saveMessage = (event:ChangeEvent<HTMLInputElement>) => {
        const message = {
            "channelId": currentChannelId != null ? currentChannelId : null,
            "recipientId": recipientId != null ? recipientId : null,
            "content": event.target.value
        }
        setMessage(message);
    }

    const sendMessage = async () => {
        try{
            const messagesToCreate = await api.post("/message", message, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(currentChannelId != null){
                // TODO: trop de duplicatoin, appeler la methode déjà créée
                const allMessages = await api.get(`/messages/channel/${currentChannelId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setMessages(allMessages.data)
            }
            // TODO: de meme pour celle-la
            if(recipientId != null){
                const allMessages = await api.get(`/messages/${recipientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setMessages(allMessages.data)
                console.log("Message sent: ", messagesToCreate.data)
            }
        } catch (error) {
            alert("There is an error. ")
        }
    }

    const getChannelMessage = async (channelId) => {
        try{
            const responses = await api.get(`/messages/channel/${channelId}`, {
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

    const directMessage = async (id) => {
        console.log("The current recipient id is: ", recipientId);
        console.log("The current channel id is: ", currentChannelId);
        setCurrentChannelId(null);
        try{
            setRecipientId(id);
            const responses = await api.get(`/messages/${recipientId}`,{
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

                        <svg style={{width: 30}} onClick={displayUser} xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icons}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>


                        <button
                            className={styles.logoutButton + " logoutButton"}
                            onClick={deconnect}>Logout
                        </button>

                    </div>
                </nav>

                {/*__SIDEBAR_NAVIGATION__ AND __CHAT_SECTION*/}
                <div className={styles.container}>
                    <aside className={styles.sidebar}>
                        <button className={styles.channelButton} onClick={handleClick}>
                            Create channel
                            <FontAwesomeIcon
                                icon={faAdd}
                                style={{width: 10, color: "white"}}
                                onClick={displayUser}
                            />
                        </button>
                        <div className={styles.directMessage}>
                            <h3>Users: </h3>
                            {users.map((user) => (
                                <li key={user?.id} onClick={() => directMessage(user.id)}
                                    className={styles.userDirectMessage + " userDirectMessage"}>{user.name}
                                </li>
                            ))}
                        </div>
                        <ul>
                            <h3>Channels: </h3>
                            {channels?.map((channel) => (
                                <li className={styles.li} key={channel.id} onClick={() => {
                                    getChannelById(channel.id)
                                }}>
                                    {channel.name}_{channel.id} #
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main className={styles.chat}>

                        <div >
                            <h1>
                                {
                                    currentChannelId == undefined && recipientId == undefined ? <h1>
                                        Please select a channel or a direct message
                                    </h1> : <h1></h1>
                                }
                            </h1>
                            {currentChannelId != undefined ?
                                <div>
                                    <button className={styles.channelButton} onClick={showAddMembersForm}>
                                        Add members
                                        <FontAwesomeIcon
                                            icon={faAdd}
                                            style={{width: 10, color: "white"}}
                                        />
                                    </button>
                                    <button className={styles.channelButton} onClick={showUpdateChannelForm}>
                                        Update current channel
                                        <FontAwesomeIcon
                                            icon={faAdd}
                                            style={{width: 10, color: "white"}}
                                        />
                                    </button>
                                </div>
                                : null
                            }

                            {
                                messages?.messages?.length >= 1 && currentChannelId != undefined || recipientId != undefined ?
                                    <div className={styles.chatHistory}>

                                        {recipientId != undefined && currentChannelId == undefined ?
                                            <h1> Direct Message: {recipientId} </h1>
                                            :
                                            <div>
                                                <h1> You are in the channel number_{currentChannelId} </h1>
                                            </div>
                                        }

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


            {showCreateChannel ?
                <form className="createChannelForm" name="createChannelForm">
                    <div className={styles.createChannel}>
                        <label htmlFor="name" className={styles.label}>
                            Name
                        </label>
                        <input
                            className={styles.input}
                            id="channelName"
                            name="name"
                            type="text"
                            {...register("name", {required: true})}
                        />
                        <label htmlFor="type" className={styles.label}>
                            Type
                        </label>
                        <select
                            className={styles.select}
                            id="type"
                            name="type"
                            {...register("type", {required: true})}
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
                            onChange={({target}) => {
                                const value = target.value;
                                const newValue = new Set([parseInt(value), ...members]);
                                console.log("members: ", newValue)
                                setMembers(() => Array.from(newValue.values()))
                            }}
                        >

                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <div>
                            {
                               users.filter((user) => {
                                   return members.includes(user.id)
                               }).map(user => {
                                   return(
                                           <li key={user.id}>
                                               {user.name}
                                           </li>
                                   )
                               })
                            }
                        </div>

                        <FontAwesomeIcon
                            icon={faClose}
                            style={{width: 15, color: "white"}}
                            className={styles.close}
                            onClick={undisplayUser}
                        />
                        {/*TODO: edit channel*/}
                        <button className={styles.createChannelButton + " createChannelButton"} onClick={handleSubmit(createChannel)}>Create
                            Channel
                        </button>
                    </div>
                </form>
                : null}

            {showUpdateChannel ?
                <form className="editChannelForm" name="editChannelForm">
                    <div className={styles.createChannel}>

                        <label htmlFor="type" className={styles.label}>
                            Type
                        </label>
                        <select
                            className={styles.select}
                            id="type"
                            name="type"
                            {...register("type", {required: true})}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                        <button onClick={() => setShowUpdateChannel(false)}>Close</button>
                        <button className={styles.button + " updateChannelButton"} onClick={handleSubmit(addMembersInChannel)}>Update Channel
                        </button>
                    </div>
                </form> : null}

            {showAddMembers ?
                <form>
                    <div className={styles.createChannel}>
                        <label htmlFor="members" className={styles.label}>
                            Member
                        </label>
                        <select
                            className={styles.select}
                            id="members"
                            name="members"
                            onChange={({target}) => {
                                const value = target.value;
                                const newValue = new Set([parseInt(value), ...members]);
                                console.log("members: ", newValue)
                                setMembersToAdd(() => Array.from(newValue.values()))
                            }}
                        >

                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <div>
                            {
                                users.filter((user) => {
                                    return members.includes(user.id)
                                }).map(user => {
                                    return(
                                        <li key={user.id}>
                                            {user.name}
                                        </li>
                                    )
                                })
                            }
                        </div>
                        <FontAwesomeIcon
                            icon={faClose}
                            style={{width: 15, color: "white"}}
                            className={styles.close}
                            onClick={undispalyUserModal}
                        />
                        <button className={styles.button} onClick={handleSubmit(addMembersInChannel)}>Add member(s)
                        </button>
                    </div>
                </form> : null}

        </>
    );
}

export default Board;