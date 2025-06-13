class ApiError extends Error {
  constructor(statusCode, message = "went wrong", errors = [], stack = "") {
    super(message)
    this.message = message;
    this.statusCode = statusCode;
    this.erros = errors;
    this.sucess = false;
    this.data = null;
    if(stack){
        this.stack = stack
    }
    else{
        this.stack = Error.captureStackTrace(this,this.constructor)
    }
  }
}

export {ApiError};