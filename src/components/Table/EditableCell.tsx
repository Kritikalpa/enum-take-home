import React, { useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateCell } from "../../features/table/tableSlice";
import styles from "./EditableCell.module.scss";

interface EditableCellProps {
  rowId: number;
  colIndex: number;
  initialValue: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  rowId,
  colIndex,
  initialValue,
}) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className={styles.cell}>
      {editing ? (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.input}
          />
          <div className={styles.actions}>
            <button onClick={save} disabled={saving}>
              Save
              {saving && <span className={styles.spinner} />}
            </button>
            <button onClick={cancel} disabled={saving}>
              Cancel
            </button>
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
