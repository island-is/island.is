class APIResponse {
    constructor()
    {
        this.statusCode = 200;
        this.message = ["Aðgerð tókst"];
        this.error = null;

    }
    statusCode: number;
    message: string[] | null;
    error: string | null;
}

export default APIResponse;

