export interface Message{
    recipientId: number | null,
    channelId: string | null,
    content: string
}

// (messages: { recipientId: number | null; channelId: number | null; content: string }) => void;

export interface Messages{
    status: boolean,
    messages: [
        {
            id: number,
            content: string,
            createdAt: string,
            updatedAt: string,
            senderId: string,
            recipientId: string,
            channelId: string,
            sender: {
                id: number,
                name: string,
                email: string
            }
        }
    ]
}