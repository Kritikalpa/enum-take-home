import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  clearSort,
  fetchPage,
  sortTable,
} from "../../features/table/tableSlice";
import styles from "./VirtualizedTable.module.scss";
import EditableCell from "./EditableCell";
import {
  AUDIO_COLUMN_COUNT,
  TOTAL_COLUMNS,
  VIDEO_COLUMN_COUNT,
} from "../../utils/constants";
import VideoStrip from "../VideoStrip/VideoStrip";
import Modal from "../Shared/Modal/Modal";
import Button from "../Shared/Button/Button";
import FilterIcon from "../../assets/FilterIcon";
import FilterDropdown from "../Shared/FilterDropdown/FilterDropdown";
import TableSkeleton from "../Shared/Skeleton/TableSkeleton";
import AudioStrip from "../AudioStrip/AudioStrip";
import { useDebounce } from "../../hooks/useDebounce";

const VirtualizedTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, page, hasMore, loading } = useAppSelector(
    (state) => state.table
  );

  const [sort, setSort] = useState<
    | {
        columnIndex: number;
        direction: "asc" | "desc";
      }
    | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [columnFilters, setColumnFilters] =
    useState<Record<number, string[]>>();
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [colWidths, setColWidths] = useState<Record<number, number>>({});
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery);

  // const filteredData = useMemo(() => {
  //   return data.filter((row) => {
  //     const matchesSearch = debouncedSearchQuery
  //       ? row.columns.some((cell) =>
  //           cell.data.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  //         )
  //       : true;

  //     const matchesFilters = Object.entries(columnFilters || {}).every(
  //       ([colIdxStr, values]) => {
  //         const colIdx = +colIdxStr;
  //         const cell = row.columns[colIdx];

  //         if (values.length === 0) return true;

  //         if (["Video", "Audio"].includes(cell.category)) {
  //           const parts = cell.data.split(",").map((v) => v.trim());
  //           return parts.some((v) => values.includes(v));
  //         }

  //         return values.includes(cell.data);
  //       }
  //     );

  //     return matchesSearch && matchesFilters;
  //   });
  // }, [data, debouncedSearchQuery, columnFilters]);

  useEffect(() => {
    dispatch(
      fetchPage({
        page: 1,
        searchQuery: debouncedSearchQuery,
        columnFilters,
        sort,
      })
    );
  }, [dispatch, debouncedSearchQuery, columnFilters, sort]);

  useEffect(() => {
    const scrollEl = parentRef.current;
    if (!scrollEl || !hasMore || loading) return;

    const handleScroll = () => {
      const bottomOffset =
        scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
      if (bottomOffset < 200 && !loading && hasMore) {
        dispatch(
          fetchPage({
            page: page + 1,
            searchQuery: debouncedSearchQuery,
            columnFilters,
            sort,
          })
        );
      }
    };

    scrollEl.addEventListener("scroll", handleScroll);
    return () => scrollEl.removeEventListener("scroll", handleScroll);
  }, [dispatch, page, hasMore, loading]);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => rowHeights[index] || 48,
    overscan: 5,
  });

  const colVirtualizer = useVirtualizer({
    horizontal: true,
    count: TOTAL_COLUMNS,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => colWidths[index] || 120,
  });

  const measureCell = useCallback(
    (row: number, col: number, el: HTMLDivElement | null) => {
      if (!el) return;

      const { height, width } = el.getBoundingClientRect();

      setRowHeights((prev) => {
        if (!prev[row] || prev[row] < height) {
          return { ...prev, [row]: Math.max(height, 48) };
        }
        return prev;
      });
      setColWidths((prev) => {
        if (!prev[col] || prev[col] < width) {
          return { ...prev, [col]: Math.max(width, 120) };
        }
        return prev;
      });
    },
    []
  );

  useEffect(() => {
    rowVirtualizer.measure();
  }, [rowHeights]);

  useEffect(() => {
    colVirtualizer.measure();
  }, [colWidths]);

  const toggleSort = (colIndex: number) => {
    const newDir =
      sort?.columnIndex === colIndex && sort.direction === "asc"
        ? "desc"
        : "asc";
    setSort({ columnIndex: colIndex, direction: newDir });
    setSortDropdownOpen(false);
    dispatch(sortTable({ columnIndex: colIndex, direction: newDir }));
  };

  const getUniqueColumnValues = (colIndex: number) => {
    const values = new Set<string>();
    data.forEach((row) => {
      if (["Video", "Audio"].includes(row.columns[colIndex].category))
        return row.columns[colIndex].data
          ?.split(",")
          .forEach((d) => values.add(d));
      return values.add(row.columns[colIndex].data);
    });
    return Array.from(values);
  };

  const renderCell = (value: string, colIndex: number, rowId: number) => {
    if (colIndex < VIDEO_COLUMN_COUNT) {
      const videoIds = value.split(",");
      return (
        <VideoStrip
          videoIds={videoIds}
          onOpen={openModal}
          width={colWidths[colIndex]}
          onContentLoad={(el) => {
            if (el) {
              measureCell(rowId, colIndex, el);
            }
          }}
        />
      );
    } else if (
      colIndex >= VIDEO_COLUMN_COUNT &&
      colIndex < VIDEO_COLUMN_COUNT + AUDIO_COLUMN_COUNT
    ) {
      const audioUrls = value.split(",");
      return (
        <AudioStrip
          audioUrls={audioUrls}
          width={colWidths[colIndex]}
          onContentLoad={(el) => {
            if (el) measureCell(rowId, colIndex, el);
          }}
        />
      );
    }

    return (
      <EditableCell
        rowId={rowId}
        colIndex={colIndex}
        initialValue={value}
        onContentChange={(el) => {
          if (el) {
            measureCell(rowId, colIndex, el);
          }
        }}
      />
    );
  };

  const openModal = (id: string) => setModalVideo(id);
  const closeModal = () => setModalVideo(null);

  const handleReset = () => {
    setSearchQuery("");
    setColumnFilters({});
    setSort(undefined);
    dispatch(clearSort());
  };

  return (
    <>
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search all columns"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          typeVariant="primary"
          onClick={() => {
            alert(
              "Currently data is filtered live, so didn't implement Apply. Large dataset usually needs to be filtered as minimal as possible"
            );
          }}
        >
          Apply
        </Button>
        <Button typeVariant="reset" ghost onClick={handleReset}>
          Reset
        </Button>
      </div>
      <div className={styles.sortBar}>
        <div className={styles.sortDropdownWrapper}>
          <button
            className={styles.sortTrigger}
            onClick={() => setSortDropdownOpen((prev) => !prev)}
          >
            Sort by :
            <strong>
              {sort?.columnIndex !== null && sort?.columnIndex !== undefined
                ? `Col ${sort?.columnIndex + 1}`
                : "None"}
            </strong>{" "}
            <span className={styles.sortArrow}>
              {sort?.direction === "asc" ? "↑" : "↓"}
            </span>
          </button>

          {sortDropdownOpen && (
            <div className={styles.sortDropdown}>
              {Array.from({ length: TOTAL_COLUMNS }, (_, i) => (
                <div
                  key={i}
                  className={styles.sortItem}
                  onClick={() => {
                    toggleSort(i);
                  }}
                >
                  Col {i + 1}
                  <span className={styles.sortIcon}>
                    {sort?.columnIndex === i
                      ? sort?.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div ref={parentRef} className={styles.tableContainer}>
        <div className={styles.header}>
          {Array.from({ length: TOTAL_COLUMNS }, (_, i) => (
            <div
              key={i}
              className={styles.headerCell}
              // onClick={() => toggleSort(i)}
              style={{
                width: colWidths[i],
              }}
            >
              Col {i + 1}{" "}
              {/* {sort?.col === i ? (sort.dir === "asc" ? "↑" : "↓") : ""} */}
              <FilterDropdown
                values={getUniqueColumnValues(i)}
                selected={columnFilters?.[i] || []}
                onChange={(newSelected) =>
                  setColumnFilters((prev) => ({
                    ...prev,
                    [i]: newSelected,
                  }))
                }
                placeholder={`Search Col ${i + 1}`}
                icon={<FilterIcon />}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: colVirtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={data[virtualRow.index].id}
              className={styles.tableRow}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                position: "absolute",
                top: 0,
                left: 0,
                height: virtualRow.size,
                width: "100%",
                display: "flex",
              }}
            >
              {colVirtualizer.getVirtualItems().map((virtualCol) => {
                const cellData =
                  data[virtualRow.index]?.columns[virtualCol.index]
                    .data;
                return (
                  <div
                    key={virtualCol.key}
                    data-row={data[virtualRow.index].id}
                    data-col={virtualCol.index}
                    className={styles.tableCell}
                    style={{
                      transform: `translateX(${virtualCol.start}px)`,
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: virtualCol.size,
                    }}
                  >
                    {renderCell(
                      cellData,
                      virtualCol.index,
                      data[virtualRow.index].id
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {loading && (
          <TableSkeleton rows={10} cols={TOTAL_COLUMNS} colWidths={colWidths} />
        )}
      </div>
      {modalVideo && (
        <Modal onClose={closeModal}>
          <iframe
            src={`https://www.youtube.com/embed/${modalVideo}`}
            allowFullScreen
            title="Video Player"
            tabIndex={0}
          />
        </Modal>
      )}
    </>
  );
};

export default VirtualizedTable;
