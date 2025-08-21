// "use client";

// import React, { useState, useCallback, useEffect } from 'react';
// import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download, Search, Zap } from 'lucide-react';

// // Types
// interface Client {
//   ClientID: string;
//   ClientName: string;
//   PriorityLevel: number;
//   RequestedTaskIDs: string[];
//   GroupTag: string;
//   AttributesJSON: any;
// }

// interface Worker {
//   WorkerID: string;
//   WorkerName: string;
//   Skills: string[];
//   AvailableSlots: number[];
//   MaxLoadPerPhase: number;
//   WorkerGroup: string;
//   QualificationLevel: string;
// }

// interface Task {
//   TaskID: string;
//   TaskName: string;
//   Category: string;
//   Duration: number;
//   RequiredSkills: string[];
//   PreferredPhases: number[];
//   MaxConcurrent: number;
// }

// interface ValidationError {
//   id: string;
//   type: 'error' | 'warning';
//   entity: 'client' | 'worker' | 'task';
//   entityId: string;
//   field?: string;
//   message: string;
//   suggestion?: string;
// }

// // Sample data for immediate testing
// const sampleClients: Client[] = [
//   {
//     ClientID: 'C001',
//     ClientName: 'Acme Corp',
//     PriorityLevel: 5,
//     RequestedTaskIDs: ['T001', 'T002'],
//     GroupTag: 'Enterprise',
//     AttributesJSON: { budget: 50000, region: 'US' }
//   },
//   {
//     ClientID: 'C002',
//     ClientName: 'Beta LLC',
//     PriorityLevel: 3,
//     RequestedTaskIDs: ['T003'],
//     GroupTag: 'SMB',
//     AttributesJSON: { budget: 25000, region: 'EU' }
//   }
// ];

// const sampleWorkers: Worker[] = [
//   {
//     WorkerID: 'W001',
//     WorkerName: 'John Doe',
//     Skills: ['JavaScript', 'React', 'TypeScript'],
//     AvailableSlots: [1, 2, 3],
//     MaxLoadPerPhase: 8,
//     WorkerGroup: 'Frontend',
//     QualificationLevel: 'Senior'
//   },
//   {
//     WorkerID: 'W002',
//     WorkerName: 'Jane Smith',
//     Skills: ['Python', 'Machine Learning', 'SQL'],
//     AvailableSlots: [2, 4, 5],
//     MaxLoadPerPhase: 6,
//     WorkerGroup: 'Backend',
//     QualificationLevel: 'Expert'
//   }
// ];

// const sampleTasks: Task[] = [
//   {
//     TaskID: 'T001',
//     TaskName: 'Build Homepage',
//     Category: 'Frontend',
//     Duration: 2,
//     RequiredSkills: ['JavaScript', 'React'],
//     PreferredPhases: [1, 2],
//     MaxConcurrent: 3
//   },
//   {
//     TaskID: 'T002',
//     TaskName: 'API Development',
//     Category: 'Backend',
//     Duration: 3,
//     RequiredSkills: ['Python', 'SQL'],
//     PreferredPhases: [1, 2, 3, 4],
//     MaxConcurrent: 2
//   },
//   {
//     TaskID: 'T003',
//     TaskName: 'ML Model Training',
//     Category: 'AI',
//     Duration: 4,
//     RequiredSkills: ['Python', 'Machine Learning'],
//     PreferredPhases: [3, 4, 5],
//     MaxConcurrent: 1
//   }
// ];

// // File Upload Component
// const FileUpload: React.FC<{
//   onFileUpload: (file: File, type: 'clients' | 'workers' | 'tasks') => void;
// }> = ({ onFileUpload }) => {
//   const [dragOver, setDragOver] = useState<string | null>(null);

//   const handleDrop = (e: React.DragEvent, type: 'clients' | 'workers' | 'tasks') => {
//     e.preventDefault();
//     setDragOver(null);
//     const files = Array.from(e.dataTransfer.files);
//     if (files.length > 0) {
//       onFileUpload(files[0], type);
//     }
//   };

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'clients' | 'workers' | 'tasks') => {
//     const files = Array.from(e.target.files || []);
//     if (files.length > 0) {
//       onFileUpload(files[0], type);
//     }
//   };

//   const UploadCard: React.FC<{
//     type: 'clients' | 'workers' | 'tasks';
//     title: string;
//     description: string;
//   }> = ({ type, title, description }) => (
//     <div
//       className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//         dragOver === type
//           ? 'border-blue-400 bg-blue-50'
//           : 'border-gray-300 hover:border-gray-400'
//       }`}
//       onDragOver={(e) => {
//         e.preventDefault();
//         setDragOver(type);
//       }}
//       onDragLeave={() => setDragOver(null)}
//       onDrop={(e) => handleDrop(e, type)}
//     >
//       <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//       <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
//       <p className="text-sm text-gray-600 mb-4">{description}</p>
//       <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
//         <Upload className="mr-2 h-4 w-4" />
//         Upload File
//         <input
//           type="file"
//           className="hidden"
//           accept=".csv,.xlsx,.xls"
//           onChange={(e) => handleFileInput(e, type)}
//         />
//       </label>
//     </div>
//   );

//   return (
//     <div className="grid md:grid-cols-3 gap-6 mb-8">
//       <UploadCard
//         type="clients"
//         title="Clients Data"
//         description="Upload CSV/XLSX with client information, priorities, and requested tasks"
//       />
//       <UploadCard
//         type="workers"
//         title="Workers Data"
//         description="Upload CSV/XLSX with worker skills, availability, and capacity"
//       />
//       <UploadCard
//         type="tasks"
//         title="Tasks Data"
//         description="Upload CSV/XLSX with task requirements, duration, and constraints"
//       />
//     </div>
//   );
// };

// // Data Grid Component
// const DataGrid: React.FC<{
//   data: any[];
//   type: 'clients' | 'workers' | 'tasks';
//   onEdit: (index: number, field: string, value: any) => void;
//   errors: ValidationError[];
// }> = ({ data, type, onEdit, errors }) => {
//   const [editingCell, setEditingCell] = useState<{row: number; field: string} | null>(null);

//   const getColumns = () => {
//     if (data.length === 0) return [];
//     return Object.keys(data[0]);
//   };

//   const getErrorsForCell = (rowIndex: number, field: string) => {
//     const entityId = data[rowIndex]?.[`${type.slice(0, -1).charAt(0).toUpperCase()}${type.slice(0, -1).slice(1)}ID`];
//     return errors.filter(
//       error => error.entity === type.slice(0, -1) && 
//                error.entityId === entityId && 
//                error.field === field
//     );
//   };

//   const handleCellEdit = (rowIndex: number, field: string, value: string) => {
//     // Parse array fields
//     if (field.includes('IDs') || field.includes('Skills') || field.includes('Slots') || field.includes('Phases')) {
//       try {
//         const parsed = value.startsWith('[') ? JSON.parse(value) : value.split(',').map(s => s.trim());
//         onEdit(rowIndex, field, parsed);
//       } catch {
//         onEdit(rowIndex, field, value.split(',').map(s => s.trim()));
//       }
//     } else if (field.includes('JSON') || field.includes('Attributes')) {
//       try {
//         onEdit(rowIndex, field, JSON.parse(value));
//       } catch {
//         onEdit(rowIndex, field, value);
//       }
//     } else if (field === 'PriorityLevel' || field === 'Duration' || field === 'MaxLoadPerPhase' || field === 'MaxConcurrent') {
//       onEdit(rowIndex, field, parseInt(value) || 0);
//     } else {
//       onEdit(rowIndex, field, value);
//     }
//     setEditingCell(null);
//   };

//   if (data.length === 0) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         <FileSpreadsheet className="mx-auto h-16 w-16 mb-4" />
//         <p className="text-lg">No {type} data uploaded yet</p>
//         <p className="text-sm">Upload a CSV or XLSX file to get started</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             {getColumns().map((column) => (
//               <th key={column} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 {column}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex} className="hover:bg-gray-50">
//               {getColumns().map((column) => {
//                 const cellErrors = getErrorsForCell(rowIndex, column);
//                 const hasError = cellErrors.length > 0;
//                 const isEditing = editingCell?.row === rowIndex && editingCell?.field === column;

//                 return (
//                   <td 
//                     key={column}
//                     className={`px-4 py-3 text-sm relative ${
//                       hasError ? 'bg-red-50 border border-red-200' : ''
//                     }`}
//                   >
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         defaultValue={
//                           Array.isArray(row[column])
//                             ? JSON.stringify(row[column])
//                             : typeof row[column] === 'object'
//                             ? JSON.stringify(row[column])
//                             : row[column]
//                         }
//                         className="w-full p-1 border border-gray-300 rounded text-sm"
//                         onBlur={(e) => handleCellEdit(rowIndex, column, e.target.value)}
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             handleCellEdit(rowIndex, column, e.currentTarget.value);
//                           }
//                         }}
//                         autoFocus
//                       />
//                     ) : (
//                       <div
//                         className="cursor-pointer hover:bg-gray-100 p-1 rounded"
//                         onClick={() => setEditingCell({row: rowIndex, field: column})}
//                       >
//                         {Array.isArray(row[column])
//                           ? row[column].join(', ')
//                           : typeof row[column] === 'object'
//                           ? JSON.stringify(row[column])
//                           : row[column]?.toString() || '—'}
//                       </div>
//                     )}
//                     {hasError && (
//                       <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
//                         <AlertTriangle className="h-4 w-4 text-red-500" />
//                       </div>
//                     )}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Validation Panel Component
// const ValidationPanel: React.FC<{
//   errors: ValidationError[];
//   onErrorClick: (error: ValidationError) => void;
// }> = ({ errors, onErrorClick }) => {
//   const errorCount = errors.filter(e => e.type === 'error').length;
//   const warningCount = errors.filter(e => e.type === 'warning').length;

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-medium text-gray-900">Validation Results</h3>
//         <div className="flex items-center space-x-4">
//           {errorCount > 0 && (
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//               <AlertTriangle className="mr-1 h-3 w-3" />
//               {errorCount} Errors
//             </span>
//           )}
//           {warningCount > 0 && (
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//               <AlertTriangle className="mr-1 h-3 w-3" />
//               {warningCount} Warnings
//             </span>
//           )}
//           {errors.length === 0 && (
//             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//               <CheckCircle className="mr-1 h-3 w-3" />
//               All Valid
//             </span>
//           )}
//         </div>
//       </div>

//       {errors.length > 0 ? (
//         <div className="space-y-2 max-h-64 overflow-y-auto">
//           {errors.map((error) => (
//             <div
//               key={error.id}
//               className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${
//                 error.type === 'error'
//                   ? 'bg-red-50 border border-red-200'
//                   : 'bg-yellow-50 border border-yellow-200'
//               }`}
//               onClick={() => onErrorClick(error)}
//             >
//               <div className="flex items-start">
//                 <AlertTriangle className={`mr-2 h-4 w-4 mt-0.5 ${
//                   error.type === 'error' ? 'text-red-500' : 'text-yellow-500'
//                 }`} />
//                 <div className="flex-1">
//                   <p className={`text-sm font-medium ${
//                     error.type === 'error' ? 'text-red-800' : 'text-yellow-800'
//                   }`}>
//                     {error.entity.toUpperCase()}: {error.entityId}
//                     {error.field && ` → ${error.field}`}
//                   </p>
//                   <p className={`text-sm ${
//                     error.type === 'error' ? 'text-red-700' : 'text-yellow-700'
//                   }`}>
//                     {error.message}
//                   </p>
//                   {error.suggestion && (
//                     <p className={`text-xs mt-1 ${
//                       error.type === 'error' ? 'text-red-600' : 'text-yellow-600'
//                     }`}>
//                       💡 {error.suggestion}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-sm text-gray-600">
//           🎉 All data is valid! Ready to configure rules and export.
//         </p>
//       )}
//     </div>
//   );
// };

// // Natural Language Search Component
// const NaturalLanguageSearch: React.FC<{
//   onSearch: (query: string) => void;
//   isLoading: boolean;
// }> = ({ onSearch, isLoading }) => {
//   const [query, setQuery] = useState('');

//   const handleSearch = () => {
//     if (query.trim()) {
//       onSearch(query.trim());
//     }
//   };

//   const sampleQueries = [
//     "All tasks with duration more than 2 phases",
//     "Workers with JavaScript skills",
//     "High priority clients (level 4 or 5)",
//     "Tasks requiring Python and SQL skills",
//     "Workers available in phase 2"
//   ];

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6">
//       <div className="flex items-center mb-4">
//         <Zap className="mr-2 h-5 w-5 text-blue-600" />
//         <h3 className="text-lg font-medium text-gray-900">AI-Powered Search</h3>
//       </div>

//       <div className="flex space-x-2 mb-4">
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search using natural language... e.g., 'All tasks with JavaScript skills'"
//           className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//         />
//         <button
//           onClick={handleSearch}
//           disabled={isLoading}
//           className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
//         >
//           {isLoading ? (
//             <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
//           ) : (
//             <Search className="mr-2 h-4 w-4" />
//           )}
//           Search
//         </button>
//       </div>

//       <div>
//         <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
//         <div className="flex flex-wrap gap-2">
//           {sampleQueries.map((sample, idx) => (
//             <button
//               key={idx}
//               onClick={() => setQuery(sample)}
//               className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
//             >
//               {sample}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main App Component
// export default function DataAlchemistApp() {
//   const [clients, setClients] = useState<Client[]>(sampleClients);
//   const [workers, setWorkers] = useState<Worker[]>(sampleWorkers);
//   const [tasks, setTasks] = useState<Task[]>(sampleTasks);
//   const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
//   const [activeTab, setActiveTab] = useState<'clients' | 'workers' | 'tasks'>('clients');
//   const [isValidating, setIsValidating] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchLoading, setSearchLoading] = useState(false);

//   // Simple validation function
//   const validateData = useCallback(() => {
//     setIsValidating(true);
//     const errors: ValidationError[] = [];

//     // Check for duplicate IDs
//     const clientIds = new Set();
//     clients.forEach(client => {
//       if (clientIds.has(client.ClientID)) {
//         errors.push({
//           id: Math.random().toString(),
//           type: 'error',
//           entity: 'client',
//           entityId: client.ClientID,
//           field: 'ClientID',
//           message: `Duplicate ClientID: ${client.ClientID}`,
//           suggestion: 'Change this ID to a unique value'
//         });
//       }
//       clientIds.add(client.ClientID);

//       // Check priority level
//       if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
//         errors.push({
//           id: Math.random().toString(),
//           type: 'error',
//           entity: 'client',
//           entityId: client.ClientID,
//           field: 'PriorityLevel',
//           message: `Priority level must be 1-5, got: ${client.PriorityLevel}`,
//           suggestion: 'Set priority to a value between 1 and 5'
//         });
//       }
//     });

//     // Check task coverage
//     const taskIds = new Set(tasks.map(t => t.TaskID));
//     clients.forEach(client => {
//       client.RequestedTaskIDs?.forEach(taskId => {
//         if (!taskIds.has(taskId)) {
//           errors.push({
//             id: Math.random().toString(),
//             type: 'error',
//             entity: 'client',
//             entityId: client.ClientID,
//             field: 'RequestedTaskIDs',
//             message: `References non-existent task: ${taskId}`,
//             suggestion: 'Remove this task ID or add the missing task'
//           });
//         }
//       });
//     });

//     // Check skill coverage
//     const availableSkills = new Set(workers.flatMap(w => w.Skills || []));
//     tasks.forEach(task => {
//       task.RequiredSkills?.forEach(skill => {
//         if (!availableSkills.has(skill)) {
//           errors.push({
//             id: Math.random().toString(),
//             type: 'error',
//             entity: 'task',
//             entityId: task.TaskID,
//             field: 'RequiredSkills',
//             message: `Required skill '${skill}' not available in any worker`,
//             suggestion: `Add a worker with '${skill}' skill or remove this requirement`
//           });
//         }
//       });
//     });

//     setValidationErrors(errors);
//     setIsValidating(false);
//   }, [clients, workers, tasks]);

//   // Auto-validate when data changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       validateData();
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [validateData]);

//   // File upload handler with better user feedback
//   const handleFileUpload = async (file: File, type: 'clients' | 'workers' | 'tasks') => {
//     try {
//       console.log(`Uploading ${file.name} for ${type}`);
      
//       // Show loading state
//       setIsValidating(true);
      
//       // Simulate file processing
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // In a real implementation, you would parse the CSV/XLSX here
//       // For now, we'll just show success message
//       alert(`✅ File uploaded successfully: ${file.name}\n\nIn production, this would:\n- Parse CSV/XLSX data\n- Validate format\n- Load ${type} data\n- Show preview`);
      
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('❌ Error uploading file. Please try again.');
//     } finally {
//       setIsValidating(false);
//     }
//   };

//   // Edit handler
//   const handleEdit = (type: 'clients' | 'workers' | 'tasks', index: number, field: string, value: any) => {
//     if (type === 'clients') {
//       const updated = [...clients];
//       (updated[index] as any)[field] = value;
//       setClients(updated);
//     } else if (type === 'workers') {
//       const updated = [...workers];
//       (updated[index] as any)[field] = value;
//       setWorkers(updated);
//     } else if (type === 'tasks') {
//       const updated = [...tasks];
//       (updated[index] as any)[field] = value;
//       setTasks(updated);
//     }
//   };

//   // Natural language search handler with better UX
//   const handleNaturalSearch = async (query: string) => {
//     setSearchLoading(true);
//     setSearchQuery(query);
    
//     try {
//       // Simulate AI processing time
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       console.log('Searching for:', query);
      
//       // In production, this would make an API call to your AI service
//       const mockResults = `🔍 Search Results for: "${query}"

// Found matching records:
// • 2 clients matching criteria
// • 3 workers with required skills  
// • 1 task meeting requirements

// This would show filtered data in the grid below.`;
      
//       alert(mockResults);
      
//     } catch (error) {
//       console.error('Search error:', error);
//       alert('❌ Search failed. Please try again.');
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   // Export handler
//   const handleExport = () => {
//     const exportData = {
//       clients,
//       workers,
//       tasks,
//       rules: [],
//       weights: {},
//       metadata: {
//         exportedAt: new Date().toISOString(),
//         version: '1.0',
//         totalRecords: clients.length + workers.length + tasks.length,
//         validationStatus: validationErrors.some(e => e.type === 'error') ? 'failed' : 'passed'
//       }
//     };

//     const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'data-alchemist-export.json';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const errorCount = validationErrors.filter(e => e.type === 'error').length;
//   const warningCount = validationErrors.filter(e => e.type === 'warning').length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">🧪 Data Alchemist</h1>
//               <p className="text-gray-600">Transform messy spreadsheets into clean, validated data</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2 text-sm">
//                 {errorCount > 0 && (
//                   <span className="flex items-center text-red-600">
//                     <AlertTriangle className="mr-1 h-4 w-4" />
//                     {errorCount} Errors
//                   </span>
//                 )}
//                 {warningCount > 0 && (
//                   <span className="flex items-center text-yellow-600">
//                     <AlertTriangle className="mr-1 h-4 w-4" />
//                     {warningCount} Warnings
//                   </span>
//                 )}
//                 {errorCount === 0 && warningCount === 0 && (
//                   <span className="flex items-center text-green-600">
//                     <CheckCircle className="mr-1 h-4 w-4" />
//                     All Valid
//                   </span>
//                 )}
//               </div>
//               <button
//                 onClick={handleExport}
//                 disabled={errorCount > 0}
//                 className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Download className="mr-2 h-4 w-4" />
//                 Export Data
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <FileUpload onFileUpload={handleFileUpload} />

//         <div className="mb-8">
//           <NaturalLanguageSearch onSearch={handleNaturalSearch} isLoading={searchLoading} />
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg border border-gray-200">
//               <div className="border-b border-gray-200">
//                 <nav className="flex space-x-8">
//                   {[
//                     { key: 'clients', label: 'Clients', count: clients.length },
//                     { key: 'workers', label: 'Workers', count: workers.length },
//                     { key: 'tasks', label: 'Tasks', count: tasks.length }
//                   ].map(({ key, label, count }) => (
//                     <button
//                       key={key}
//                       onClick={() => setActiveTab(key as any)}
//                       className={`px-6 py-4 text-sm font-medium border-b-2 ${
//                         activeTab === key
//                           ? 'border-blue-500 text-blue-600'
//                           : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                       }`}
//                     >
//                       {label} ({count})
//                     </button>
//                   ))}
//                 </nav>
//               </div>

//               <div className="p-6">
//                 {activeTab === 'clients' && (
//                   <DataGrid
//                     data={clients}
//                     type="clients"
//                     onEdit={(index, field, value) => handleEdit('clients', index, field, value)}
//                     errors={validationErrors}
//                   />
//                 )}
//                 {activeTab === 'workers' && (
//                   <DataGrid
//                     data={workers}
//                     type="workers"
//                     onEdit={(index, field, value) => handleEdit('workers', index, field, value)}
//                     errors={validationErrors}
//                   />
//                 )}
//                 {activeTab === 'tasks' && (
//                   <DataGrid
//                     data={tasks}
//                     type="tasks"
//                     onEdit={(index, field, value) => handleEdit('tasks', index, field, value)}
//                     errors={validationErrors}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <ValidationPanel
//               errors={validationErrors}
//               onErrorClick={(error) => {
//                 setActiveTab(error.entity === 'client' ? 'clients' : error.entity === 'worker' ? 'workers' : 'tasks');
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Download, Search, Zap } from 'lucide-react';

// Types
interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string[];
  GroupTag: string;
  AttributesJSON: any;
}

interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string[];
  AvailableSlots: number[];
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: string;
}

interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string[];
  PreferredPhases: number[];
  MaxConcurrent: number;
}

interface ValidationError {
  id: string;
  type: 'error' | 'warning';
  entity: 'client' | 'worker' | 'task';
  entityId: string;
  field?: string;
  message: string;
  suggestion?: string;
}

// Sample data for immediate testing
const sampleClients: Client[] = [
  {
    ClientID: 'C001',
    ClientName: 'Acme Corp',
    PriorityLevel: 5,
    RequestedTaskIDs: ['T001', 'T002'],
    GroupTag: 'Enterprise',
    AttributesJSON: { budget: 50000, region: 'US' }
  },
  {
    ClientID: 'C002',
    ClientName: 'Beta LLC',
    PriorityLevel: 3,
    RequestedTaskIDs: ['T003'],
    GroupTag: 'SMB',
    AttributesJSON: { budget: 25000, region: 'EU' }
  }
];

const sampleWorkers: Worker[] = [
  {
    WorkerID: 'W001',
    WorkerName: 'John Doe',
    Skills: ['JavaScript', 'React', 'TypeScript'],
    AvailableSlots: [1, 2, 3],
    MaxLoadPerPhase: 8,
    WorkerGroup: 'Frontend',
    QualificationLevel: 'Senior'
  },
  {
    WorkerID: 'W002',
    WorkerName: 'Jane Smith',
    Skills: ['Python', 'Machine Learning', 'SQL'],
    AvailableSlots: [2, 4, 5],
    MaxLoadPerPhase: 6,
    WorkerGroup: 'Backend',
    QualificationLevel: 'Expert'
  }
];

const sampleTasks: Task[] = [
  {
    TaskID: 'T001',
    TaskName: 'Build Homepage',
    Category: 'Frontend',
    Duration: 2,
    RequiredSkills: ['JavaScript', 'React'],
    PreferredPhases: [1, 2],
    MaxConcurrent: 3
  },
  {
    TaskID: 'T002',
    TaskName: 'API Development',
    Category: 'Backend',
    Duration: 3,
    RequiredSkills: ['Python', 'SQL'],
    PreferredPhases: [1, 2, 3, 4],
    MaxConcurrent: 2
  },
  {
    TaskID: 'T003',
    TaskName: 'ML Model Training',
    Category: 'AI',
    Duration: 4,
    RequiredSkills: ['Python', 'Machine Learning'],
    PreferredPhases: [3, 4, 5],
    MaxConcurrent: 1
  }
];

// File Upload Component
const FileUpload: React.FC<{
  onFileUpload: (file: File, type: 'clients' | 'workers' | 'tasks') => void;
}> = ({ onFileUpload }) => {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent, type: 'clients' | 'workers' | 'tasks') => {
    e.preventDefault();
    setDragOver(null);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0], type);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'clients' | 'workers' | 'tasks') => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files[0], type);
    }
  };

  const UploadCard: React.FC<{
    type: 'clients' | 'workers' | 'tasks';
    title: string;
    description: string;
  }> = ({ type, title, description }) => (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragOver === type
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(type);
      }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => handleDrop(e, type)}
    >
      <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
        <Upload className="mr-2 h-4 w-4" />
        Upload File
        <input
          type="file"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFileInput(e, type)}
          key={Math.random()} // Force remount to avoid hydration issues
        />
      </label>
    </div>
  );

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <UploadCard
        type="clients"
        title="Clients Data"
        description="Upload CSV/XLSX with client information, priorities, and requested tasks"
      />
      <UploadCard
        type="workers"
        title="Workers Data"
        description="Upload CSV/XLSX with worker skills, availability, and capacity"
      />
      <UploadCard
        type="tasks"
        title="Tasks Data"
        description="Upload CSV/XLSX with task requirements, duration, and constraints"
      />
    </div>
  );
};

// Data Grid Component
const DataGrid: React.FC<{
  data: any[];
  type: 'clients' | 'workers' | 'tasks';
  onEdit: (index: number, field: string, value: any) => void;
  errors: ValidationError[];
}> = ({ data, type, onEdit, errors }) => {
  const [editingCell, setEditingCell] = useState<{row: number; field: string} | null>(null);

  const getColumns = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const getErrorsForCell = (rowIndex: number, field: string) => {
    const entityId = data[rowIndex]?.[`${type.slice(0, -1).charAt(0).toUpperCase()}${type.slice(0, -1).slice(1)}ID`];
    return errors.filter(
      error => error.entity === type.slice(0, -1) && 
               error.entityId === entityId && 
               error.field === field
    );
  };

  const handleCellEdit = (rowIndex: number, field: string, value: string) => {
    // Parse array fields
    if (field.includes('IDs') || field.includes('Skills') || field.includes('Slots') || field.includes('Phases')) {
      try {
        const parsed = value.startsWith('[') ? JSON.parse(value) : value.split(',').map(s => s.trim());
        onEdit(rowIndex, field, parsed);
      } catch {
        onEdit(rowIndex, field, value.split(',').map(s => s.trim()));
      }
    } else if (field.includes('JSON') || field.includes('Attributes')) {
      try {
        onEdit(rowIndex, field, JSON.parse(value));
      } catch {
        onEdit(rowIndex, field, value);
      }
    } else if (field === 'PriorityLevel' || field === 'Duration' || field === 'MaxLoadPerPhase' || field === 'MaxConcurrent') {
      onEdit(rowIndex, field, parseInt(value) || 0);
    } else {
      onEdit(rowIndex, field, value);
    }
    setEditingCell(null);
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileSpreadsheet className="mx-auto h-16 w-16 mb-4" />
        <p className="text-lg">No {type} data uploaded yet</p>
        <p className="text-sm">Upload a CSV or XLSX file to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {getColumns().map((column) => (
              <th key={column} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {getColumns().map((column) => {
                const cellErrors = getErrorsForCell(rowIndex, column);
                const hasError = cellErrors.length > 0;
                const isEditing = editingCell?.row === rowIndex && editingCell?.field === column;

                return (
                  <td 
                    key={column}
                    className={`px-4 py-3 text-sm relative ${
                      hasError ? 'bg-red-50 border border-red-200' : ''
                    }`}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={
                          Array.isArray(row[column])
                            ? JSON.stringify(row[column])
                            : typeof row[column] === 'object'
                            ? JSON.stringify(row[column])
                            : row[column]
                        }
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                        onBlur={(e) => handleCellEdit(rowIndex, column, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCellEdit(rowIndex, column, e.currentTarget.value);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div
                        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => setEditingCell({row: rowIndex, field: column})}
                      >
                        {Array.isArray(row[column])
                          ? row[column].join(', ')
                          : typeof row[column] === 'object'
                          ? JSON.stringify(row[column])
                          : row[column]?.toString() || '—'}
                      </div>
                    )}
                    {hasError && (
                      <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validation Panel Component
const ValidationPanel: React.FC<{
  errors: ValidationError[];
  onErrorClick: (error: ValidationError) => void;
}> = ({ errors, onErrorClick }) => {
  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Validation Results</h3>
        <div className="flex items-center space-x-4">
          {errorCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {errorCount} Errors
            </span>
          )}
          {warningCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {warningCount} Warnings
            </span>
          )}
          {errors.length === 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              All Valid
            </span>
          )}
        </div>
      </div>

      {errors.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {errors.map((error) => (
            <div
              key={error.id}
              className={`p-3 rounded-md cursor-pointer hover:opacity-80 ${
                error.type === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
              onClick={() => onErrorClick(error)}
            >
              <div className="flex items-start">
                <AlertTriangle className={`mr-2 h-4 w-4 mt-0.5 ${
                  error.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    error.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                  }`}>
                    {error.entity.toUpperCase()}: {error.entityId}
                    {error.field && ` → ${error.field}`}
                  </p>
                  <p className={`text-sm ${
                    error.type === 'error' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {error.message}
                  </p>
                  {error.suggestion && (
                    <p className={`text-xs mt-1 ${
                      error.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      💡 {error.suggestion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          🎉 All data is valid! Ready to configure rules and export.
        </p>
      )}
    </div>
  );
};

// Natural Language Search Component
const NaturalLanguageSearch: React.FC<{
  onSearch: (query: string) => void;
  isLoading: boolean;
}> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const sampleQueries = [
    "All tasks with duration more than 2 phases",
    "Workers with JavaScript skills",
    "High priority clients (level 4 or 5)",
    "Tasks requiring Python and SQL skills",
    "Workers available in phase 2"
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Zap className="mr-2 h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">AI-Powered Search</h3>
      </div>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search using natural language... e.g., 'All tasks with JavaScript skills'"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          suppressHydrationWarning={true}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(sample)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function DataAlchemistApp() {
  const [mounted, setMounted] = useState(false);
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [workers, setWorkers] = useState<Worker[]>(sampleWorkers);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState<'clients' | 'workers' | 'tasks'>('clients');
  const [isValidating, setIsValidating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple validation function
  const validateData = useCallback(() => {
    setIsValidating(true);
    const errors: ValidationError[] = [];

    // Check for duplicate IDs
    const clientIds = new Set();
    clients.forEach(client => {
      if (clientIds.has(client.ClientID)) {
        errors.push({
          id: Math.random().toString(),
          type: 'error',
          entity: 'client',
          entityId: client.ClientID,
          field: 'ClientID',
          message: `Duplicate ClientID: ${client.ClientID}`,
          suggestion: 'Change this ID to a unique value'
        });
      }
      clientIds.add(client.ClientID);

      // Check priority level
      if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
        errors.push({
          id: Math.random().toString(),
          type: 'error',
          entity: 'client',
          entityId: client.ClientID,
          field: 'PriorityLevel',
          message: `Priority level must be 1-5, got: ${client.PriorityLevel}`,
          suggestion: 'Set priority to a value between 1 and 5'
        });
      }
    });

    // Check task coverage
    const taskIds = new Set(tasks.map(t => t.TaskID));
    clients.forEach(client => {
      client.RequestedTaskIDs?.forEach(taskId => {
        if (!taskIds.has(taskId)) {
          errors.push({
            id: Math.random().toString(),
            type: 'error',
            entity: 'client',
            entityId: client.ClientID,
            field: 'RequestedTaskIDs',
            message: `References non-existent task: ${taskId}`,
            suggestion: 'Remove this task ID or add the missing task'
          });
        }
      });
    });

    // Check skill coverage
    const availableSkills = new Set(workers.flatMap(w => w.Skills || []));
    tasks.forEach(task => {
      task.RequiredSkills?.forEach(skill => {
        if (!availableSkills.has(skill)) {
          errors.push({
            id: Math.random().toString(),
            type: 'error',
            entity: 'task',
            entityId: task.TaskID,
            field: 'RequiredSkills',
            message: `Required skill '${skill}' not available in any worker`,
            suggestion: `Add a worker with '${skill}' skill or remove this requirement`
          });
        }
      });
    });

    setValidationErrors(errors);
    setIsValidating(false);
  }, [clients, workers, tasks]);

  // Auto-validate when data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      validateData();
    }, 500);
    return () => clearTimeout(timer);
  }, [validateData]);

  // File upload handler with better user feedback
  const handleFileUpload = async (file: File, type: 'clients' | 'workers' | 'tasks') => {
    try {
      console.log(`Uploading ${file.name} for ${type}`);
      
      // Show loading state
      setIsValidating(true);
      
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would parse the CSV/XLSX here
      // For now, we'll just show success message
      alert(`✅ File uploaded successfully: ${file.name}\n\nIn production, this would:\n- Parse CSV/XLSX data\n- Validate format\n- Load ${type} data\n- Show preview`);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Error uploading file. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  // Edit handler
  const handleEdit = (type: 'clients' | 'workers' | 'tasks', index: number, field: string, value: any) => {
    if (type === 'clients') {
      const updated = [...clients];
      (updated[index] as any)[field] = value;
      setClients(updated);
    } else if (type === 'workers') {
      const updated = [...workers];
      (updated[index] as any)[field] = value;
      setWorkers(updated);
    } else if (type === 'tasks') {
      const updated = [...tasks];
      (updated[index] as any)[field] = value;
      setTasks(updated);
    }
  };

  // Natural language search handler with better UX
  const handleNaturalSearch = async (query: string) => {
    setSearchLoading(true);
    setSearchQuery(query);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Searching for:', query);
      
      // In production, this would make an API call to your AI service
      const mockResults = `🔍 Search Results for: "${query}"

Found matching records:
• 2 clients matching criteria
• 3 workers with required skills  
• 1 task meeting requirements

This would show filtered data in the grid below.`;
      
      alert(mockResults);
      
    } catch (error) {
      console.error('Search error:', error);
      alert('❌ Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Export handler
  const handleExport = () => {
    const exportData = {
      clients,
      workers,
      tasks,
      rules: [],
      weights: {},
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        totalRecords: clients.length + workers.length + tasks.length,
        validationStatus: validationErrors.some(e => e.type === 'error') ? 'failed' : 'passed'
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-alchemist-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const errorCount = validationErrors.filter(e => e.type === 'error').length;
  const warningCount = validationErrors.filter(e => e.type === 'warning').length;

  // Prevent hydration issues - don't render until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Data Alchemist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🧪 Data Alchemist</h1>
              <p className="text-gray-600">Transform messy spreadsheets into clean, validated data</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                {errorCount > 0 && (
                  <span className="flex items-center text-red-600">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    {errorCount} Errors
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="flex items-center text-yellow-600">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    {warningCount} Warnings
                  </span>
                )}
                {errorCount === 0 && warningCount === 0 && (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    All Valid
                  </span>
                )}
              </div>
              <button
                onClick={handleExport}
                disabled={errorCount > 0}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FileUpload onFileUpload={handleFileUpload} />

        <div className="mb-8">
          <NaturalLanguageSearch onSearch={handleNaturalSearch} isLoading={searchLoading} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { key: 'clients', label: 'Clients', count: clients.length },
                    { key: 'workers', label: 'Workers', count: workers.length },
                    { key: 'tasks', label: 'Tasks', count: tasks.length }
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 ${
                        activeTab === key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'clients' && (
                  <DataGrid
                    data={clients}
                    type="clients"
                    onEdit={(index, field, value) => handleEdit('clients', index, field, value)}
                    errors={validationErrors}
                  />
                )}
                {activeTab === 'workers' && (
                  <DataGrid
                    data={workers}
                    type="workers"
                    onEdit={(index, field, value) => handleEdit('workers', index, field, value)}
                    errors={validationErrors}
                  />
                )}
                {activeTab === 'tasks' && (
                  <DataGrid
                    data={tasks}
                    type="tasks"
                    onEdit={(index, field, value) => handleEdit('tasks', index, field, value)}
                    errors={validationErrors}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ValidationPanel
              errors={validationErrors}
              onErrorClick={(error) => {
                setActiveTab(error.entity === 'client' ? 'clients' : error.entity === 'worker' ? 'workers' : 'tasks');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}