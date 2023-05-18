import createError from 'http-errors'

export const badRequest = (err, res) =>{
    const error = createError.BadRequest(err)

    return res.status(error.status).json({
        err: 1,
        mess: error.message
    })
}


// internal error
export const internalError = (res) => {
    const error = createError.InternalServerError();
      // internal trả ra er 500
    return res.status(error.status).json({
      err: 1,
      mess: error.message,
    });
  };

  export const notfound = (req, res, next) => {
    const error = createError.NotFound('This route is undefined');
    return res.status(error.status).json({
      err: 1,
      mess: error.message,
    });
  };