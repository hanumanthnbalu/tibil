const CustomResponse = {
    status: 0,
    message: "",
    stack: "",
    error: function (status, message, stack) {
        this.status = status;
        this.message = message;
        this.stack = stack;
        return this;
    },
};

module.exports = CustomResponse;
