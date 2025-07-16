import { generateAllData } from "../../app/tableDataSource";
import type { TableRow } from "../../types/table";

type FetchParams = {
  page: number;
  searchQuery?: string;
  columnFilters?: Record<number, string[]>;
  sort?: { columnIndex: number; direction: "asc" | "desc" };
};

export async function simulateFetchPage({
  page,
  searchQuery,
  columnFilters,
  sort,
}: FetchParams): Promise<TableRow[]> {
  await new Promise((res) => setTimeout(res, 300));

  const allRows: TableRow[] = generateAllData();

  let filtered = [...allRows];

  if (searchQuery) {
    filtered = filtered.filter((row) =>
      row.columns.some((cell) =>
        cell.data.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  if (columnFilters) {
    filtered = filtered.filter((row) =>
      Object.entries(columnFilters).every(([colIdxStr, values]) => {
        const colIdx = +colIdxStr;
        const cell = row.columns[colIdx];

        if (values.length === 0) return true;

        if (["Video", "Audio"].includes(cell.category)) {
          const parts = cell.data
            .split(",")
            .filter(Boolean)
            .map((v) => v.trim());
          return parts.some((v) => values.includes(v));
        }

        return values.includes(cell.data);
      })
    );
  }

  if (sort) {
    filtered.sort((a, b) => {
      const { columnIndex, direction } = sort;
      if (["Video", "Audio"].includes(a.columns[columnIndex].category)) {
        const aLen = a.columns[columnIndex].data
          .split(",")
          .filter(Boolean).length;
        const bLen = b.columns[columnIndex].data
          .split(",")
          .filter(Boolean).length;
        return direction === "asc" ? aLen - bLen : bLen - aLen;
      }
      const aVal = a.columns[columnIndex].data ?? "";
      const bVal = b.columns[columnIndex].data ?? "";
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }

  const PAGE_SIZE = 10;
  const start = (page - 1) * PAGE_SIZE;
  const pageData = filtered.slice(start, start + PAGE_SIZE);

  return pageData;
}
