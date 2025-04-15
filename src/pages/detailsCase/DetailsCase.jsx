import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CasesDetailsGET } from "../../api/PathsApi";
import { goToCases } from "../../router/Coordinator";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";

function DetailsCases() {
  const { id } = useParams();
  const [caseDetail, setCaseDetail] = useState(null);
  const navigate = useNavigate();
  console.log(id);

  const loadCase = async () => {
    try {
      const response = await fetch(`${CasesDetailsGET}/${id}`);
      const data = await response.json();
      setCaseDetail(data);
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  };

  const handleReturnCases = () => {
    goToCases(navigate);
  };

  useEffect(() => {
    if (id) {
      setTimeout(() => {
        loadCase();
        console.log(caseDetail);
      }, 1000);
    }
  }, [id]);

  return (
    <>
      <Header />
      <Navbar />
      {caseDetail ? (
        <div>
          <p>Titulo: {caseDetail.titulo}</p>
          <p>Descrição: {caseDetail.descricao}</p>
          <p>Status: {caseDetail.status}</p>
          <p>Responsável: {caseDetail?.responsavel?.nome}</p>
          <p>
            Data Abertura:{" "}
            {new Date(caseDetail.dataAbertura).toLocaleDateString()}
          </p>
          <p>Data Fechamento: {caseDetail.dataFechamento || "N/A"}</p>
          <button>Editar</button>
          <button onClick={handleReturnCases}>Voltar</button>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </>
  );
}

export default DetailsCases;
