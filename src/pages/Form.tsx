import { useState } from 'react';
import styles from '@/styles/Form.css';
import Link from "next/link";
import {useRouter} from "next/router";

export default function Form() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
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

    const handleInputChange = (event) => {
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
            <div className="card">
                <form className="form" onSubmit={handleFormSubmit}>
                    <div className="email-section">
                        <label htmlFor="email" className="label">
                            Email
                        </label>
                        <input
                            className="input"
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="label">
                            Name
                        </label>
                        <input
                            className="input"
                            id="name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="label">
                            Password
                        </label>
                        <input
                            className="input"
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <Link href="/ChatHome">
                        <button className="button" type="submit" onClick={handleFormSubmit}>
                        Se connecter
                        </button>
                    </Link>

                </form>
            </div>
        </>
    );
}
