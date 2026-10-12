import React, { useState, useEffect } from 'react';
import { FileText, Download, BookOpen, Smartphone, Monitor, Plus, Trash2, Printer, RefreshCw, Layers, Users, Hash, Quote, Bookmark, Save } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak } from 'docx';

export default function App() {
  const [titulo, setTitulo] = useState('Evaluación Geológica y Minera en el Norte del Perú');
  const [autores, setAutores] = useState([{ id: 1, nombre: '' }]);
  const [universidad, setUniversidad] = useState('Universidad César Vallejo');
  const [curso, setCurso] = useState('Geología General');

  const [resumen, setResumen] = useState('El presente informe académico aborda la evaluación geológica y el impacto de la actividad minera en la región, analizando los principales desafíos técnicos y ambientales asociados a la extracción de recursos y proponiendo medidas de mitigación basadas en la ingeniería sostenible.');
  const [introduccion, setIntroduccion] = useState('La minería en el Perú representa uno de los pilares fundamentales de la economía nacional, contribuyendo significativamente al Producto Bruto Interno (PBI). Sin embargo, el desarrollo de esta actividad exige un control riguroso de los aspectos geológicos y ambientales para garantizar la sostenibilidad a largo plazo.');
  const [desarrollo, setDesarrollo] = useState('Desde una perspectiva geológica, la explotación de recursos requiere comprender la dinámica de los depósitos minerales y las características estructurales del macizo rocoso. Asimismo, la gestión de relaves y la prevención del drenaje ácido de roca constituyen prioridades técnicas esenciales para evitar la degradación de los ecosistemas locales.');
  const [metodologia, setMetodologia] = useState('La investigación se desarrolló mediante un enfoque metodológico descriptivo y documental, recopilando información técnica de fuentes oficiales y literatura especializada sobre minería sostenible.');
  const [resultados, setResultados] = useState('Los datos analizados demuestran que la implementación de tecnologías de relaves filtrados y planes de cierre de minas reducen drásticamente el riesgo de contaminación hídrica, optimizando al mismo tiempo el aprovechamiento de los minerales extraídos.');
  const [conclusiones, setConclusiones] = useState('Se concluye que la actividad minera en el Perú es viable y altamente beneficiosa siempre que se integren estudios geológicos rigurosos, innovación tecnológica y una gestión socioambiental transparente que proteja los recursos hídricos y a las comunidades locales.');

  // Referencias en blanco por defecto
  const [referencias, setReferencias] = useState([]);

  const [borradores, setBorradores] = useState([]);
  const [vistaPreviaMovil, setVistaPreviaMovil] = useState(false);

  useEffect(() => {
    const guardados = localStorage.getItem('menteplus_borradores');
    if (guardados) {
      try {
        setBorradores(JSON.parse(guardados));
      } catch (e) {
        console.error("Error al cargar borradores", e);
      }
    }
  }, []);

  const guardarBorradoresEnStorage = (nuevosBorradores) => {
    setBorradores(nuevosBorradores);
    localStorage.setItem('menteplus_borradores', JSON.stringify(nuevosBorradores));
  };

  const handleGuardarBorrador = () => {
    if (!titulo.trim()) {
      alert("Ingresa un título para identificar el borrador.");
      return;
    }

    const nuevoBorrador = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      titulo,
      autores,
      universidad,
      curso,
      resumen,
      introduccion,
      desarrollo,
      metodologia,
      resultados,
      conclusiones,
      referencias
    };

    const actualizados = [nuevoBorrador, ...borradores];
    guardarBorradoresEnStorage(actualizados);
    alert("¡Borrador guardado correctamente!");
  };

  const handleCargarBorrador = (b) => {
    setTitulo(b.titulo || '');
    setAutores(b.autores || [{ id: 1, nombre: '' }]);
    setUniversidad(b.universidad || 'Universidad César Vallejo');
    setCurso(b.curso || '');
    setResumen(b.resumen || '');
    setIntroduccion(b.introduccion || '');
    setDesarrollo(b.desarrollo || '');
    setMetodologia(b.metodologia || '');
    setResultados(b.resultados || '');
    setConclusiones(b.conclusiones || '');
    setReferencias(b.referencias || []);
  };

  const handleBorrarBorrador = (id, e) => {
    e.stopPropagation();
    if (window.confirm("¿Deseas eliminar este borrador permanentemente?")) {
      const filtrados = borradores.filter(b => b.id !== id);
      guardarBorradoresEnStorage(filtrados);
    }
  };

  const contarPalabras = (texto) => {
    if (!texto || !texto.trim()) return 0;
    return texto.trim().split(/\s+/).length;
  };

  const totalPalabras = contarPalabras(resumen) + 
                       contarPalabras(introduccion) + 
                       contarPalabras(desarrollo) + 
                       contarPalabras(metodologia) + 
                       contarPalabras(resultados) + 
                       contarPalabras(conclusiones);

  const insertarCitaReferencia = (ref, setSeccion, seccionActual) => {
    if (!ref.autor) {
      alert("La referencia debe tener al menos un autor para generar la cita.");
      return;
    }
    const apellido = ref.autor.split(',')[0].trim();
    const textoCita = ` (${apellido}${ref.anio ? `, ${ref.anio}` : ''}) `;
    setSeccion(seccionActual + textoCita);
  };

  const insertarCitaManual = (setSeccion, seccionActual) => {
    const citaPersonalizada = prompt("Ingresa el texto de la cita (ej. 'Pérez, 2024, p. 12' o 'según Ruiz, 2023'):");
    if (citaPersonalizada && citaPersonalizada.trim()) {
      const formatoFinal = citaPersonalizada.startsWith('(') ? ` ${citaPersonalizada.trim()} ` : ` (${citaPersonalizada.trim()}) `;
      setSeccion(seccionActual + formatoFinal);
    }
  };

  const agregarAutor = () => {
    setAutores([...autores, { id: Date.now(), nombre: '' }]);
  };

  const actualizarAutor = (id, valor) => {
    setAutores(autores.map(a => (a.id === id ? { ...a, nombre: valor } : a)));
  };

  const eliminarAutor = (id) => {
    if (autores.length === 1) {
      alert("Debe haber al menos un autor en el trabajo.");
      return;
    }
    setAutores(autores.filter(a => a.id !== id));
  };

  const agregarReferencia = () => {
    setReferencias([...referencias, { id: Date.now(), autor: '', anio: '', titulo: '', fuente: '' }]);
  };

  const actualizarReferencia = (id, campo, valor) => {
    setReferencias(referencias.map(ref => (ref.id === id ? { ...ref, [campo]: valor } : ref)));
  };

  const eliminarReferencia = (id) => {
    setReferencias(referencias.filter(ref => ref.id !== id));
  };

  const handleLimpiarFormulario = () => {
    if (window.confirm("¿Deseas reiniciar los datos del informe?")) {
      setTitulo('');
      setAutores([{ id: 1, nombre: '' }]);
      setUniversidad('Universidad César Vallejo');
      setCurso('');
      setResumen('');
      setIntroduccion('');
      setDesarrollo('');
      setMetodologia('');
      setResultados('');
      setConclusiones('');
      setReferencias([]);
    }
  };

  const handleGenerarWord = async () => {
    if (!titulo || autores.length === 0 || !autores[0].nombre) {
      alert("Por favor completa el título y al menos el nombre del primer autor para la portada APA 7.");
      return;
    }

    try {
      const parrafosAutores = autores.map(autor => 
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: autor.nombre, size: 24, font: "Times New Roman" })],
          spacing: { line: 480 },
        })
      );

      const childrenParagraphs = [
        new Paragraph({ text: "", spacing: { before: 2000 } }),
        new Paragraph({ 
          alignment: AlignmentType.CENTER, 
          children: [new TextRun({ text: titulo, bold: true, size: 24, font: "Times New Roman" })], 
          spacing: { line: 480, after: 480 } 
        }),
        
        ...parrafosAutores,

        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: universidad, size: 24, font: "Times New Roman" })], spacing: { line: 480, before: 240 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: curso, size: 24, font: "Times New Roman" })], spacing: { line: 480 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), size: 24, font: "Times New Roman" })], spacing: { line: 480 } }),

        // Resumen
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Resumen", bold: true, size: 24, font: "Times New Roman" })], spacing: { line: 480, before: 240, after: 240 } }),
        new Paragraph({ alignment: AlignmentType.LEFT, indent: { firstLine: 720 }, children: [new TextRun({ text: resumen, size: 24, font: "Times New Roman" })], spacing: { line: 480, after: 0 } }),

        // Introducción
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Introducción", bold: true, size: 24, font: "Times New Roman" })], spacing: { line: 480, before: 240, after: 240 } }),
        new Paragraph({ alignment: AlignmentType.LEFT, indent: { firstLine: 720 }, children: [new TextRun({ text: introduccion, size: 24, font: "Times New Roman" })], spacing: { line: 480, after: 0 } }),

        // Desarrollo
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Desarrollo del Trabajo", bold: true, size: 24, font: "Times New Roman" })], spacing: { line: 480, before: 240, after: 240 } }),
        new Paragraph({ alignment: AlignmentType.LEFT, indent: { firstLine: 720 }, children: [new TextRun({ text: desarrollo, size: 24, font: "Times New Roman" })], spacing: { line: 480, after: 0 } }),

        // Metodología
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Metodología", bold: true, size: 24, font: "Times New Roman" })], spacing: { line: 480, before: 240, after: 240 } }),
        new Paragraph({ alignment: AlignmentType.LEFT, indent: { firstLine: 720 }, children: [new TextRun({ text: metodologia, size: 24, font: "Times New Roman" })], spacing: { line: 480, after: 0 } }),

        // Resultados
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Resultados", bold: true, size: 24, font: "Times New Roman" })], spacing: { line: 480, before: 240, after: 240 } }),
        new Paragraph({ alignment: AlignmentType.LEFT, indent: { firstLine: 720 }, children: [new TextRun({ text: resultados, size: 24, font: "Times New Roman" })], spacing: { line: 480, after: 0 } }),

        // Conclusiones
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Conclusiones", bold: true, size: 24, font: "Times New Roman" })], spacing: { line: 480, before: 240, after: 240 } }),
        new Paragraph({ alignment: AlignmentType.LEFT, indent: { firstLine: 720 }, children: [new TextRun({ text: conclusiones, size: 24, font: "Times New Roman" })], spacing: { line: 480, after: 0 } }),
      ];

      if (referencias.length > 0) {
        childrenParagraphs.push(
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Referencias", bold: true, size: 24, font: "Times New Roman" })], spacing: { line: 480, before: 240, after: 240 } })
        );

        referencias.forEach(ref => {
          if (ref.autor || ref.titulo) {
            childrenParagraphs.push(
              new Paragraph({
                alignment: AlignmentType.LEFT,
                indent: { left: 720, hanging: 720 },
                children: [
                  new TextRun({ text: `${ref.autor} (${ref.anio}). `, size: 24, font: "Times New Roman" }),
                  new TextRun({ text: `${ref.titulo}. `, italics: true, size: 24, font: "Times New Roman" }),
                  new TextRun({ text: `${ref.fuente}.`, size: 24, font: "Times New Roman" }),
                ],
                spacing: { line: 480, after: 0 },
              })
            );
          }
        });
      }

      const doc = new Document({
        sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, children: childrenParagraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const ahora = new Date();
      const horaStamp = `${ahora.getHours()}-${ahora.getMinutes()}-${ahora.getSeconds()}`;

      const a = document.createElement('a');
      a.href = url;
      a.download = `INFORME_GRUPAL_${horaStamp}_APA7.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el documento Word:", error);
      alert("Error al generar: " + error.message);
    }
  };

  const handleExportarPDF = () => {
    window.print();
  };

  const renderSelectorCitas = (setSeccion, seccionActual) => {
    return (
      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 flex-wrap">
        <Quote className="w-3 h-3 text-emerald-600" /> Insertar Cita:
        
        {referencias.map(ref => ref.autor ? (
          <button
            key={ref.id}
            onClick={() => insertarCitaReferencia(ref, setSeccion, seccionActual)}
            className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded text-[10px] font-medium border border-slate-200 transition"
          >
            +{ref.autor.split(',')[0]} ({ref.anio})
          </button>
        ) : null)}

        <button
          onClick={() => insertarCitaManual(setSeccion, seccionActual)}
          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-semibold border border-emerald-200 transition flex items-center gap-0.5"
        >
          <Plus className="w-2.5 h-2.5" /> Cita Personalizada
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row print:bg-white print:p-0">
      <aside className="w-full md:w-80 bg-slate-900 text-white p-6 flex flex-col justify-between shadow-lg print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-wider">Mente<span className="text-emerald-400">Plus</span></h1>
          </div>
          <p className="text-xs text-slate-400 mb-6">Generador Académico Inteligente - APA 7</p>

          <button 
            onClick={handleGuardarBorrador}
            className="w-full mb-6 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <Save className="w-4 h-4" /> Guardar Informe como Borrador
          </button>
          
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-3">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" /> Mis Borradores ({borradores.length})
            </p>

            {borradores.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">No tienes borradores guardados aún.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {borradores.map(b => (
                  <div 
                    key={b.id} 
                    onClick={() => handleCargarBorrador(b)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition border border-slate-700 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="truncate flex-1 pr-2">
                      <p className="text-xs font-medium text-slate-200 truncate">{b.titulo}</p>
                      <p className="text-[10px] text-slate-400">{b.fecha} • {b.curso || 'Sin curso'}</p>
                    </div>
                    <button 
                      onClick={(e) => handleBorrarBorrador(b.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
                      title="Borrar borrador"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-800 rounded-xl mb-4 border border-slate-700">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold mb-1">
            <Hash className="w-4 h-4 text-emerald-400" /> Palabras Totales
          </div>
          <p className="text-2xl font-bold text-emerald-400">{totalPalabras} <span className="text-xs text-slate-400 font-normal">palabras</span></p>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500"><p>UCV - Ingeniería de Minas</p></div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto print:p-0 print:overflow-visible">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Editor de Informes Académicos</h2>
            <p className="text-slate-500 text-sm">Citas personalizadas, borradores dinámicos y formato estandarizado APA 7.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLimpiarFormulario} className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1 transition" title="Reiniciar formulario">
              <RefreshCw className="w-3.5 h-3.5" /> Nuevo Informe
            </button>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
              <button onClick={() => setVistaPreviaMovil(false)} className={`p-2 rounded-lg text-sm flex items-center gap-1 ${!vistaPreviaMovil ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
                <Monitor className="w-4 h-4" /> Escritorio
              </button>
              <button onClick={() => setVistaPreviaMovil(true)} className={`p-2 rounded-lg text-sm flex items-center gap-1 ${vistaPreviaMovil ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
                <Smartphone className="w-4 h-4" /> Celular
              </button>
            </div>
          </div>
        </header>

        <div className={`mx-auto transition-all duration-300 ${vistaPreviaMovil ? 'max-w-sm border-8 border-slate-800 rounded-3xl p-4 bg-white shadow-2xl' : 'max-w-4xl'}`}>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6 print:border-none print:p-0 print:shadow-none">
            
            <div className="border-b pb-4 space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 print:hidden">1. Datos de Portada e Integrantes (APA 7)</h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 print:hidden">Título del Informe</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ingresa el título del informe" className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 print:hidden">
                  <label className="text-xs font-medium text-slate-600 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Autores / Integrantes del Grupo</label>
                  <button onClick={agregarAutor} className="flex items-center gap-1 text-xs px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium rounded-lg transition">
                    <Plus className="w-3 h-3" /> Agregar Integrante
                  </button>
                </div>
                
                <div className="space-y-2">
                  {autores.map((autor, index) => (
                    <div key={autor.id} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 w-6 print:hidden">{index + 1}.</span>
                      <input 
                        type="text" 
                        placeholder="Ingresa el nombre del autor" 
                        value={autor.nombre} 
                        onChange={(e) => actualizarAutor(autor.id, e.target.value)} 
                        className="flex-1 px-3 py-2 border border-slate-300 bg-white text-xs rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                      />
                      <button onClick={() => eliminarAutor(autor.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition print:hidden" title="Eliminar integrante">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 print:hidden">Universidad</label>
                  <input type="text" value={universidad} onChange={(e) => setUniversidad(e.target.value)} className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 print:hidden">Curso / Asignatura</label>
                  <input type="text" value={curso} onChange={(e) => setCurso(e.target.value)} placeholder="Ingresa el nombre del curso" className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="border-b pb-4 space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 print:hidden">2. Secciones del Informe Académico</h3>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-600">Resumen</label>
                  <span className="text-[11px] text-slate-400 font-medium">{contarPalabras(resumen)} palabras</span>
                </div>
                <textarea rows="3" value={resumen} onChange={(e) => setResumen(e.target.value)} placeholder="Ingresa el resumen..." className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                {renderSelectorCitas(setResumen, resumen)}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-600">Introducción</label>
                  <span className="text-[11px] text-slate-400 font-medium">{contarPalabras(introduccion)} palabras</span>
                </div>
                <textarea rows="3" value={introduccion} onChange={(e) => setIntroduccion(e.target.value)} placeholder="Ingresa la introducción..." className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                {renderSelectorCitas(setIntroduccion, introduccion)}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-600">Desarrollo del Trabajo / Marco Teórico</label>
                  <span className="text-[11px] text-slate-400 font-medium">{contarPalabras(desarrollo)} palabras</span>
                </div>
                <textarea rows="4" value={desarrollo} onChange={(e) => setDesarrollo(e.target.value)} placeholder="Ingresa el desarrollo..." className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                {renderSelectorCitas(setDesarrollo, desarrollo)}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-600">Metodología</label>
                  <span className="text-[11px] text-slate-400 font-medium">{contarPalabras(metodologia)} palabras</span>
                </div>
                <textarea rows="3" value={metodologia} onChange={(e) => setMetodologia(e.target.value)} placeholder="Ingresa la metodología..." className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                {renderSelectorCitas(setMetodologia, metodologia)}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-600">Resultados</label>
                  <span className="text-[11px] text-slate-400 font-medium">{contarPalabras(resultados)} palabras</span>
                </div>
                <textarea rows="3" value={resultados} onChange={(e) => setResultados(e.target.value)} placeholder="Ingresa los resultados..." className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                {renderSelectorCitas(setResultados, resultados)}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-600">Conclusiones</label>
                  <span className="text-[11px] text-slate-400 font-medium">{contarPalabras(conclusiones)} palabras</span>
                </div>
                <textarea rows="3" value={conclusiones} onChange={(e) => setConclusiones(e.target.value)} placeholder="Ingresa las conclusiones..." className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                {renderSelectorCitas(setConclusiones, conclusiones)}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 print:hidden">
                <h3 className="text-lg font-semibold text-slate-700">3. Referencias Bibliográficas (APA 7)</h3>
                <button onClick={agregarReferencia} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium rounded-lg transition"><Plus className="w-3.5 h-3.5" /> Agregar Fuente</button>
              </div>
              
              {referencias.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                  No hay referencias agregadas. Haz clic en "Agregar Fuente" para registrar una nueva bibliografía.
                </p>
              ) : (
                <div className="space-y-3">
                  {referencias.map((ref, index) => (
                    <div key={ref.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-2 items-start md:items-center">
                      <span className="text-xs font-bold text-slate-400 w-6 print:hidden">{index + 1}.</span>
                      <input type="text" placeholder="Autor" value={ref.autor} onChange={(e) => actualizarReferencia(ref.id, 'autor', e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-300 bg-white text-xs rounded-lg outline-none" />
                      <input type="text" placeholder="Año" value={ref.anio} onChange={(e) => actualizarReferencia(ref.id, 'anio', e.target.value)} className="w-24 px-3 py-1.5 border border-slate-300 bg-white text-xs rounded-lg outline-none" />
                      <input type="text" placeholder="Título" value={ref.titulo} onChange={(e) => actualizarReferencia(ref.id, 'titulo', e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-300 bg-white text-xs rounded-lg outline-none" />
                      <input type="text" placeholder="Editorial/Fuente" value={ref.fuente} onChange={(e) => actualizarReferencia(ref.id, 'fuente', e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-300 bg-white text-xs rounded-lg outline-none" />
                      <button onClick={() => eliminarReferencia(ref.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition print:hidden"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t print:hidden">
              <button onClick={handleExportarPDF} className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"><Printer className="w-4 h-4" /> Exportar a PDF / Imprimir</button>
              <button onClick={handleGenerarWord} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"><Download className="w-4 h-4" /> Exportar Informe Grupal Word (.docx)</button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}