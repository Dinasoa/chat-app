import {useRouter} from "next/router";
import styles from '@/styles/Chat.module.css';
import Head from "next/head"
import {useState} from "react";
import Link from "next/link";
export default function Board () {

    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        localStorage.removeItem("userInfo")
        router.push("/SignIn")
    };


    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const newMessage = {
                id: new Date().getTime(),
                text: message,
                sender: 'Me',
            };
            setChatHistory([...chatHistory, newMessage]);
            setMessage('');
        }
    };
    const {push} = useRouter();
    const deleteLocalStorage = () => {
        localStorage.removeItem("userInfo");
        push("/SignIn")
    }

    return(
        <>
            <div>
                <Head>
                    <title>Next.js Chat App</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
                </Head>
                <nav className={styles.navbar}>
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Rechercher..." />
                        <button><i className="fas fa-search"></i></button>
                    </div>
                </nav>
                <div className={styles.container}>
                    <aside className={styles.sidebar}>
                        <ul>
                            <li>Channel 1#</li>
                            <li>Channel 2#</li>
                            <li>Channel 3#</li>
                        </ul>
                    </aside>
                    <main className={styles.chat}>
                        <div className={styles.chatHistory}>
                            {chatHistory.map((message) => (
                                <div key={message.id} className={styles.chatMessage}>
                                    <span className={styles.sender}>{message.sender}:</span>
                                    <span>{message.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.chatInput}>
                            <input type="text" value={message} onChange={handleMessageChange} placeholder="Type a message..." />
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </main>
                </div>
                <Link href="/SignIn">
                    <button className={`${styles.button}`}  onClick={deleteLocalStorage}>
                     Logout
                    </button>
                </Link>
            </div>
        </>
    )
}