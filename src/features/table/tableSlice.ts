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
  async ({
    page,
    searchQuery,
    columnFilters,
    sort,
  }: {
    page: number;
    searchQuery?: string;
    columnFilters?: Record<number, string[]>;
    sort?: { columnIndex: number; direction: "asc" | "desc" };
  }) => {
    const data = await simulateFetchPage({
      page,
      searchQuery,
      columnFilters,
      sort,
    });
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

      const updateRow = (row?: TableRow) => {
        if (row) {
          row.columns[colIndex] = {
            ...row.columns[colIndex],
            data: value,
          };
        }
      };

      updateRow(state.data.find((r) => r.id === rowId));
      updateRow(state.originalData.find((r) => r.id === rowId));
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
        const { data: incomingData, page } = action.payload;
        const isFiltered =
          action.meta.arg.searchQuery ||
          action.meta.arg.columnFilters ||
          action.meta.arg.sort;

        const isFirstPage = page === 1;

        if (isFiltered) {
          if (isFirstPage) {
            state.data = incomingData;
          } else {
            state.data = [...state.data, ...incomingData];
          }
        } else {
          if (isFirstPage) {
            state.data = incomingData;
            state.originalData = incomingData;
          } else {
            state.data = [...state.data, ...incomingData];
            state.originalData = [...state.originalData, ...incomingData];
          }
        }

        state.page = page;
        state.hasMore = page < 2;
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load data";
      });
  },
});

export const { updateCell, clearSort } = tableSlice.actions;
export default tableSlice.reducer;
