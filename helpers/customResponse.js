const createResponse = (
  totalCount,
  currentPage,
  totalCount,
  limitNumber,
  data
) => {
  return {
    totalCount,
    currentPage,
    totalPages: Math.ceil(totalCount / limitNumber),
    data,
  };
};

module.exports = createResponse;
