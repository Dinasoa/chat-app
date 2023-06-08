import styles from "@/styles/Chat.module.css";
import {api} from "@/providers/api";
import {useAuthStore} from "@/stores/auth-store";
import {useState} from "react";
import {useForm} from "react-hook-form";

export const Channel = () => {
    const { user } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const { register, handleSubmit, setValue, watch,formState: { errors } } = useForm({
        defaultValues: {
            members: []
        }
    })

    const createChannel = async (data) => {
        data["members"] = members;
        console.log("Channel to create: ", data)
        const token = user?.token;

        try {
            const response = await api.post('/channel', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Channel to create: ", response.data);
        }  catch(error){
            alert(error)
        }
    };

    return(
        <form className="createChannelForm" name="createChannelForm">
            <div className={styles.createChannel}>
                <label htmlFor="name" className={styles.label}>
                    Name
                </label>
                <input
                    className={styles.input}
                    id="channelName"
                    name="name"
                    type="text"
                    {...register("name", {required: true})}
                />
                <label htmlFor="type" className={styles.label}>
                    Type
                </label>
                <select
                    className={styles.select}
                    id="type"
                    name="type"
                    {...register("type", {required: true})}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <label htmlFor="members" className={styles.label}>
                    Member
                </label>
                <select
                    className={styles.select}
                    id="members"
                    name="members"
                    onChange={({target}) => {
                        const value = target.value;
                        const newValue = new Set([parseInt(value), ...members]);
                        console.log("members: ", newValue)
                        setMembers(() => Array.from(newValue.values()))
                    }}
                >

                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <div>
                    {
                        users.filter((user) => {
                            return members.includes(user.id)
                        }).map(user => {
                            return(
                                <li key={user.id}>
                                    {user.name}
                                </li>
                            )
                        })
                    }
                </div>

                {/*TODO: edit channel*/}
                <button className={styles.createChannelButton + " createChannelButton"} onClick={handleSubmit(createChannel)}>Create
                    Channel
                </button>
            </div>
        </form>
    )
}