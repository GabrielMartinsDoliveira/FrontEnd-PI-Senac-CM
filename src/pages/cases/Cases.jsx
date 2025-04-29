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

    const matchesDate =
      !dateFilter ||
      new Date(item.dataAbertura).toISOString().split("T")[0] === dateFilter;

    return matchesResponsible && matchesStatus && matchesDate;
  });

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const clearDateFilter = () => {
    setDateFilter("");
  };

  return (
    <div className="container-fluid pt-4" id="case-page-container">
      <h2 className="mb-4">Casos</h2>

      <div className="row g-3 filters-container mb-4">
        <div className="col-12 col-md-4">
          <input
            type="text"
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
            placeholder="Filtrar por responsável"
            className="form-control"
          />
        </div>

        <div className="col-12 col-md-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">Todos status</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Arquivado">Arquivado</option>
          </select>
        </div>

        <div className="col-12 col-md-4 position-relative">
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="form-control"
          />
          {dateFilter && (
            <button
              onClick={clearDateFilter}
              className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0"
              title="Limpar filtro de data"
              style={{ fontSize: "1.2rem" }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive table-container">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Responsável</th>
              <th scope="col">Data Abertura</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  Carregando casos...
                </td>
              </tr>
            ) : filteredCases.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  Nenhum caso encontrado
                </td>
              </tr>
            ) : (
              filteredCases.map((caso, index) => (
                <tr key={caso._id}>
                  <td>{index + 1}</td>
                  <td>{caso.responsavel.nome}</td>
                  <td>
                    {new Date(caso.dataAbertura).toLocaleDateString("pt-BR")}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(caso.status)}`}>
                      {caso.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <RiEditFill
                      onClick={() => handleGoToCase(caso._id)}
                      className="edit-icon"
                      title="Editar caso"
                      role="button"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case "Em andamento":
      return "bg-warning text-dark";
    case "Finalizado":
      return "bg-success";
    case "Arquivado":
      return "bg-secondary";
    default:
      return "bg-light text-dark";
  }
}

export default Cases;
