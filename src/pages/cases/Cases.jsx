import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useEffect, useState } from "react";
import { CasesGET } from "../../api/PathsApi";
import { goToCase } from "../../router/Coordinator";

function Cases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // const [dateFilter, setDateFilter] = useState("");

  const getCases = async () => {
    try {
      const response = await fetch(`${CasesGET}`);
      const data = await response.json();
      setCases(data);
    } catch (error) {
      console.log(error.data.message);
    }
  };

  const handleGoToCase = (id) => {
    console.log("ID antes da navegação:", id, "Tipo:", typeof id);
    goToCase(navigate, id);
  };

  useEffect(() => {
    console.log(cases)
    getCases();
  }, []);

  const allCases =
    Array.isArray(cases) &&
    cases.map((caso) => (
      <div key={caso?._id} onClick={() => handleGoToCase(caso?._id)}>
        <p>Titulo: {caso.titulo}</p>
        <p>Descrição: {caso.descricao}</p>
        <p>Status: {caso.status}</p>
        <p>Responsável: {caso.responsavel.nome}</p>
        <p>Data Abertura: {caso.dataAbertura}</p>
        <p>Data Fechamento: {caso.dataFechamento}</p>
        <button>Editar</button>
      </div>
    ));

  const filteredCases =
    cases &&
    cases.filter((item) => {
      const matchesResponsible = item.responsavel.nome
        .toLowerCase()
        .includes(responsibleFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesResponsible && matchesStatus;
    });

  console.log(filteredCases);

  const displayFilteredCases =
    Array.isArray(filteredCases) &&
    filteredCases.map((caso) => (
      <div key={caso?.id} onClick={() => handleGoToCase(caso.id)}>
        <p>Titulo: {caso.titulo}</p>
        <p>Descrição: {caso.descricao}</p>
        <p>Status: {caso.status}</p>
        <p>Responsável: {caso.responsavel.nome}</p>
        <p>Data Abertura: {caso.dataAbertura}</p>
        <p>Data Fechamento: {caso.dataFechamento}</p>
        <button>Editar</button>
      </div>
    ));

  return (
    <div>
      <Header />
      <Navbar />
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="responsibleFilter">Filtrar por Responsavel:</label>
          <input
            id="responsibleFilter"
            type="text"
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
            placeholder="Digite o responsavel pelo caso"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="statusFilter">Filtrar por Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Status</option>
            {filteredCases.map((caso) => (
              <option value={caso.status}>{caso.status}</option>
            ))}
          </select>
        </div>
        {cases ? (filteredCases ? displayFilteredCases : allCases) : null}
      </div>
    </div>
  );
}

export default Cases;
