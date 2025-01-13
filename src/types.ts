export type Tweet = {
    text: string;
    created_at: string;
}

export type TwitterResponse<T> = {
    data: T[];
}

export type UserResponse = {
    data: {
        id: string;
    };
}

export type MediaResponse = {
    media_id_string: string;
}