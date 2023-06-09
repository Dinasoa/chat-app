import styles from "@/styles/Chat.module.css";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMessage, faSearch} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import Link from "next/link";

export const Channel = () => {
    const router = useRouter();
    const { user } = useAuthStore();
    const [users, setUsers] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            members: []
        }
    })
    const token = user?.token;
    const [members, setMembers] = useState<string[]>([]);

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


    const createChannel = async (data) => {
        data["members"] = members;
        console.log("Channel to create: ", data)
        const token = user?.token;
        console.log("Channel to create: ", data);

        try {
            const response = await api.post('/channel', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Channel to create: ", response.data);
            // TODO: redirect to the channel that has been created.

            router.push(`/channel/${response.data.channel.id}`)
        }  catch(error){
            alert(error)
        }
    };

    useEffect(() => {
        console.log("les members selectionnés: ", members);
    }, [members]);

    const handleOptionChange = (value) => {
        setMembers((prevMembers) => {
            if (prevMembers.includes(value)) {
                return prevMembers.filter((option) => option !== value);
            } else {
                return [...prevMembers, value];
            }
        });
    };

    return(
        <>
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

                    <svg style={{width: 30}} onClick={() => {router.push("/profile")}} xmlns="http://www.w3.org/2000/svg" fill="none"
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
                        onClick={() => {router.push("/login")}}>Logout
                    </button>

                </div>
            </nav>

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
                    {/* TODO: use checkbox for the member to add. */}
                    {users.map(user => (
                        <div key={user.id}>
                            <input
                                type="checkbox"
                                id={user.id}
                                value={user.id}
                                checked={members.includes(user.id)}
                                onChange={() => handleOptionChange(user.id)}
                            />
                            <label htmlFor={user.id}>{user.name}</label>
                        </div>
                    ))}

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

                    {/*TODO: edit channel*/}
                    <button className={styles.createChannelButton + " createChannelButton"} onClick={handleSubmit(createChannel)}>Create
                        Channel
                    </button>
                </div>
            </form>
        </>

    )
}

export default Channel;