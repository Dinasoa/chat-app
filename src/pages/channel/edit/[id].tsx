import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import styles from "@/styles/Chat.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faMessage, faSearch} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";

const ChannelEdit = () => {
    const router = useRouter();
    const {id} = router.query;
    const {user} = useAuthStore();
    const token = user?.token;
    const {handleSubmit, register} = useForm();
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>("");

    const deconnect = () => {
        localStorage.removeItem("userInfo");
        router.push("/login")
    }

    const addMembersInChannel = async  (data) => {
        data["members"] = members;

        try{
            const responses = await api.post(`/channels/${id}/members`, data, {
                "headers": {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(responses);
            setSuccessMessage("Votre mis à jour a été bien pris en compte. ")
            router.push(`/channel/${id}`)
        } catch (error) {
            alert(error)
        }
    }

    const handleOptionChange = (value) => {
        setMembers((prevMembers) => {
            if (prevMembers.includes(value)) {
                return prevMembers.filter((option) => option !== value);
            } else {
                return [...prevMembers, value];
            }
        });
    };

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

                    <svg style={{width: 30}} xmlns="http://www.w3.org/2000/svg" fill="none"
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

            <form name="editChannelForm">
                <div className={styles.createChannel}>
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
                            <label htmlFor={user.id} style={{color:"black", fontWeight:"bold"}}>{user.name}</label>
                        </div>
                    ))}

                    <div>
                        {
                            users.filter((user) => {
                                return members.includes(user.id)
                            }).map(user => {
                                return(
                                    <li key={user.id} style={{color:"white"}}>
                                        {user.name}
                                    </li>
                                )
                            })
                        }
                    </div>

                    {successMessage != "" ? successMessage : ""}

                    <button className={styles.button + " editChannelButton"} onClick={handleSubmit(addMembersInChannel)}>Edit Channel</button>
                </div>
            </form>
        </>
    )
}

export default ChannelEdit;

