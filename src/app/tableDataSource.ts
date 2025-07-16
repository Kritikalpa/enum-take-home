import {
  AUDIO_COLUMN_COUNT,
  audioURLs,
  TOTAL_COLUMNS,
  VIDEO_COLUMN_COUNT,
  videoIdList,
} from "../utils/constants";
import {
  getRandomCommaSeparatedString,
  getRandomTimeframe,
} from "../utils/functions";
import { type TableRow } from "../types/table";

let _cachedAllData: TableRow[] | null = null;

export function generateAllData(totalRows = 20): TableRow[] {
  if (_cachedAllData) return _cachedAllData;

  const rows: TableRow[] = Array.from({ length: totalRows }, (_, rowIndex) => {
    const id = rowIndex;
    const columns = Array.from({ length: TOTAL_COLUMNS }, (_, colIndex) => {
      if (colIndex < VIDEO_COLUMN_COUNT) {
        return {
          data: getRandomCommaSeparatedString(videoIdList, 3, 0),
          duration: getRandomTimeframe(),
          category: "Video",
        };
      } else if (
        colIndex >= VIDEO_COLUMN_COUNT &&
        colIndex < VIDEO_COLUMN_COUNT + AUDIO_COLUMN_COUNT
      ) {
        return {
          data: getRandomCommaSeparatedString(audioURLs, 2, 0),
          category: "Audio",
        };
      }
      return {
        data: `Row ${id + 1}, Col ${colIndex + 1}`,
        category: "Text",
      };
    });

    return { id, columns };
  });

  _cachedAllData = rows;
  return rows;
}

export function updateCachedVideoData(
  rowId: number,
  columnIndex: number,
  updatedData: string
) {
  if (!_cachedAllData) return;

  const rowIndex = _cachedAllData.findIndex((r) => r.id === rowId);
  if (rowIndex === -1) return;

  const row = _cachedAllData[rowIndex];
  const oldColumn = row.columns[columnIndex];

  if (!oldColumn || oldColumn.category !== "Video") return;

  const updatedColumns = [...row.columns];
  updatedColumns[columnIndex] = { ...oldColumn, data: updatedData };

  _cachedAllData[rowIndex] = {
    ...row,
    columns: updatedColumns,
  };
}
