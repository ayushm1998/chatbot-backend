function failureResponse(status, message, statusCode) {
  //Standard pattern for failure or invalid reponse
  return {
    statusCode: statusCode,
    body: {
      status: status,
      message: message,
      timestamp: Date(),
    },
  };
}

function successResponse(data, statusCode) {
  //Standard pattern for valid response
  return {
    statusCode: statusCode,
    body: {
      data: data,
      timestamp: Date(),
    },
  };
}

module.exports = {
  failureResponse,
  successResponse,
};
