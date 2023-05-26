import styles from '@/styles/About.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBlender} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import {useEffect} from "react";
import {useForm} from "react-hook-form";

// SWR: OPTIMISE LES TACHES ASYNCHRONES.
// Execute les taches asynchrones.

export default function About () {
    const {push} = useRouter();
    const {user, setUser} = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const token = user?.token

    const redirection = () => {
        push("/ChatHome")
    }

    const getUserInfo = async () => {
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

    const updateUserInfo = async (data) => {
        try{
            const response = await api.put("/user", data ,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("DATA", response.data)
        }
        catch (error){
            console.log(error)
        }
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

            <form onSubmit={handleSubmit(updateUserInfo)}>
                <div className={styles.createChannel}>
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        className={styles.input}
                        id="email"
                        name="email"
                        placeholder={user?.email}
                        {...register("email")}
                    />
                    <label htmlFor="name" className={styles.label}>
                        Name
                    </label>
                    <input
                        className={styles.input}
                        id="name"
                        name="name"
                        placeholder={user?.name}
                        {...register("name")}
                    />
                    <label htmlFor="bio" className={styles.label}>
                        Bio
                    </label>
                    <input
                        className={styles.input}
                        id="bio"
                        name="bio"
                        placeholder={user?.bio}
                        {...register("bio")}
                    />
                    <label htmlFor="password" className={styles.label}>
                        Password
                    </label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        name="password"
                        {...register("password")}
                    />
                    <button className={styles.button} onClick={updateUserInfo}>UPDATE</button>
                </div>
            </form>

        </>
    )
}