export const goToHome = (navigate) => {
  navigate("/home");
};

export const goToLogin = (navigate) => {
  navigate("/");
};

export const goToSignUp = (navigate) => {
  navigate("/registrar-usuario");
};

export const goToCases = (navigate) => {
  navigate("/casos");
};

export const goToCaseDetails = (navigate, id) => {
  navigate(`/caso/${id}`);
};

export const goToRegisterCase = (navigate) => {
  navigate("/cadastrar-caso");
};

export const goToEvidence = (navigate, id) =>{
    navigate(`/evidencia/${id}`)
}

export const goToRegisterEvidence = (navigate, caseId) =>{
  navigate(`/cadastrar-evidencia/${caseId}`)
}

export const goToLaudo = (navigate, idEvidencia) =>{
  navigate(`/gerar-laudo/${idEvidencia}`)
}

export const goToReport = (navigate, caseId) =>{
  navigate(`/gerar-relatorio/${caseId}`)
}