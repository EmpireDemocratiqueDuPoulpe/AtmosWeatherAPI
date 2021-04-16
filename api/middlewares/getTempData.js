const getTempData = async (request, response, next) => {
  /* code */
  request.tempData = { data: "mmmmmh poasson" };
  next();
}

export default getTempData;