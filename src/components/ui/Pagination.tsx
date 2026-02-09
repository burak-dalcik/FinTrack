interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, pageSize, total, onPageChange }: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const go = (p: number) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
        Page {page} of {totalPages} · {total} items
      </span>
      <div style={{ display: "flex", gap: "0.25rem" }}>
        <button className="btn btn-secondary" onClick={() => go(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

