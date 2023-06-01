import { useRouter } from "next/router";
import styles from "@/styles/Chat.module.css";
import { useEffect, useState } from "react";
import { api } from "@/providers/api";
import { useAuthStore } from "@/stores/auth-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser, faAdd, faClose, faLongArrowRight, faSearch} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

export default function Board() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [channels, setChannels] = useState([]);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [showAddMembers, setShowAddMembers] = useState(false);
    const token = user?.token;
    const [users, setUsers] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm();

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
    }, []);

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
            console.log("ERROR: ", error);
        }
    };

    const getChannelById = async (channelId) => {
        try {
            // TODO: MAKE THE CHANNNEL_ID AS A REQUEST PARAM
            // CHANNEL_ID IS A REQUEST PARAM
            const response = await api.get(`/channel/${channelId}`);
            console.log("RESPONSE DATA: ", response.data);
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
            const responses = await api.post("/channels", data, {
                "headers": {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(responses);
        }catch(error){
            alert("Error from the request: " + error);
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

                        <FontAwesomeIcon
                            className={styles.icons}
                            icon={faUser}
                            style={{ width: 15, color: "black" }}
                            onClick={displayUser}
                        />

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

                    <main className={styles.chat}>
                        <div className={styles.chatHistory}></div>
                        <div className={styles.chatInput}>
                            <input type="text" placeholder="Type a message..." />
                            <button>Send</button>
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