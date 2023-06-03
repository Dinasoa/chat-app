export interface Message{
    channel_id: string,
    recipient_id: number,
    content: string
}

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