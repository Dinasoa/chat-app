import styles from '@/styles/Form.module.css';
import Link from "next/link";
import {NextRouter, useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {useAuthStore} from "@/stores/auth-store";
import {api} from "@/providers/api";
import {useState} from "react";
import {bool} from "yup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDisplay} from "@fortawesome/free-solid-svg-icons";

export default function Login() {
    const router : NextRouter = useRouter();
    const {setUser, user} = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [handleError, setHandleError] = useState<>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleToggle = () => {
        setShowPassword(!showPassword)
    }
     const onSubmit = async (data) => {
        try {
            const response = await api.post('/users/login', data);
            console.log("RESPONSE: ", response.data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(response.data.user)
            console.log("This is the user: ", user)
            await router.push("/profile");
        } catch (error) {
            setHandleError(error.response.data.message);
            console.log("ERROR: ", error.response.data.message);
        }
    };

    return (
        <>
            <div className={styles.card}>
                <form className={styles.loginForm + " createChannelForm"} onSubmit={handleSubmit(onSubmit)}>
                    {/*<button onClick=>Show Password</button>*/}

                    <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            className={`${styles.input}`}
                            id="email"
                            name="email"
                            type="email"
                            {...register('email', { required: true })}
                        />
                        {errors.email && <p style={{color: "red"}}>Ce champ est obligatoire.</p>}

                        <label htmlFor="password" className={`${styles.label}`}>
                            Password
                        </label>
                        <input
                            className={`${styles.input}`}
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            {...register('password', { required: true, minLength: 8 })}
                        />
                        {errors.password?.type === 'required' && <p style={{color: "red"}}>Ce champ est obligatoire.</p>}
                        {handleError != "" ? <p style={{color: "red"}}>{handleError}</p> : ""}
                    <button className={styles.loginButton + " loginButton"} type="submit">
                        Se connecter
                    </button>


                    <p>Pas de compte, cliquez ici: </p>
                    <Link href="/sign-up">
                        S'inscrire
                    </Link>

                </form>
            </div>
        </>
    );
}
