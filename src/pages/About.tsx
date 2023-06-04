import styles from '@/styles/About.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd, faBlender, faLongArrowLeft, faLongArrowRight, faSearch, faUser} from "@fortawesome/free-solid-svg-icons";
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

    const deconnect = () => {
        localStorage.removeItem("userInfo");
        push("/SignIn");
    };

    const getUserInfo = async () => {
        try {
            const response = await api.get("/user",  {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("User informations: ", response.data)
            console.log("Biography: ", user?.bio)

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
            setUser(response.data.user)
            console.log("User should have been updated: ", user)
            alert("User has been updated successfully. " )
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
                        // onClick={displayUser}
                    />
                    <FontAwesomeIcon
                        icon={faLongArrowLeft}
                        className={styles.icons}
                        style={{ width: 15, color: "black" }}
                        onClick={() => {push("/ChatHome")}}
                    />
                    <button
                        className={styles.logoutButton}
                        onClick={deconnect}>Logout
                    </button>
                </div>
            </nav>

            <div className={styles.container}>
                <aside className={styles.sidebar}>
                {/* ADD USER ICON */}

                </aside>
            </div>

            <form onSubmit={handleSubmit(updateUserInfo)} className="editProfileForm">
                <div className={styles.createChannel}>
                    <FontAwesomeIcon
                        icon={faUser}
                        style={{width: 25, color: "black"}}/>
                    {/*TODO: email is not updatable*/}
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        className={styles.input}
                        id="email"
                        name="email"
                        value={user?.email}
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
                    <textarea
                        name="bio"
                        id="bio"
                        placeholder="bio"
                        {...register("bio")}
                    >
                    </textarea>
                    <label htmlFor="password" className={styles.label}>
                        Password
                    </label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        name="currentPassword"
                        {...register("currentPassword")}
                    />
                    <label htmlFor="password" className={styles.label}>
                        New password
                    </label>
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        name="newPassword"
                        {...register("newPassword", {minLength: 8})}
                    />
                    <button className={styles.button} onClick={updateUserInfo}>UPDATE</button>
                </div>
            </form>

        </>
    )
}