import { Outlet } from "react-router-dom";
import Header from "../copmonents/Header";
import { FC } from "react";

const MainLayout: FC = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        {/* Outlet  может быть полезным, когда у нас большая вложенность роутов */}
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;
