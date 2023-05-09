import {useRouter} from "next/router";

export default function ChatHome () {
    const router = useRouter();
    return(
        <>
            <div className="chat-container">
                <div className="chat-header">
                    <h1>Chat App</h1>
                </div>
                <div className="chat-messages">
                    <div className="message">
                        <div className="message-header">
                            <span className="message-sender">User 1</span>
                            <span className="message-timestamp">10:30am</span>
                        </div>
                        <div className="message-body">
                            <p>Hello, how are you?</p>
                        </div>
                    </div>
                    <div className="message self">
                        <div className="message-header">
                            <span className="message-sender">Me</span>
                            <span className="message-timestamp">10:35am</span>
                        </div>
                        <div className="message-body">
                            <p>I'm good, thanks for asking.</p>
                        </div>
                    </div>
                </div>
                <div className="chat-input">
                    <input type="text" placeholder="Type your message here"/>
                    <button>Send</button>
                </div>
                <button className="button" type="submit" onClick={() => router.push("/Form")}>
                    Logout
                </button>
            </div>

        </>
    )
}