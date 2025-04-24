import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Report = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const reportData = {
        ...data,
        dataCriacao: new Date(),
      };

      const response = await axios.post('/api/reports', reportData);
      console.log('Relatório criado:', response.data);
      navigate('/reports');
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
    }
  };

  return (
    <div className="container " style={{
      minHeight: "80vh",
      marginTop: "12vh",
      marginLeft: "12vw",
      paddingTop: "6vh",
      paddingLeft: "2vw",
      backgroundColor: "#dee1eb",
      border: "2px solid #0000009d",
      width: "90vw"
    }}>
      <div className="card shadow-sm">
        <div className="card-body" style={{backgroundColor: "#dee1eb",}}>
          <h1 className="card-title text-center mb-4">Criar Novo Relatório</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Título */}
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">Título</label>
              <input
                id="titulo"
                type="text"
                className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                {...register('titulo', { required: 'Título é obrigatório' })}
              />
              {errors.titulo && (
                <div className="invalid-feedback">{errors.titulo.message}</div>
              )}
            </div>

            {/* Conteúdo */}
            <div className="mb-3">
              <label htmlFor="conteudo" className="form-label">Conteúdo</label>
              <textarea
                id="conteudo"
                rows={6}
                className={`form-control ${errors.conteudo ? 'is-invalid' : ''}`}
                {...register('conteudo', { required: 'Conteúdo é obrigatório' })}
              />
              {errors.conteudo && (
                <div className="invalid-feedback">{errors.conteudo.message}</div>
              )}
            </div>

            {/* Perito Responsável */}
            <div className="mb-3">
              <label htmlFor="peritoResponsavel" className="form-label">Perito Responsável (ID)</label>
              <input
                id="peritoResponsavel"
                type="text"
                className={`form-control ${errors.peritoResponsavel ? 'is-invalid' : ''}`}
                {...register('peritoResponsavel', { required: 'Perito responsável é obrigatório' })}
              />
              {errors.peritoResponsavel && (
                <div className="invalid-feedback">{errors.peritoResponsavel.message}</div>
              )}
            </div>

            {/* Caso Reportado */}
            <div className="mb-4">
              <label htmlFor="casoReportado" className="form-label">Caso Relacionado (ID)</label>
              <input
                id="casoReportado"
                type="text"
                className={`form-control ${errors.casoReportado ? 'is-invalid' : ''}`}
                {...register('casoReportado', { required: 'Caso relacionado é obrigatório' })}
              />
              {errors.casoReportado && (
                <div className="invalid-feedback">{errors.casoReportado.message}</div>
              )}
            </div>

            {/* Botões */}
            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar Relatório
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
