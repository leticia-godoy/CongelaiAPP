import React from "react";
import SidebarOption from "../SidebarOption/SidebarOption.tsx";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <AcUnitIcon fontSize="large" className="sidebar__logo" />
      <SidebarOption Icon={HomeIcon} text="Início" />
      <SidebarOption Icon={SearchIcon} text="Buscar" />
      <SidebarOption Icon={PersonIcon} text="Perfil" />
    </div>
  );
};

export default Sidebar;
