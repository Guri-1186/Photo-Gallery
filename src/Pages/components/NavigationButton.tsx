import React from "react";
import { useNavigate } from "react-router-dom";

interface NavigationButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  to,
  children,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default NavigationButton;
