class Response {
  constructor({
    status = null,
    message = null,
    data = null,
    code = null,
    error = null,
  }) {
    (this.status = status),
      (this.message = message),
      (this.data = data),
      (this.code = code),
      (this.error = error);
  }
}

module.exports = Response;
