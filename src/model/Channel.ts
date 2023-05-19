export interface Channel{
    status: boolean
    channels:[
        {
            id: string
            name: string
            type: string
            members: string
        }
    ]
}