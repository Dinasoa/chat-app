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
import Link from "next/link";

// TODO: only members in a channel can talk in the channel


const  Board = () =>  {
    const router = useRouter();
    const { user } = useAuthStore();
    const { messages, message, setMessage, setMessages} = useMessageStore();
    const [channels, setChannels] = useState([]);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const [showUpdateChannel, setShowUpdateChannel] = useState(false);
    const token = user?.token;
    const [users, setUsers] = useState([]);
    const [membersToAdd, setMembersToAdd] = useState([]);
    const { register, handleSubmit, setValue, watch,formState: { errors } } = useForm({
        defaultValues: {
            members: []
        }
    });
    const [currentChannelId, setCurrentChannelId] = useState<>();
    const [recipientId, setRecipientId] = useState<>();

    const deconnect = () => {
        localStorage.removeItem("userInfo");
        router.push("/login");
    };

    const createChannelForm = () => {
        router.push("/channel/create")
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
            router.push("/message");
        } catch (error) {
            console.log("BEARER: ", token);
            console.log("ERROR: ", error);
        }
    };

    useEffect(()=>{
        getAllUsers();
        getChannels();
    }, []);

    const displayUser = () => {
        router.push("/profile");
    };

    const getChannelById = async (channelId) => {
        try {
            console.log("THe channel id: ", channelId)
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
            // TODO: edit channel type
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

    const getChannelMessage = async (channelId) => {
        try{
            const responses = await api.get(`/messages/channel/${channelId}`, {
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
                        <button className={styles.channelButton} onClick={createChannelForm}>
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
                                <Link href={`/message/${user.id}`} >
                                    <p className={styles.channelButton}>{user.name}</p>
                                </Link>
                            ))}
                        </div>
                        <ul>
                            <h3>Channels: </h3>
                            {channels?.map((channel) => (
                                <Link href={`/channel/${channel.id}`} >
                                <p className={styles.channelButton}>{channel.name}_{channel.id}</p>
                                </Link>
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
                                    <Link href={`/channel/edit/${currentChannelId}`} >
                                        <button className={styles.channelButton}> Edit current channel</button>
                                    </Link>
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
                        </div>

                    </main>
                </div>
            </div>

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

        </>
    );
}

export default Board;