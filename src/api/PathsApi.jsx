const apiUrl = "http://localhost:3000/api";

export const CasesGET = `${apiUrl}/case`;

export const CasePOST = `${apiUrl}/case`;

export const CasesDetailsGET = `${apiUrl}/case`;

export const CaseUpdatePUT = `${apiUrl}/case`;

export const UserPOST = `${apiUrl}/user`;

export const UserLoginPOST = `${apiUrl}/user`;

export const UserByIdGET = `${apiUrl}/user`;

export const EvidencesGET = `${apiUrl}/evidence`;

export const EvidenceDetailsGET = `${apiUrl}/evidence`;

export const EvidencePUT = `${apiUrl}/evidence`;

export const EvidencePOST = `${apiUrl}/evidence`;

export const LoginPOST = `${apiUrl}/login`;

export const UserPUT = `${apiUrl}/user`;

export const LaudoPOST = `${apiUrl}/laudo`;

export const LaudoGET = `${apiUrl}/laudo`;

export const HeaderReq = (token) => {
  const header = {
    Authorization: `Bearer ${token}`,
  };

  return header;
};
