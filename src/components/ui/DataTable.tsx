import { ReactNode } from "react";

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, getRowKey, emptyMessage }: DataTableProps<T>) {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "1rem", textAlign: "center" }}>
                {emptyMessage ?? "No records found."}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((col) => {
                  const value =
                    typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row as any)[col.accessor];
                  return <td key={col.header}>{value}</td>;
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

