import React from "react";
import styles from "./TableSkeleton.module.scss";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  colWidths?: Record<number, number>;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 10,
  cols = 10,
  colWidths = {},
}) => {
  return (
    <div className={styles.skeletonTable}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className={styles.skeletonRow}>
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={styles.skeletonCell}
              style={{ width: (colWidths[colIdx] || 120) - 8 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
