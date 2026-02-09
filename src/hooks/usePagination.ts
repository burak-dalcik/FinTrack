import { useState } from "react";

export const usePagination = (initialPage = 1, pageSize = 10) => {
  const [page, setPage] = useState(initialPage);

  return {
    page,
    pageSize,
    setPage
  };
};

