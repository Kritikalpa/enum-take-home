import React, { useState, useRef, type ReactNode } from "react";
import styles from "./FilterDropdown.module.scss";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface FilterDropdownProps {
  values: string[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
  placeholder?: string;
  icon?: ReactNode;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  values,
  selected,
  onChange,
  placeholder = "Search...",
  icon,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    setOpen(false);
  });

  const toggleValue = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const filtered = values.filter(
    (v) => v && v.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.filterWrapper} ref={ref}>
      <button
        className={styles.filterIconButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        {icon}
      </button>
      {open && (
        <div className={styles.dropdown}>
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.dropdownSearchInput}
          />
          <div className={styles.dropdownList}>
            {filtered.map((val) => (
              <div
                key={val}
                className={`${styles.dropdownItem} ${
                  selected.includes(val) ? styles.selected : ""
                }`}
                onClick={() => toggleValue(val)}
              >
                <span className={styles.truncate}>{val}</span>
                {selected.includes(val) && <span>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
