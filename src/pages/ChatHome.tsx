import {useRouter} from "next/router";
import styles from '@/styles/Chat.module.css';
import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";
import {router} from "next/client";
import {faAdd, faClose, faLongArrowRight} from "@fortawesome/free-solid-svg-icons";
import {Channel} from "../model/Channel"
import {useChannelStore} from "@/stores/channel-store";

export default function Board () {
    const {push} = useRouter();

    const { user } = useAuthStore();
    const [channels, setChannels] = useState<Channel>();
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const {setChannel, channel} = useChannelStore();

    const deconnect = () => {
        localStorage.removeItem("userInfo");
        push("/SignIn")
    }

    const handleClick = () => {
        setShowCreateChannel(true)
        console.log(showCreateChannel)
    };

    const getChannels = async () => {
        const token = user?.token

        try {
            const response = await api.get('/channels', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("RESPONSE: ", response.data);
            setChannels(response.data);
            push("/ChatHome");
        } catch (error) {
            console.log("BEARER: ", token)
            console.log("ERROR: ", error);
        }
    };

    useEffect(() => {
        getChannels();
    }, []); // Appelle getChannels une fois après le montage du composant


    const displayUser = () => {
        router.push("/About")
    }

    const undisplayUser = () => {
       setShowCreateChannel(false)
    }

    const createChannel = async () => {
        setShowCreateChannel(false)
        //    axios.post("/channels")
        let token = user?.token
        try {
            const response = await api.post('/channel',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("RESPONSE: ", response.data);
        } catch (error) {
            console.log("BEARER: ", token)
            console.log("ERROR: ", error);
        }
    }


    return(
        <>
            <div>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
                <nav className={styles.navbar}>
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Rechercher..." />
                        <button><i className="fas fa-search"></i></button>
                        <FontAwesomeIcon
                            icon={faUser}
                            style={{ width: 15, color: "black"}}
                            onClick={displayUser}
                        />
                        <FontAwesomeIcon
                            icon={faLongArrowRight}
                            style={{ width: 15, color: "black"}}
                            onClick={deconnect}
                        />
                    </div>

                </nav>
                <div className={styles.container}>
                    <aside className={styles.sidebar}>
                        <button className={styles.channelButton} onClick={handleClick}>
                            Create channel
                            <FontAwesomeIcon
                                icon={faAdd}
                                style={{ width:10 , color: "white"}}
                                onClick={displayUser}
                            />
                        </button>

                        <ul>
                            {
                                channels?.channels.map(channel => {
                                return (
                                    <>
                                        <li className={styles.li}>{channel.name}# {channel.id}</li>
                                    </>
                                )})
                            }
                        </ul>
                    </aside>

                    <main className={styles.chat}>
                        <div className={styles.chatHistory}>
                        </div>
                        <div className={styles.chatInput}>
                            <input type="text" placeholder="Type a message..." />
                            <button>Send</button>
                        </div>
                    </main>
                </div>
                <Link href="/SignIn">
                    <button className={`${styles.button}`}  onClick={deconnect}>
                     Logout
                    </button>
                </Link>
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
                />
                <label htmlFor="name" className={styles.label}>
                    Type
                </label>
                <select className={styles.select}>
                    <option value={"public"}>Public</option>
                    <option value={"private"}>Private</option>
                </select>
                <label htmlFor="name" className={styles.label}>
                    Member
                </label>
                <select className={styles.select}>
                    <option>1</option>
                </select>
                <FontAwesomeIcon
                    icon={faClose}
                    style={{ width: 15, color: "white"}}
                    className={styles.close}
                    onClick={undisplayUser}
                />
                <button className={styles.button} onClick={createChannel}>Create Channel</button>
            </div> : null }

        </>
    )
}