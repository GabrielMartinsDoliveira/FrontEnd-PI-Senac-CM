import React from "react";

import { useState } from "react";

function EditEvidenceForm({ formData, onChange, onCancel, onSubmit, error }) {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileError, setFileError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validação básica dos arquivos
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 10MB max
        setFileError(`Arquivo ${file.name} excede o tamanho máximo de 5MB`);
        return false;
      }
      return true;
    });

    setFiles([...files, ...validFiles]);
    setFileError(null);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSubmitWithFiles = async (e) => {
    e.preventDefault();

    try {
      if (files.length > 0) {
        const formDataWithFiles = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (key === "localColeta") {
            formDataWithFiles.append("localColeta[latitude]", value.latitude);
            formDataWithFiles.append("localColeta[longitude]", value.longitude);
          } else {
            formDataWithFiles.append(key, value);
          }
        });

        files.forEach((file, index) => {
          formDataWithFiles.append("arquivos", file);
        });

        await onSubmit(formDataWithFiles);
      } else {
        await onSubmit(formData);
      }
    } catch (err) {
      console.error("Erro ao enviar arquivos:", err);
      setFileError("Erro ao enviar arquivos. Tente novamente.");
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange({
            target: {
              name: "localColeta.latitude",
              value: position.coords.latitude.toFixed(6),
            },
          });
          onChange({
            target: {
              name: "localColeta.longitude",
              value: position.coords.longitude.toFixed(6),
            },
          });
        },
        (error) => {
          console.error("Erro ao obter localização:", error.message);
          alert("Erro ao obter localização: " + error.message);
        }
      );
    } else {
      alert("Geolocalização não suportada pelo navegador.");
    }
  };

  return (
    <div className="edit-evidence-form">
      <h2>Editar Evidência</h2>

      {error && <div className="form-error">{error}</div>}
      {fileError && <div className="form-error">{fileError}</div>}

      <form onSubmit={handleSubmitWithFiles}>
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
              value={formData.localColeta.latitude || ""}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>Longitude:</label>
            <input
              type="number"
              step="any"
              name="localColeta.longitude"
              value={formData.localColeta.longitude || ""}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button
              type="button"
              className="btn btn-info mb-3"
              onClick={handleGeolocation}
            >
              Usar minha localização atual
            </button>
          </div>
        </div>

        <div className="form-group">
          <h3>Documentos Anexados</h3>

          {formData.arquivos && formData.arquivos.length > 0 && (
            <div className="existing-files">
              <h4>Documentos existentes:</h4>
              <ul>
                {formData.arquivos.map((file, index) => (
                  <li key={index}>
                    <a
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="file-upload">
            <label>Adicionar Documentos:</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            />
            <small>Formatos aceitos: PDF, DOC, JPG, PNG (Max. 5MB cada)</small>
          </div>

          {files.length > 0 && (
            <div className="file-preview">
              <h4>Novos documentos:</h4>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name} ({Math.round(file.size / 1024)} KB)
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="remove-file"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button className="btn btn-primary" type="submit">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEvidenceForm;
