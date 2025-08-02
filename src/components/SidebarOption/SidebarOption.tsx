import React from "react";
import "./SidebarOption.css";

interface SidebarOptionProps {
  Icon?: React.ElementType;
  text: string;
}

const SidebarOption: React.FC<SidebarOptionProps> = ({ Icon, text }) => {
  return (
    <div className="sidebarOption">
      {Icon && <Icon className="sidebarOption__icon" />}
      <h3 className="sidebarOption__text">{text}</h3>
    </div>
  );
};

export default SidebarOption;
