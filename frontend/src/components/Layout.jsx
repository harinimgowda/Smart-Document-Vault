import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={styles.main}>
        <Topbar />
        {children}
      </div>
    </div>
  );
}

const styles = {
  main: {
    marginLeft: "230px",
    padding: "30px",
    width: "100%",
  },
};

export default Layout;
