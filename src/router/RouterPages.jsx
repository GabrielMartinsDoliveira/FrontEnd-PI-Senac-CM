import { Route, Routes } from "react-router-dom";
import Cases from "../pages/cases/Cases";
import DetailsCases from "../pages/detailsCase/DetailsCase";
import Home from "../pages/home/Home";
import RegisterCase from "../pages/registerCase/RegisterCase";
import Login from "../pages/login/Login";
import ProtectedRoute from "../components/protectedRoute/ProtectedRoute";
import RegisterUser from "../pages/registerUser/RegisterUser";
import RegisterEvidence from "../pages/ragisterEvidences/RegisterEvidence";
import DetailsEvidence from "../pages/detailsEvidence/DetailsEvidence";
import UpdateUser from "../pages/updateUser/UpdateUser";
import RegisterLaudo from "../pages/registerLaudo/RegisterLaudo";
import RegisterReport from "../pages/registerReport/RegisterReport";
import DetailsLaudo from "../pages/detailsLaudo/DetailsLaudo";
import DetailsReport from "../pages/detailsReport/DetailsReport";

export const RouterPages = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route element={<ProtectedRoute redirectPath="/" />}>
        <Route path={"/home"} element={<Home />} />
        <Route path={"/casos"} element={<Cases />} />
        <Route path={"/caso/:id"} element={<DetailsCases />} />
        <Route path={"/cadastrar-caso"} element={<RegisterCase />} />
        <Route
          path={"/cadastrar-evidencia/:idCaso"}
          element={<RegisterEvidence />}
        />
        <Route path={"/gerar-relatorio/:idCaso"} element={<RegisterReport />} />
        <Route path={"/relatorio/:idRelatorio"} element={<DetailsReport />} />
        <Route path={"/cadastrar-usuario"} element={<RegisterUser />} />
        <Route
          path={"/atualizar-usuario/:idUsuario"}
          element={<UpdateUser />}
        />
        <Route path={"/evidencia/:idEvidencia"} element={<DetailsEvidence />} />
        <Route path={"/gerar-laudo/:idEvidencia"} element={<RegisterLaudo />} />
        <Route path={"/laudo/:idLaudo"} element={<DetailsLaudo />} />
      </Route>
    </Routes>
  );
};
