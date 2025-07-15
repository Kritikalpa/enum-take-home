import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateCell } from "../../features/table/tableSlice";
import styles from "./EditableCell.module.scss";
import Button from "../Shared/Button/Button";

interface EditableCellProps {
  rowId: number;
  colIndex: number;
  initialValue: string;
  onContentChange?: (el: HTMLDivElement | null) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  rowId,
  colIndex,
  initialValue,
  onContentChange,
}) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const save = async () => {
    setSaving(true);
    setError(null);

    const simulateFailure = Math.random() < 0.3;

    const prevValue = initialValue;
    dispatch(updateCell({ rowId, colIndex, value }));

    await new Promise((res) => setTimeout(res, 1000));
    if (simulateFailure) {
      dispatch(updateCell({ rowId, colIndex, value: prevValue }));
      setError("Failed to save. Please try again.");
    } else {
      setEditing(false);
    }
    setSaving(false);
  };

  const cancel = () => {
    setValue(initialValue);
    setEditing(false);
  };

  useEffect(() => {
    if (containerRef.current && onContentChange && !editing) {
      onContentChange(containerRef.current);
    }
  }, [initialValue, editing]);

  return (
    <div ref={containerRef} className={styles.cell}>
      {editing ? (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.input}
          />
          <div className={styles.actions}>
            <Button
              typeVariant="primary"
              onClick={save}
              disabled={saving}
              loading={saving}
            >
              Save
            </Button>
            <Button
              typeVariant="reset"
              ghost
              onClick={cancel}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </>
      ) : (
        <div onClick={() => setEditing(true)} className={styles.value}>
          {value}
        </div>
      )}
    </div>
  );
};

export default EditableCell;
