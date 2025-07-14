import { type TableRow } from "../../types/table";
import {
  AUDIO_COLUMN_COUNT,
  PAGE_SIZE,
  TOTAL_COLUMNS,
  VIDEO_COLUMN_COUNT,
  videoIdList,
} from "../../utils/constants";
import { getRandomCommaSeparatedString } from "../../utils/functions";

export async function simulateFetchPage(page: number): Promise<TableRow[]> {
  await new Promise((res) => setTimeout(res, 3000));

  const rows: TableRow[] = Array.from({ length: PAGE_SIZE }, (_, rowIndex) => {
    const id = (page - 1) * PAGE_SIZE + rowIndex;
    const columns = Array.from({ length: TOTAL_COLUMNS }, (_, colIndex) => {
      if (colIndex < VIDEO_COLUMN_COUNT)
        return {
          data: getRandomCommaSeparatedString(videoIdList),
          category: "Video",
        };
      else if (
        colIndex >= VIDEO_COLUMN_COUNT &&
        colIndex < VIDEO_COLUMN_COUNT + AUDIO_COLUMN_COUNT
      )
        return { data: `Row ${id}, Col ${colIndex}`, category: "Audio" };
      return { data: `Row ${id}, Col ${colIndex}`, category: "Text" };
    });
    return {
      id,
      columns,
    };
  });

  return rows;
}
