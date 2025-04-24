import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CasesGET, HeaderReq } from "../../api/PathsApi";
import { goToCaseDetails } from "../../router/Coordinator";
import { RiEditFill } from "react-icons/ri";
import "./CaseStyled.css";
import axios from "axios";

function Cases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const getCases = async () => {
    try {
      const response = await axios(CasesGET, {
        headers: HeaderReq(token),
      });
      setCases(response.data);
    } catch (error) {
      console.error("Erro ao buscar casos:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToCase = (id) => {
    goToCaseDetails(navigate, id);
  };

  useEffect(() => {
    getCases();
  }, []);

  const filteredCases = cases.filter((item) => {
    const matchesResponsible = item.responsavel.nome
      .toLowerCase()
      .includes(responsibleFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const matchesDate = !dateFilter || 
      new Date(item.dataAbertura).toISOString().split('T')[0] === dateFilter;

    return matchesResponsible && matchesStatus && matchesDate;
  });

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const clearDateFilter = () => {
    setDateFilter("");
  };

  return (
    <div id="case-page-container">
      <h2>Casos</h2>
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
            placeholder="Filtrar por responsável"
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos status</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Arquivado">Arquivado</option>
          </select>
        </div>

        <div className="filter-group date-filter-group">
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="filter-input"
          />
          {dateFilter && (
            <button 
              onClick={clearDateFilter}
              className="clear-date-filter"
              title="Limpar filtro de data"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header flex-row-container">
          <div className="header-cell">ID</div>
          <div className="header-cell">RESPONSÁVEL</div>
          <div className="header-cell">DATA ABERTURA</div>
          <div className="header-cell">STATUS</div>
          <div className="header-cell">AÇÕES</div>
        </div>

        {isLoading ? (
          <div className="loading-message">Carregando casos...</div>
        ) : filteredCases.length === 0 ? (
          <div className="no-results">Nenhum caso encontrado</div>
        ) : (
          filteredCases.map((caso, index) => (
            <div className="case-row flex-row-container" key={caso._id}>
              <div className="case-cell">{index + 1}</div>
              <div className="case-cell">{caso.responsavel.nome}</div>
              <div className="case-cell">
                {new Date(caso.dataAbertura).toLocaleDateString("pt-BR")}
              </div>
              <div className="case-cell">
                <span className={`status-badge ${caso.status.toLowerCase().replace(" ", "-")}`}>
                  {caso.status}
                </span>
              </div>
              <div className="case-cell actions-cell">
                <RiEditFill 
                  onClick={() => handleGoToCase(caso._id)} 
                  className="edit-icon" 
                  title="Editar caso"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Cases;