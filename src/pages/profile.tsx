import styles from '@/styles/About.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faMessage,
    faSearch,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";

// SWR: OPTIMISE LES TACHES ASYNCHRONES.
// Execute les taches asynchrones.

export default function Profile () {
    const {push} = useRouter();
    const {user, setUser} = useAuthStore();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const token = user?.token
    const [users, setUsers] = useState({});
    const password = useRef({});
    password.current = watch('newPassword', '');
    // const [errorMessage, setErrorMessage] = useState();

    const deconnect = () => {
        localStorage.removeItem("userInfo");
        push("/login");
    };

    const getUserInfo = async () => {
        try {
            const response = await api.get("/user",  {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(response.data.user)
            console.log("User informations: ", response.data)
            console.log("The user: ", users)

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
            // TODO: afficher que l'utilisateur a bien été mis à jour
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
                    <input type="text" value="Rechercher..." />

                    <button>
                        <FontAwesomeIcon
                            className={styles.icons}
                            icon={faSearch}
                            style={{ width: 15, color: "black" }}
                        />
                    </button>

                    <label>
                        {users?.name}
                    </label>
                    <FontAwesomeIcon
                        className={styles.icons}
                        icon={faUser}
                        style={{ width: 15, color: "black" }}
                        // onClick={displayUser}
                    />
                    <FontAwesomeIcon
                        icon={faMessage}
                        className={styles.icons}
                        style={{ width: 15, color: "black" }}
                        onClick={() => {push("/message")}}
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

            <form onSubmit={handleSubmit(updateUserInfo)} className="editProfileForm" name="editProfileForm">
                <div className={styles.createChannel}>
                    <FontAwesomeIcon
                        icon={faUser}
                        style={{width: 25, color: "black"}}/>
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        className={styles.input}
                        id="email"
                        name="email"
                        value={users?.email}
                        {...register("email")}
                    />
                    <label htmlFor="name" className={styles.label}>
                        Name
                    </label>
                    <input
                        className={styles.input}
                        id="name"
                        name="name"
                        placeholder={users?.name}
                        {...register("name")}
                    />
                    <label htmlFor="bio" className={styles.label}>
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        id="bio"
                        placeholder={users?.bio}
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
                        id="newPassword"
                        name="newPassword"
                    />
                    <label htmlFor="password" className={styles.label}>
                        Confirm Password
                    </label>
                    <input
                        className={styles.input}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        {...register('confirmPassword', {
                            validate: (value) => value === password.current || 'Le mot de passe ne correspond pas. ',
                        })}
                    />
                    {errors.confirmPassword && <p style={{color: "red"}}>{errors.confirmPassword.message}</p>}
                    <button className={styles.button + " updateProfileButton"} onClick={updateUserInfo}>UPDATE</button>
                </div>
            </form>

        </>
    )
}