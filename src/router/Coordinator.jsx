export const goToHome = (navigate) => {
    navigate('/');
}

export const goToLogin = (navigate) => {
    navigate('/login');
}

export const goToSignUp = (navigate) => {
    navigate('/registrar');
}

export const goToCases = (navigate) => {
    navigate('/casos');
}

export const goToCase = (navigate, id) => {
    console.log('URL gerada:', `/caso/${id}`)
    navigate(`/caso/${id}`);
}

export const goToRegisterCase = (navigate) => {
    navigate('/cadastrar-caso');
}
