import { useEffect, useState } from "react";
import { CasesGET, HeaderReq } from "../../api/PathsApi";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { goToCaseDetails } from "../../router/Coordinator";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const getCases = async () => {
    try {
      const response = await axios(`${CasesGET}`, {
        headers: HeaderReq(token),
      });

      setCases(response.data);
      console.log("API DATA:", response.data);
    } catch (error) {
      console.log(error.data.message);
    }
  };

  const handleGoToCase = (id) => {
    goToCaseDetails(navigate, id);
  };

  const recentCases =
    Array.isArray(cases) &&
    cases.map((caso) => (
      <div key={caso?._id} onClick={() => handleGoToCase(caso._id)}>
        <p>Titulo: {caso.titulo}</p>
        <p>Descrição: {caso.descricao}</p>
        <p>Status: {caso.status}</p>
        <p>Responsável: {caso.responsavel.nome}</p>
        <p>Data Abertura: {caso.dataAbertura}</p>
        <p>Data Fechamento: {caso.dataFechamento}</p>
        <button>Editar</button>
      </div>
    ));

  console.log(cases);
  console.log(recentCases);

  useEffect(() => {
    getCases();
  }, []);

  return (
    <>
      <Header />
      <Navbar />
      <div>
        <h3>Resumo Estatísticas:</h3>
      </div>
      <div>
        <h3>Últimos casos Cadastrados</h3>:{cases ? recentCases : null}
      </div>
    </>
  );
};

export default Home;
