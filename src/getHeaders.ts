export const getHeaders = () => {
    return {
        'Authorization': `Bearer ${process.env.X_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
    };
}