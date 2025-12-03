import { Outlet } from "react-router-dom";
import Header from "../copmonents/Header";

const MainLayout = () => {
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
