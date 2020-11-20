class APIResponse {
    constructor()
    {
        this.statusCode = null;
        this.message = null;
        this.error = null;
    }

    statusCode?: number;
    message?: string;
    error?: string;
}

export default APIResponse;

