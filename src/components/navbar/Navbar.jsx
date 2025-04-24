import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { FaUserGear } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import "./Navbar.css";
import { goToHome } from "../../router/Coordinator";
import { HeaderReq, UserByIdGET } from "../../api/PathsApi";
import axios from "axios";

const Navbar = () => {
  const [caseFlag, setCaseFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const getRoleUser = async () => {
    try {
      const response = await axios.get(`${UserByIdGET}/${userId}`, {
        headers: HeaderReq(token),
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Erro ao obter role do usuário:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoleUser();
  });

  if (loading) return <div>Carregando...</div>;

  const navStyles = {
    nav: {
      top: "12vh",
      left: 0,
      bottom: 0,
      width: "12vw",
      zIndex: 100,
      paddingTop: "20px",
    },
    navItem: (isActive) => ({
      backgroundColor: isActive ? "#2c3e50" : "#ffffff",
      color: isActive ? "#ffffff" : "#2c3e50",
      transition: "all 0.3s ease",
    }),
    icon: (isActive) => ({
      color: isActive ? "#ffffff" : "#2c3e50",
    }),
  };

  const caseItems = [
    {
      path: "/cadastrar-caso",
      label: "Cadastrar Caso",
      roles: ["admin", "perito"],
    },
    {
      path: "/casos",
      label: "Visualizar Casos",
      roles: ["admin", "perito", "assistente"],
    },
  ];

  const userItems = [
    {
      path: "/cadastrar-usuario",
      label: "Cadastrar Usuário",
      roles: ["admin"],
    },
    {
      path: `/atualizar-usuario/${userId}`,
      label: "Atualizar Dados",
      roles: ["admin", "perito", "assistente"],
    },
  ];

  const filteredCaseItems = caseItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const filteredUserItems = userItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <nav
      className="bg-white shadow-sm d-flex flex-column position-fixed"
      style={navStyles.nav}
    >
      {/* Menu Casos */}
      <div className="w-100 text-center" style={navStyles.navItem(caseFlag)}>
        <div
          onClick={() => setCaseFlag(!caseFlag)}
          className="w-100 py-2 px-3 d-flex align-items-center gap-6"
          role="button"
          style={{ color: caseFlag ? "#ffffff" : "#2c3e50" }}
        >
          <IoDocumentText size={24} style={navStyles.icon(caseFlag)} />
          <p className="mb-0" style={navStyles.icon(caseFlag)}>
            CASOS
          </p>
        </div>

        {caseFlag && filteredCaseItems.length > 0 && (
          <ul className="list-unstyled">
            {filteredCaseItems.map((item) => (
              <li key={item.path}>
                <Link
                  style={{ color: "#2c3e50" }}
                  to={item.path}
                  className="text-decoration-none d-block px-3 py-1 bg-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Menu Usuário */}
      <div className="w-100 text-center" style={navStyles.navItem(userFlag)}>
        <div
          onClick={() => setUserFlag(!userFlag)}
          className="w-100 py-2 px-3 d-flex align-items-center gap-2"
          role="button"
          style={{ color: userFlag ? "#ffffff" : "#2c3e50" }}
        >
          <FaUserGear size={24} style={navStyles.icon(userFlag)} />
          <p className="mb-0" style={navStyles.icon(userFlag)}>
            USUÁRIO
          </p>
        </div>

        {userFlag && filteredUserItems.length > 0 && (
          <ul className="list-unstyled">
            {filteredUserItems.map((item) => (
              <li key={item.path}>
                <Link
                  style={{ color: "#2c3e50" }}
                  to={item.path}
                  className="text-decoration-none d-block px-3 py-1 bg-light"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Itens fixos (não dependem de role) */}
      <div className="w-100 text-center">
        <div
          onClick={() => goToHome(navigate)}
          className="w-100 py-2 px-3 d-flex align-items-center gap-2 text-dark"
          role="button"
        >
          <MdDashboard size={24} />
          <p className="mb-0">DASHBOARD</p>
        </div>
      </div>

      <div className="w-100 text-center">
        <div
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/");
          }}
          className="w-100 py-2 px-3 d-flex align-items-center gap-2 text-dark"
          role="button"
        >
          <BiLogOut size={24} />
          <p className="mb-0">SAIR</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
