import {useEffect, useState} from 'react';
import styles from '@/styles/Form.module.css';
import Link from "next/link";
import {NextRouter, useRouter} from "next/router";

export default function SignUp() {
    return (
        <>
            <div className={`${styles.card}`}>
                <form className={`${styles.form}`}>
                    <div className="email-section">
                        <label htmlFor="email" className={`${styles.label}`}>
                            Email
                        </label>
                        <input
                            className={`${styles.input}`}
                            id="email"
                            name="email"
                            type="email"
                            // value={email}
                            // onChange={handleInputChange}
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
                            // value={name}
                            // onChange={handleInputChange}
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
                            // value={password}
                            // onChange={handleInputChange}
                        />
                    </div>

                    <Link href="/ChatHome">
                        <button className={`${styles.button}`}type="submit" >
                        S'inscrire
                        </button>
                    </Link>

                </form>
            </div>
        </>
    );
}
