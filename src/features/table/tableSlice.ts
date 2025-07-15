import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { simulateFetchPage } from "./tableAPI";
import { type TableRow } from "../../types/table";

interface TableState {
  data: TableRow[];
  originalData: TableRow[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: TableState = {
  data: [],
  originalData: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
};

export const fetchPage = createAsyncThunk(
  "table/fetchPage",
  async (page: number) => {
    const data = await simulateFetchPage(page);
    return { data, page };
  }
);

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    updateCell(
      state,
      action: PayloadAction<{ rowId: number; colIndex: number; value: string }>
    ) {
      const { rowId, colIndex, value } = action.payload;
      const row = state.data.find((r) => r.id === rowId);
      if (row) {
        row.columns[colIndex] = { ...row.columns[colIndex], data: value };
      }
    },
    sortTable(
      state,
      action: PayloadAction<{ columnIndex: number; direction: "asc" | "desc" }>
    ) {
      const { columnIndex, direction } = action.payload;
      state.data = [...state.data].sort((a, b) => {
        if (["Video", "Audio"].includes(a.columns[columnIndex].category)) {
          const aLen = a.columns[columnIndex].data.split(",").length;
          const bLen = b.columns[columnIndex].data.split(",").length;
          return direction === "asc" ? aLen - bLen : bLen - aLen;
        }
        const aVal = a.columns[columnIndex].data ?? "";
        const bVal = b.columns[columnIndex].data ?? "";
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    },
    clearSort(state) {
      state.data = [...state.originalData];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.data = [...state.data, ...action.payload.data];
        state.originalData = [...state.originalData, ...action.payload.data];
        state.hasMore = action.payload.page < 2;
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load data";
      });
  },
});

export const { updateCell, sortTable, clearSort } = tableSlice.actions;
export default tableSlice.reducer;
