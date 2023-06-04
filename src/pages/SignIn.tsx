import styles from '@/styles/Form.module.css';
import Link from "next/link";
import {NextRouter, useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {useAuthStore} from "@/stores/auth-store";
import {api} from "@/providers/api";

export default function SignIn() {
    const router : NextRouter = useRouter();
    const {setUser, user} = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/users/login', data);
            console.log("RESPONSE: ", response.data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(response.data.user)
            console.log("This is the user: ", user)
            await router.push("/ChatHome");
        } catch (error) {
            console.log("ERROR: ", error);
        }
    };

    return (
        <>
            <div className={`${styles.card}`}>
                <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
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

                    <button className={styles.loginButton} type="submit">
                        Se connecter
                    </button>

                    <p>Pas de compte, cliquez ici: </p>
                    <Link href="/SignUp">
                        S'inscrire
                    </Link>

                </form>
            </div>
        </>
    );
}
