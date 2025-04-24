import { BrowserRouter } from "react-router-dom";
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import { RouterPages } from "./router/RouterPages";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />
      <RouterPages />;
    </BrowserRouter>
  );
}

export default App;
