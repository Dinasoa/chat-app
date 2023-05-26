import { useRouter } from "next/router";
import styles from "@/styles/Chat.module.css";
import { useEffect, useState } from "react";
import { api } from "@/providers/api";
import { useAuthStore } from "@/stores/auth-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faAdd, faClose, faLongArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useChannelStore } from "@/stores/channel-store";
import { useForm } from "react-hook-form";

export default function Board() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [channels, setChannels] = useState([]);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
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

    return (
        <>
            <div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

                {/*__NAVIGATION BAR__*/}
                <nav className={styles.navbar}>
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Rechercher..." />
                        <button><i className="fas fa-search"></i></button>
                        <FontAwesomeIcon
                            icon={faUser}
                            style={{ width: 15, color: "black" }}
                            onClick={displayUser}
                        />
                        <FontAwesomeIcon
                            icon={faLongArrowRight}
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
                        {/*TODO: display the members in the database and the value of the option will be the id of the user*/}
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

        </>
    );
}