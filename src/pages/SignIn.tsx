import {useEffect, useState} from 'react';
import styles from '@/styles/Form.module.css';
import Link from "next/link";
import {NextRouter, useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {BASE_URL} from "@/providers/base";
import axios from "axios";

export default function SignIn() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState();
    const api = axios.create({
        baseURL: BASE_URL,
    });

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/users/login', data);
            console.log("RESPONSE: ", response.data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            router.push("/ChatHome");
        } catch (error) {
            console.log("ERROR: ", error);
            setError(error)
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
                    </div>
                    <button className={`${styles.button}`} type="submit">
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
