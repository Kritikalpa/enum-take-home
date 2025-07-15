import {
  AUDIO_COLUMN_COUNT,
  audioURLs,
  PAGE_SIZE,
  TOTAL_COLUMNS,
  VIDEO_COLUMN_COUNT,
  videoIdList,
} from "../utils/constants";
import { getRandomCommaSeparatedString } from "../utils/functions";
import { type TableRow } from "../types/table";

let _cachedAllData: TableRow[] | null = null;

export function generateAllData(totalRows = 100): TableRow[] {
  if (_cachedAllData) return _cachedAllData;

  const rows: TableRow[] = Array.from({ length: totalRows }, (_, rowIndex) => {
    const id = rowIndex;
    const columns = Array.from({ length: TOTAL_COLUMNS }, (_, colIndex) => {
      if (colIndex < VIDEO_COLUMN_COUNT) {
        return {
          data: getRandomCommaSeparatedString(videoIdList, 5, 2),
          category: "Video",
        };
      } else if (
        colIndex >= VIDEO_COLUMN_COUNT &&
        colIndex < VIDEO_COLUMN_COUNT + AUDIO_COLUMN_COUNT
      ) {
        return {
          data: getRandomCommaSeparatedString(audioURLs, 2, 1),
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
