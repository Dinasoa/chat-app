import styles from '@/styles/Chat.module.css';

export default function About () {
    return(
        <>
            <div className={styles.createChannel}>
                <label htmlFor="name" className={styles.label}>
                    Name
                </label>
                <input
                    className={styles.input}
                    id="name"
                    name="name"
                />
                <label htmlFor="name" className={styles.label}>
                    Type
                </label>
                <input
                    className={styles.input}
                    id="type"
                    name="type"
                />
            </div>
        </>
    )
}