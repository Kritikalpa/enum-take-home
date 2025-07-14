import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  typeVariant?: "primary" | "reset";
  ghost?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  typeVariant = "primary",
  ghost = false,
  className,
  children,
  ...rest
}) => {
  const ghostClass = ghost
    ? typeVariant === "primary"
      ? styles.ghostPrimary
      : styles.ghostReset
    : "";

  return (
    <button
      className={classNames(
        styles.button,
        styles[typeVariant],
        { [styles.ghost]: ghost },
        ghostClass,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
