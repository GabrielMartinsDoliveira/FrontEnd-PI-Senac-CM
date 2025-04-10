import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cases from "../pages/cases/Cases";
import DetailsCases from "../pages/detailsCase/DetailsCase";
import Home from "../pages/home/Home";
import RegisterCase from "../pages/registerCase/RegisterCase";

export const RouterPages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path={"/casos"} element={<Cases />} />
        <Route path={"/caso/:id"} element={<DetailsCases />} />
        <Route path={"/cadastrar-caso"} element={<RegisterCase />} />
      </Routes>
    </BrowserRouter>
  );
};
