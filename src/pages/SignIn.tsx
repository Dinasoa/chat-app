import {useEffect, useState} from 'react';
import styles from '@/styles/Form.module.css';
import Link from "next/link";
import {NextRouter, useRouter} from "next/router";
import axios from 'axios';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const router: NextRouter = useRouter();

    useEffect(() => {
        const existingInfo = localStorage.getItem('userInfo');
        if(existingInfo){
            router.push("/ChatHome")
        } else {
            router.push("/SignIn")
        }
    }, [email, name, password]);

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const userInfo = {
            email: email,
            name: name,
            password: password
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        router.push("/ChatHome")
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const eventName = event.target.name;
        const value = event.target.value;

        if (eventName === 'email') {
            setEmail(value);
        } else if (eventName === 'name') {
            setName(value);
        } else if (eventName === 'password') {
            setPassword(value);
        }
    };

    return (
        <>
            <div className={`${styles.card}`}>
                <form className={`${styles.form}`} onSubmit={handleFormSubmit}>
                    <div className="email-section">
                        <label htmlFor="email" className={`${styles.label}`}>
                            Email
                        </label>
                        <input
                            className={`${styles.input}`}
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleInputChange}
                        />
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
                            value={name}
                            onChange={handleInputChange}
                        />
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
                            value={password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <Link href="/ChatHome">
                        <button className={`${styles.button}`} type="submit" onClick={handleFormSubmit}>
                        Se connecter
                        </button>
                    </Link>
                    <p>Pas de compte, cliquez ici: </p>
                    <Link href="/SignUp">
                        S'inscrire
                    </Link>

                </form>
            </div>
        </>
    );
}
