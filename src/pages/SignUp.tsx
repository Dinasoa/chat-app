import styles from '@/styles/Form.module.css';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { BASE_URL } from '@/providers/base';
import Link from "next/link";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";

export default function SignUp() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {setUser, user} = useAuthStore();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/users', data);
            console.log("RESPONSE: ", response.data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(response.data.user)
            console.log("This is the user: ", user)
            router.push("/ChatHome");
        } catch (error) {
            console.log("ERROR: ", error);
        }
    };

    return (
        <>
            <div className={`${styles.card}`}>
                <form className={`${styles.form}`} onSubmit={handleSubmit(onSubmit)}>
                    <div className="email-section">
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
                        {errors.email && <p>Ce champ est obligatoire.</p>}
                    </div>
                    <div>
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
                        {errors.name && <p>Ce champ est obligatoire.</p>}
                    </div>
                    <div>
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
                        {errors.password?.type === 'required' && <p>Ce champ est obligatoire.</p>}
                        {errors.password?.type === 'minLength' && <p>Le mot de passe doit contenir au moins 8 caractères.</p>}
                    </div>

                    <button className={`${styles.button}`} type="submit">
                        S'inscrire
                    </button>

                    <p>Vous avez déjà un compte? Cliquez ici: </p>
                    <Link href="/SignIn">
                        Se connecter
                    </Link>
                </form>
            </div>
        </>
    );
}
