import { useForm } from "react-hook-form";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./RegisterCaseStyled.css";
import axios from "axios";
import { CasePOST, UserByIdGET } from "../../api/PathsApi";
import { useEffect, useState } from "react";

const RegisterCase = () => {
  const [userCase, setUserCase] = useState(null);
  const userIdMock = '67fdc9b6f73bf8431a3d0592';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(CasePOST, data);
      console.log(`Caso Criado com sucesso ${response.data}`);
    } catch (error) {
      console.error('Erro ao criar caso:', error);
    }
  };

  const getUserCase = async () => {
    try {
      const response = await axios.get(`${UserByIdGET}/${userIdMock}`);
      setUserCase(response.data);
      setValue('responsavel', response.data._id); // Preenche o valor do campo
    } catch (error) {
      console.error('Erro ao achar o usuário:', error);
    }
  };

  useEffect(() => {
    getUserCase();

    // Preenche a data de abertura automaticamente
    const hoje = new Date().toISOString().split('T')[0];
    setValue('dataAbertura', hoje);
  }, [setValue]);

  return (
    <>
    <Header/>
    <Navbar/>
      <div id="form-container">
        <h1 id="form-title">Criar Novo Caso</h1>

        <form id="case-form" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="responsavel">Responsável</label>
            <select
              id="responsavel"
              disabled
              {...register('responsavel', { required: true })}
            >
              {userCase ? (
                <option value={userCase._id}>
                  {userCase.nome || 'Usuário'}
                </option>
              ) : (
                <option value="">Carregando responsável...</option>
              )}
            </select>
            {errors.responsavel && <p>Responsável é obrigatório.</p>}
          </div>

          <div>
            <label htmlFor="status">Status</label>
            <select id="status" {...register('status', { required: true })}>
              <option value="">Selecione um Status</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Arquivado">Arquivado</option>
            </select>
            {errors.status && <p>Status é obrigatório.</p>}
          </div>

          <div>
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              {...register('titulo', { required: 'Título é obrigatório' })}
            />
            {errors.titulo && <p>{errors.titulo.message}</p>}
          </div>

          <div>
            <label htmlFor="dataAbertura">Data de Abertura</label>
            <input
              type="date"
              id="dataAbertura"
              readOnly
              {...register('dataAbertura', { required: true })}
            />
          </div>

          <div>
            <label htmlFor="dataFechamento">Data de Fechamento</label>
            <input
              type="date"
              id="dataFechamento"
              disabled
              {...register('dataFechamento')}
            />
          </div>

          <div id="evidence-button-container">
            <button id="evidence-button" type="button">
              Cadastrar Evidência
            </button>
          </div>

          <div id="description-container">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              {...register('descricao', {
                required: 'Descrição é obrigatória',
              })}
            />
            {errors.descricao && <p>{errors.descricao.message}</p>}
          </div>

          <button id="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Criar Caso'}
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterCase;
