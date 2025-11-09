import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';

const PrescriptionUpload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG',
    'image/png': 'PNG',
    'image/heic': 'HEIC',
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    const errors = [];

    if (!ALLOWED_TYPES[file.type]) {
      errors.push(`${file.name}: Invalid file type. Only PDF and image files (JPG, PNG, HEIC) are allowed.`);
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: File too large. Maximum size is 10MB.`);
    }

    return errors;
  };

  const processFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    const validationErrors = [];
    const validFiles = [];

    newFiles.forEach((file) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        validationErrors.push(...fileErrors);
      } else {
        // Convert file to base64 for storage
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result, // Base64 data
            preview: file.type.startsWith('image/') ? e.target.result : null,
          };
          validFiles.push(fileData);
          
          // Update files state after all files are processed
          if (validFiles.length === newFiles.length - validationErrors.length) {
            setFiles((prev) => [...prev, ...validFiles]);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setErrors(validationErrors);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    processFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    processFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    files.forEach((file) => {
      onUpload(file);
    });
    setFiles([]);
    setErrors([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <Image className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.heic"
          onChange={handleFileInput}
          className="hidden"
        />

        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-600'}`} />
        
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isDragging ? 'Drop files here' : 'Drag and drop prescription files'}
        </p>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          or click to browse
        </p>

        <div className="flex flex-wrap gap-2 justify-center">
          {Object.values(ALLOWED_TYPES).map((type) => (
            <span
              key={type}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
            >
              {type}
            </span>
          ))}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
          Maximum file size: 10MB
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Upload Errors
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* File Preview List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Files Ready to Upload ({files.length})
          </h4>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                {/* File Icon or Preview */}
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded">
                    {getFileIcon(file.type)}
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {ALLOWED_TYPES[file.type]} • {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Status Icon */}
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            className="w-full"
            variant="primary"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload {files.length} File{files.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionUpload;
