import React from "react";


function EditEvidenceForm({ formData, onChange, onCancel, onSubmit, error }) {
  return (
    <div className="edit-evidence-form">
      <h2>Editar Evidência</h2>
      
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Tipo:</label>
          <input
            type="text"
            name="tipo"
            value={formData.tipo}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={onChange}
            required
            rows={5}
          />
        </div>

        <div className="form-group">
          <label>Data de Coleta:</label>
          <input
            type="date"
            name="dataColeta"
            value={formData.dataColeta}
            onChange={onChange}
            required
          />
        </div>

        <div className="location-fields">
          <h3>Localização da Coleta</h3>
          
          <div className="form-group">
            <label>Latitude:</label>
            <input
              type="number"
              step="any"
              name="localColeta.latitude"
              value={formData.localColeta.latitude}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>Longitude:</label>
            <input
              type="number"
              step="any"
              name="localColeta.longitude"
              value={formData.localColeta.longitude}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit">Salvar Alterações</button>
        </div>
      </form>
    </div>
  );
}

export default EditEvidenceForm;