import styles from '@/styles/Form.module.css';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from "next/link";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import {useRef} from "react";

export default function SignUp() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } , watch} = useForm();
    const {setUser, user} = useAuthStore();
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/users', data);
            console.log("RESPONSE: ", response.data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(response.data.user)
            console.log("This is the user: ", user)
            router.push("/profile");
        } catch (error) {
            alert("Verify your data: " + error)
            console.log("ERROR: ", error);
        }
    };

    return (
        <>
            <div className={styles.card}>
                <form className={styles.registrationForm} name="registrationForm" onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="email" className={`${styles.label}`}>
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

                        <label htmlFor="name" className={`${styles.label}`}>
                            Name
                        </label>
                        <input
                            className={`${styles.input}`}
                            id="name"
                            name="name"
                            type="text"
                            {...register('name', { required: true })}
                        />
                        {errors.name && <p style={{color: "red"}}>Ce champ est obligatoire.</p>}
                        <label htmlFor="bio" className={`${styles.label}`}>
                            Bio
                        </label>
                        <input
                            className={styles.input}
                            id="bio"
                            name="bio"
                            type="text"
                            {...register("bio", {required: false})}
                        />
                        <label htmlFor="password" className={`${styles.label}`}>
                            Password
                        </label>
                        <input
                            className={`${styles.input}`}
                            id="password"
                            name="password"
                            type="password"
                            {...register('password', { required: true, minLength: 8 })}
                        />
                        {errors.password?.type === 'required' && <p style={{color: "red"}}>Ce champ est obligatoire.</p>}
                        {errors.password?.type === 'minLength' && <p style={{color: "red"}}>Le mot de passe doit contenir au moins 8 caractères.</p>}

                        {/*TODO: add constraint on confirm password to be eauql with the password. */}

                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirm Password
                        </label>
                        <input
                            className={`${styles.input}`}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            {...register('confirmPassword', {
                                validate: (value) => value === password.current || 'Le mot de passe ne correspond pas. ',
                            })}
                        />
                        {errors.confirmPassword && <p style={{color: "red"}}>{errors.confirmPassword.message}</p>}

                    <button className={styles.registerButton + " registerButton"} type="submit">
                        S'inscrire
                    </button>

                    <p>Vous avez déjà un compte? Cliquez ici: </p>
                    <Link href="/login">
                        Se connecter
                    </Link>
                </form>
            </div>
        </>
    );
}
