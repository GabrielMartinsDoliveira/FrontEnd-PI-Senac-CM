import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useEffect, useState } from "react";
import { CasesGET } from "../../api/PathsApi";
import { goToCase } from "../../router/Coordinator";
import { RiEditFill, RiDeleteBin6Fill } from "react-icons/ri";
import './CaseStyled.css'

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
    console.log(cases);
    getCases();
  }, []);

  const allCases =
    Array.isArray(cases) &&
    cases.map((caso) => (
      <div class="flex-row-container cases-container" key={caso?._id}>
        <p>{cases.indexOf(caso) + 1}</p>
        <p> {caso.responsavel.nome}</p>
        <p> {caso.dataAbertura}</p>
        <p> {caso.status}</p>
        <div class="flex-row-container icons-config">
          <RiEditFill onClick={() => handleGoToCase(caso._id)} />
          <RiDeleteBin6Fill />
        </div>
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
      <div class="flex-row-container cases-container" key={caso?._id}>
        <p>{filteredCases.indexOf(caso) + 1}</p>
        <p> {caso.responsavel.nome}</p>
        <p> {caso.dataAbertura}</p>
        <p> {caso.status}</p>
        <div class="flex-row-container icons-config">
          <RiEditFill onClick={() => handleGoToCase(caso._id)} />
          <RiDeleteBin6Fill />
        </div>
      </div>
    ));

  return (
    <>
      <Header />
      <Navbar />
      <div id="case-page-container">

      <div class="filters">
        {/* <div class="filter-group">
          <label htmlFor="responsibleFilter">Filtrar por Responsavel:</label>
          <input
            id="responsibleFilter"
            type="text"
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
            placeholder="Digite o responsavel pelo caso"
          />
        </div>

        <div class="filter-group">
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
        </div> */}
        <div class="flex-row-container label-bg">
          <h3>ID</h3>
          <h3>RESPONSÁVEL</h3>
          <h3>DATA ABERTURA</h3>
          <h3>STATUS</h3>
          <h3>GERENCIAR</h3>
        </div>
        {cases ? (filteredCases ? displayFilteredCases : allCases) : null}
      </div>
      </div>
    </>
  );
}

export default Cases;
