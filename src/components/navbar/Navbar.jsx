import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [caseFlag, setCaseFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);

  const handleCaseFlag = () => {
    setCaseFlag(!caseFlag);
  };

  const handleUserFlag = () => {
    setUserFlag(!userFlag);
  };

  return (
    <nav>
      <div>
        <p onClick={() => handleCaseFlag()}>Casos</p>
        {caseFlag ? (
          <li>
            <Link to="/cadastrar-caso">
              <ul>Cadastrar Caso</ul>
            </Link>
            <Link to="/casos">
              <ul>Visualizar Casos</ul>
            </Link>
            {/* <Link to="/cadastrar-caso">
              <ul>Atualizar Casos</ul>
            </Link> */}
          </li>
        ) : null}
      </div>
      <div>
        <p onClick={() => handleUserFlag()}>Usuário</p>
        {userFlag ? (
          <li>
            <ul>Cadastrar Usuário</ul>
            <ul>Atualizar Dados</ul>
          </li>
        ) : null}
      </div>
      <div>
        <p>Logout</p>
      </div>
    </nav>
  );
};

export default Navbar;
