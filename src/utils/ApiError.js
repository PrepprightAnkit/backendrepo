class ApiError extends Error {
    constructor(
        statuscode,
        message = "Something went wrong",
        errors = [], // Renamed parameter from `error` to `errors`
        stack = ""
    ) {
        super(message);
        this.statuscode = statuscode;
        this.data = null;
        this.success = false;
        this.errors = errors; // Assign `errors` to `this.errors`

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor); // Fixed the logic to correctly capture the stack trace
        }
    }
}

export { ApiError };
