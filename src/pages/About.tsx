import styles from '@/styles/About.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBlender} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import {useEffect} from "react";

// SWR: OPTIMISE LES TACHES ASYNCHRONES.
// Execute les taches asynchrones.

export default function About () {
    const {push} = useRouter();
    const {user, setUser} = useAuthStore();

    const redirection = () => {
        push("/ChatHome")
    }

    const getUserInfo = async () => {
        const token = user?.token
        try {
            const response = await api.get("/user",  {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("DATA: ", response.data)
        } catch (error) {
            console.log("ERROR: ", error)
        }
    }

    const updateUserInfo = () => {

    }

    useEffect(() => {
        getUserInfo()
    }, [])

    return(
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            <nav className={styles.navbar}>
                <div className={styles.searchBar}>
                    <input type="text" placeholder="Rechercher..." />
                    <button><i className="fas fa-search"></i></button>
                    <FontAwesomeIcon icon={faBlender}
                                     style={{width:15,color:"black"}}
                                     onClick={redirection}
                    ></FontAwesomeIcon>
                </div>
            </nav>

            <div className={styles.createChannel}>
                <label htmlFor="name" className={styles.label}>
                    Email
                </label>
                <input
                    className={styles.input}
                    id="name"
                    name="name"
                    placeholder={user?.email}
                />
                <label htmlFor="name" className={styles.label}>
                    Name
                </label>
                <input
                    className={styles.input}
                    id="name"
                    name="name"
                    placeholder={user?.name}
                />
                <label htmlFor="name" className={styles.label}>
                    Bio
                </label>
                <input
                    className={styles.input}
                    id="type"
                    name="type"
                    placeholder={user?.bio}
                />
                <label htmlFor="name" className={styles.label}>
                    Password
                </label>
                <input
                    className={styles.input}
                    id="type"
                    name="type"
                />
                <button className={styles.button} onClick={updateUserInfo}>UPDATE</button>
            </div>

        </>
    )
}