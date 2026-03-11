
// māS Educación Continua UNIACC 2026
import { useState, useMemo, useRef, useEffect } from "react";

const PROGRAMS = [
  { nombre: "Diplomado en Compliance, Integridad y Gestión Reputacional", facultad: "Ciencias Jurídicas y Sociales", subtipo: "Diplomado", modalidad: "Online sincrónico", inicio: "02/07/2026", termino: "26/11/2026", duracion: "5 meses", arancel: "$900.000", matricula: "$100.000", horario: "Martes y jueves de 19.00 a 20.30 horas", director: "Katrina Karen Badilla Guzman", objetivo: "Desarrollar competencias directivas para diseñar sistemas de compliance, fortalecer la cultura de integridad y gestionar crisis reputacionales, protegiendo la sostenibilidad y confianza de organizaciones públicas y privadas.", aprenderas: "Serás capaz de diagnosticar riesgos éticos, interpretar marcos normativos complejos y liderar la estrategia comunicacional ante incidentes críticos, convirtiéndote en un guardián de la confianza institucional.", perfil: "Profesionales de áreas legales, comunicaciones, RR.HH., auditoría o gestión pública que buscan evolucionar desde un rol operativo hacia uno estratégico. No requiere ser abogado.", requisitos: "Título Técnico, Profesional o Licenciatura", claim: "Donde la ley termina, la reputación comienza. Lidera ambos frentes.", atributos: ["Doble blindaje estratégico: Único programa que integra la rigurosidad legal del Derecho con la gestión de crisis.", "Respuesta a la nueva era regulatoria: Te actualiza frente a las exigencias de la Ley de Delitos Económicos.", "De la teoría a la trinchera: Metodología aplicada con simulaciones de crisis reales.", "Compatible con tu ascenso: Formato 100% online sincrónico diseñado para ejecutivos."], codigo: "DCIGR1AR", ola: "Ola 1", vacantes: 30 },
  { nombre: "Curso en Marco normativo, Compliance e Integridad", facultad: "Ciencias Jurídicas y Sociales", subtipo: "Curso", modalidad: "Online sincrónico", inicio: "02/07/2026", termino: "30/07/2026", duracion: "1 mes", arancel: "$200.000", matricula: "$1", horario: "Martes y jueves de 19.00 a 20.30 horas", director: "Katrina Karen Badilla Guzman", objetivo: "Comprender y aplicar el marco jurídico vigente y los modelos de integridad exigidos por la normativa nacional para mitigar la responsabilidad penal de las personas jurídicas.", aprenderas: "Interpretarás con solvencia las leyes de cumplimiento (incluida la Ley 21.595) para asesorar procesos de prevención y control normativo con base sólida.", perfil: "Abogados, contralores, gerentes y directivos que necesitan una actualización urgente sobre las nuevas leyes.", requisitos: "Título Técnico, Profesional o Licenciatura", claim: "Ley 21.595: Las reglas cambiaron. ¿Tu organización sigue jugando con las viejas?", atributos: ["Dominio del mapa legal actual: Profundiza en la Ley N° 21.595 y N° 20.393.", "Visión estratégica del regulador: Comprende qué buscan realmente la UAF y la OCDE.", "Base sólida para la toma de decisiones.", "Identificación de la responsabilidad: Clarifica quiénes son los sujetos responsables."], codigo: "CMNCI1AR", ola: "Ola 1", vacantes: 30 },
  { nombre: "Curso en Gestión de Riesgos Éticos", facultad: "Ciencias Jurídicas y Sociales", subtipo: "Curso", modalidad: "Online sincrónico", inicio: "04/08/2026", termino: "27/08/2026", duracion: "1 mes", arancel: "$200.000", matricula: "$1", horario: "Martes y jueves de 19.00 a 20.30 horas", director: "Katrina Karen Badilla Guzman", objetivo: "Diseñar prácticas de compliance basadas en el análisis de conducta y matrices de riesgo para fortalecer la cultura ética interna y prevenir incumplimientos.", aprenderas: "Podrás levantar matrices de riesgo reales y gestionar el cambio cultural necesario para que el compliance sea parte del ADN de la empresa.", perfil: "Profesionales de RR.HH., Desarrollo Organizacional y Compliance que entienden que el control debe ir acompañado de un cambio cultural.", requisitos: "Título Técnico, Profesional o Licenciatura", claim: "El riesgo no está en los contratos, está en las personas. Aprende a gestionarlo.", atributos: ["Gestión del Factor Humano: Diagnosticar y moldear la cultura interna.", "Creación de Matrices de Riesgo Reales.", "Empoderamiento del Oficial de Cumplimiento.", "Prevención basada en datos."], codigo: "CGRET1AR", ola: "Ola 1", vacantes: 30 },
  { nombre: "Diplomado en Dinámica y Espacialidad Escénica", facultad: "Artes", subtipo: "Diplomado", modalidad: "Semipresencial", inicio: "02/06/2026", termino: "24/10/2026", duracion: "5 meses", arancel: "$1.000.000", matricula: "$100.000", horario: "Martes y jueves online 19.00-20.30 hrs y un sábado mensual presencial 09.00-17.00 hrs", director: "Carlos Delgado Lizama", objetivo: "Integrar los principios teóricos y prácticos de la coréutica (espacio) y la eukinética (dinámica) para potenciar la creación, interpretación y docencia en danza y teatro.", aprenderas: "Serás capaz de diseñar composiciones de movimiento complejas, analizar la espacialidad con precisión geométrica y aplicar dinámicas expresivas conscientes.", perfil: "Actores, bailarines, coreógrafos, directores escénicos y docentes que necesitan sistematizar su conocimiento corporal.", requisitos: "No se especifican requisitos académicos previos", claim: "Deja de moverte por intuición. Empieza a crear con intención.", atributos: ["Metodología Internacional: Domina los sistemas Laban-Jooss-Leeder.", "Del Gesto a la Dramaturgia.", "Formato Híbrido Efectivo.", "Docencia de Elite."], codigo: "DDESE1SR", ola: "Ola 1", vacantes: 30 },
  { nombre: "Diplomado en Comunicaciones Internas", facultad: "Comunicaciones", subtipo: "Diplomado", modalidad: "Online asincrónico + sesiones sincrónicas", inicio: "04/05/2026", termino: "21/08/2026", duracion: "4 meses", arancel: "$900.000", matricula: "$100.000", horario: "Asincrónico con clases opcionales sincrónicas los miércoles de 19.00 a 20.30 horas", director: "Alejandra Natalia Riveros Martinez", objetivo: "Formar especialistas capaces de analizar contextos organizacionales y diseñar estrategias de comunicación interna que fortalezcan la cultura, el liderazgo y el alineamiento interno.", aprenderas: "Podrás analizar contextos organizacionales complejos, interpretar audiencias internas y diseñar estrategias de comunicación interna alineadas con los objetivos institucionales.", perfil: "Profesionales que se desempeñan en áreas de comunicación interna, comunicación corporativa, gestión de personas, liderazgo o cambio organizacional.", requisitos: "Título Técnico, Profesional o Licenciatura; Experiencia Laboral", claim: "Logra MÁS que informar: moviliza la cultura de tu organización.", atributos: ["Comunicación interna con rol estratégico.", "Gestión de intangibles organizacionales: cultura, clima, liderazgo y compromiso.", "Comunicación para el cambio.", "Decisiones comunicacionales fundamentadas."], codigo: "DCOIN1AR", ola: "Ola 1", vacantes: 30 },
  { nombre: "Diplomado en Comunicación y Marketing Digital", facultad: "Comunicaciones", subtipo: "Diplomado", modalidad: "Online asincrónico + sesiones sincrónicas", inicio: "04/05/2026", termino: "21/08/2026", duracion: "4 meses", arancel: "$900.000", matricula: "$100.000", horario: "Asincrónico con clases opcionales sincrónicas los martes de 19.00 a 20.30 horas", director: "Alejandra Natalia Riveros Martinez", objetivo: "Formar profesionales capaces de diseñar, ejecutar y evaluar estrategias de comunicación y marketing digital, utilizando datos, contenidos y branding para posicionar marcas.", aprenderas: "Podrás diseñar estrategias digitales con sentido estratégico, analizar audiencias y métricas para fundamentar decisiones, gestionar contenidos y redes sociales con criterio profesional.", perfil: "Profesionales que trabajan en comunicación, marketing, contenidos o gestión digital.", requisitos: "Título Técnico, Profesional o Licenciatura; Experiencia Laboral", claim: "Diseña estrategias MÁS inteligentes y efectivas.", atributos: ["Estrategia digital con criterio profesional.", "Datos antes que intuición.", "Comunicación + marketing, integrados.", "Del contenido al posicionamiento."], codigo: "DCMDI1AR", ola: "Ola 1", vacantes: 30 },
  { nombre: "Diplomado en Psicoterapia Online: Diseño y Análisis de Intervenciones Clínicas", facultad: "Psicología", subtipo: "Diplomado", modalidad: "Online sincrónico", inicio: "07/05/2026", termino: "05/09/2026", duracion: "4 meses", arancel: "$900.000", matricula: "$100.000", horario: "Jueves 19.00 a 21.00 horas y sábado de 09.00 a 12.00 horas", director: "Cristopher Arturo Urbina Yañez", objetivo: "Formar psicólogos clínicos expertos en el diseño y evaluación de intervenciones online, capaces de manejar el vínculo, la ética y la técnica en entornos virtuales.", aprenderas: "Podrás fundamentar clínicamente tus decisiones online, manejar crisis a distancia y diseñar encuadres seguros que protejan tanto al paciente como tu responsabilidad profesional.", perfil: "Psicólogos clínicos que ya atienden online (o quieren hacerlo) y sienten la necesidad de validar, proteger y perfeccionar su práctica.", requisitos: "Título Profesional o Licenciatura", claim: "Tu consulta cambió. ¿Tu técnica clínica sigue siendo la misma?", atributos: ["No es adaptar, es especializar.", "Blindaje Ético y Digital.", "Diferenciación por Edad.", "Metodología de Análisis de Caso."], codigo: "DPODA1AR", ola: "Ola 1", vacantes: 30 },
  { nombre: "Diplomado en Derecho de Familia, Mediación e Intervención Familiar", facultad: "Ciencias Jurídicas y Sociales", subtipo: "Diplomado", modalidad: "Online sincrónico", inicio: "01/06/2026", termino: "21/11/2026", duracion: "6 meses", arancel: "$900.000", matricula: "$100.000", horario: "Lunes de 19.00 a 21:00 horas + 2 sábados de 09.00 a 13.00 horas", director: "Miguel Antonio Gatica Chandia", objetivo: "Desarrollar competencias especializadas para analizar y aplicar fundamentos del Derecho de Familia, procedimientos judiciales y modelos de intervención en contextos de alta conflictividad familiar.", aprenderas: "Aprenderás a comprender y relacionar el marco jurídico, los procedimientos de familia y los modelos de intervención, aplicándolos a situaciones reales del trabajo con familias.", perfil: "Psicólogos, trabajadores o asistentes sociales, profesores, personal de PDI o Carabineros de Chile, entre otros.", requisitos: "Título Técnico, Profesional o Licenciatura", claim: "Formación sociojurídica para intervenir con criterio, ética y enfoque de derechos en contextos familiares complejos.", atributos: ["Mirada Sociojurídica Integrada.", "Actualización Normativa Relevante.", "Enfoque Interdisciplinario Real.", "Modalidad Compatible con el Trabajo Profesional."], codigo: "DDFMI1AR", ola: "Ola 2", vacantes: 30 },
  { nombre: "Diplomado en E-learning", facultad: "Negocios y Tecnología", subtipo: "Diplomado", modalidad: "Online sincrónico", inicio: "10/06/2026", termino: "09/12/2026", duracion: "6 meses", arancel: "$800.000", matricula: "$100.000", horario: "Miércoles, 19.00 a 21.00 horas", director: "Danilo Bermudez Macias; Cristóbal Alberto Hollstein Carmona", objetivo: "Diseñar, implementar y liderar experiencias educativas online de alta calidad, inclusivas y centradas en el estudiante.", aprenderas: "Aprenderás a diseñar, evaluar y gestionar experiencias de aprendizaje online efectivas, aplicando herramientas pedagógicas, tecnológicas y humanas en contextos reales.", perfil: "Personas interesadas en educación online, capacitación y formación digital.", requisitos: "Certificado de enseñanza media (LEM)", claim: "Diseña experiencias educativas digitales que conectan, incluyen y transforman.", atributos: ["Neuroeducación aplicada.", "IA con sentido pedagógico.", "Educación inclusiva y humana.", "Gestión y calidad e-learning."], codigo: "DELEA1AR", ola: "Ola 3", vacantes: 30 },
  { nombre: "Curso de Lengua de Señas Chilena (LSCh): Primeros Auxilios Comunicacionales e Inclusión Social", facultad: "Diversidad, Género e Inclusión", subtipo: "Curso", modalidad: "Online sincrónico", inicio: "05/05/2026", termino: "28/05/2026", duracion: "4 semanas", arancel: "$150.000", matricula: "$1", horario: "Martes y jueves, 18.30 a 20.00 horas", director: "Yendiryn Lucero Cifuentes Huete", objetivo: "Aplicar herramientas básicas de Lengua de Señas Chilena para establecer un primer contacto comunicacional efectivo e inclusivo con personas sordas.", aprenderas: "Aprenderás a comunicarte de forma básica y funcional en Lengua de Señas Chilena para interactuar con personas sordas en contextos cotidianos, laborales y de atención inicial.", perfil: "Público general, personas que se desempeñen en educación, salud, servicios públicos, organizaciones sociales y empresas.", requisitos: "No requiere formación académica previa (LEM)", claim: "Comunicar también es incluir: más herramientas para un diálogo sin barreras.", atributos: ["Primeros Auxilios Comunicacionales.", "Docencia con Personas Sordas.", "Aplicación Inmediata.", "Inclusión con Sentido UNIACC."], codigo: "CLSCI1AR", ola: "Ola 2", vacantes: 30 },
  { nombre: "Curso en IA y herramientas digitales para el marketing y las comunicaciones", facultad: "Comunicaciones", subtipo: "Curso", modalidad: "Online sincrónico", inicio: "07/05/2026", termino: "02/07/2026", duracion: "2 meses", arancel: "$250.000", matricula: "$1", horario: "Jueves, 18.30 a 20.30 horas", director: "Ignacio Antonio Palacios Barria", objetivo: "Integrar inteligencia artificial y herramientas digitales en el diseño y ejecución de estrategias de marketing y comunicación multiplataforma.", aprenderas: "Aprenderás a usar IA y herramientas digitales para crear, prototipar y optimizar campañas de comunicación y marketing aplicables a contextos reales.", perfil: "Personas en ejercicio o formación en áreas de comunicación, marketing, publicidad, relaciones públicas, periodismo y producción de contenidos.", requisitos: "Experiencia Laboral", claim: "Transforma la IA en tu aliada estratégica para crear campañas más inteligentes, creativas y efectivas.", atributos: ["IA aplicada, no teórica.", "Enfoque estratégico y creativo.", "Metodología 100% práctica.", "Sello UNIACC."], codigo: "CIAHD1AR", ola: "Ola 2", vacantes: 30 },
  { nombre: "Curso en Marca personal para psicólogos en redes sociales", facultad: "Psicología", subtipo: "Curso", modalidad: "Online sincrónico", inicio: "04/05/2026", termino: "10/06/2026", duracion: "6 semanas", arancel: "$200.000", matricula: "$1", horario: "Lunes y miércoles, 19.00 a 20.30 horas", director: "Cristopher Arturo Urbina Yañez", objetivo: "Desarrollar una marca personal profesional en redes sociales, integrando estrategia comunicacional, ética psicológica y creación de contenidos digitales aplicados.", aprenderas: "Aprenderás a diseñar y activar tu identidad profesional en redes sociales, creando contenidos psicológicos claros, éticos y alineados con tus objetivos laborales.", perfil: "Psicólogos/as titulados/as y estudiantes en último año de Psicología o en proceso de egreso.", requisitos: "Título Profesional o Licenciatura", claim: "Haz visible tu profesión en redes, sin perder ética, rigor ni propósito.", atributos: ["Psicología + Comunicación Estratégica.", "Ética Profesional Aplicada.", "Aprendizaje 100% Práctico.", "Docencia Experta y Activa en Redes."], codigo: "CMPPR1AR", ola: "Ola 2", vacantes: 30 },
  { nombre: "Taller Storytelling Jurídico", facultad: "Ciencias Jurídicas y Sociales", subtipo: "Curso", modalidad: "Presencial", inicio: "30/05/2026", termino: "27/06/2026", duracion: "1 mes", arancel: "$200.000", matricula: "$1", horario: "Sábado, 09.30 a 12.30 horas", director: "Doris Espinoza Torres", objetivo: "Diseñar relatos jurídicos persuasivos que integren hechos, normas y argumentos en discursos claros y estratégicos.", aprenderas: "Aprenderás a transformar tus alegatos y presentaciones jurídicas en narrativas claras, coherentes y convincentes, aplicables de inmediato en litigación y asesoría.", perfil: "Abogados y abogadas titulados/as o licenciados/as en Ciencias Jurídicas.", requisitos: "Título Profesional o Licenciatura", claim: "Convierte tus argumentos jurídicos en relatos que convencen.", atributos: ["Derecho + Narrativa Escénica.", "Rigor técnico sin perder persuasión.", "Formato Workshop Intensivo.", "Aplicación Inmediata."], codigo: "TSJAN1DR", ola: "Ola 3", vacantes: null },
  { nombre: "Curso en Apreciación y Crítica de Cine", facultad: "Comunicaciones", subtipo: "Curso", modalidad: "Online sincrónico", inicio: "01/06/2026", termino: "27/07/2026", duracion: "2 meses", arancel: "$250.000", matricula: "$1", horario: "Lunes, 19.00 a 21.00 horas", director: "Alejandra Pinto López", objetivo: "Desarrollar herramientas de análisis e interpretación cinematográfica para comprender el cine como construcción de sentido y discurso cultural.", aprenderas: "Aprenderás a analizar e interpretar películas con herramientas críticas concretas para argumentar tus propias lecturas cinematográficas.", perfil: "Personas interesadas en el cine, el análisis audiovisual y la reflexión cultural. No se requiere formación técnica previa.", requisitos: "Certificado de enseñanza media (LEM)", claim: "Aprende a mirar el cine con profundidad, criterio y voz propia.", atributos: ["Canon + Cine Contemporáneo.", "Enfoque Humanista Siglo XXI.", "Formación en Crítica Real.", "Docentes Activos en el Medio."], codigo: "CACCI1AR", ola: "Ola 3", vacantes: null },
  { nombre: "Pasantía Clínica en Psicología y Salud Mental Comunitaria", facultad: "Psicología", subtipo: "Pasantía", modalidad: "Presencial", inicio: "Por definir", termino: "Por definir", duracion: "5 meses", arancel: "$1", matricula: "$1", horario: "Por definir", director: "Aline Andrea Orellana Araya", objetivo: "Fortalecer la práctica clínica profesional mediante intervenciones psicológicas supervisadas, integrando enfoques basados en evidencia y acciones de salud mental comunitaria en contextos reales.", aprenderas: "Aprenderás a intervenir clínicamente en contextos reales, integrando distintos enfoques psicológicos y acciones comunitarias bajo supervisión profesional constante.", perfil: "Psicólogos/as titulados/as, con interés en profundizar su práctica clínica y su experiencia en salud mental comunitaria.", requisitos: "Título Profesional o Licenciatura; Experiencia Laboral; Entrevista personal", claim: "Practica, reflexiona y consolida tu rol clínico donde la salud mental ocurre.", atributos: ["Práctica Clínica Real Supervisada.", "Enfoque en Salud Mental Comunitaria.", "Formación Ética y Reflexiva.", "Inserción Profesional Progresiva."], codigo: "PCPSM1DR", ola: "Ola 2", vacantes: 7 },
];

const FACULTAD_COLORS = {
  "Artes": "#F26522",
  "Comunicaciones": "#3B9BD6",
  "Psicología": "#9B59B6",
  "Ciencias Jurídicas y Sociales": "#2ECC71",
  "Negocios y Tecnología": "#F26522",
  "Diversidad, Género e Inclusión": "#E91E8C",
  "Arquitectura y Diseño": "#3B9BD6",
};

const MAS_MAGENTA = "#E91E8C";
const MAS_BLUE = "#3B9BD6";
const MAS_ORANGE = "#F26522";
const MAS_BLACK = "#1A1A1A";

function getColor(facultad) {
  return FACULTAD_COLORS[facultad] || MAS_BLUE;
}

// māS Logo SVG
function MasLogo({ dark = false, size = 36 }) {
  const color = dark ? "#fff" : MAS_BLACK;
  return (
    <svg width={size * 2.5} height={size} viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* "m" */}
      <text x="0" y="36" fontFamily="'Montserrat', sans-serif" fontWeight="300" fontSize="40" fill={color} letterSpacing="-1">m</text>
      {/* "ā" with macron */}
      <text x="39" y="36" fontFamily="'Montserrat', sans-serif" fontWeight="300" fontSize="40" fill={dark ? "#fff" : MAS_MAGENTA}>ā</text>
      {/* "s" */}
      <text x="72" y="36" fontFamily="'Montserrat', sans-serif" fontWeight="300" fontSize="40" fill={color}>s</text>
      {/* Colored underline dashes */}
      <rect x="18" y="43" width="18" height="2.5" rx="1.25" fill={MAS_ORANGE}/>
      <rect x="40" y="43" width="18" height="2.5" rx="1.25" fill={MAS_BLUE}/>
      <rect x="62" y="43" width="18" height="2.5" rx="1.25" fill={MAS_MAGENTA}/>
    </svg>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [filterFacultad, setFilterFacultad] = useState("Todas");
  const [filterSubtipo, setFilterSubtipo] = useState("Todos");
  const [filterModalidad, setFilterModalidad] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("filter"); // "filter" | "ai"
  const [aiAnswer, setAiAnswer] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [contentType, setContentType] = useState("email");
  const [generatedContent, setGeneratedContent] = useState("");
  const [contentLoading, setContentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const FACULTADES = ["Todas", ...new Set(PROGRAMS.map(p => p.facultad))];
  const SUBTIPOS = ["Todos", ...new Set(PROGRAMS.map(p => p.subtipo))];
  const MODALIDADES = ["Todas", ...new Set(PROGRAMS.map(p => p.modalidad))];

  const filteredPrograms = useMemo(() => {
    if (searchMode === "ai") return PROGRAMS;
    return PROGRAMS.filter(p => {
      const matchFacultad = filterFacultad === "Todas" || p.facultad === filterFacultad;
      const matchSubtipo = filterSubtipo === "Todos" || p.subtipo === filterSubtipo;
      const matchModalidad = filterModalidad === "Todas" || p.modalidad === filterModalidad;
      const matchSearch = !searchQuery ||
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.facultad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.objetivo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFacultad && matchSubtipo && matchModalidad && matchSearch;
    });
  }, [filterFacultad, filterSubtipo, filterModalidad, searchQuery, searchMode]);

  const isQuestion = (text) => {
    const q = text.toLowerCase();
    return q.includes("?") || q.includes("cuál") || q.includes("cuánto") || q.includes("cómo") ||
      q.includes("qué") || q.includes("cuándo") || q.includes("dónde") || q.includes("cuanto") ||
      q.includes("precio") || q.includes("costo") || q.includes("valor") || q.includes("cuando") ||
      q.includes("quien") || q.includes("quién") || q.includes("tiene") || q.includes("hay") ||
      q.includes("saber") || q.includes("necesito") || q.includes("me puedes") || q.includes("puedes decirme");
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setAiAnswer(null);
    if (val.length > 8 && isQuestion(val)) {
      setSearchMode("ai");
    } else {
      setSearchMode("filter");
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim() || aiLoading) return;
    setSearchMode("ai");
    setAiLoading(true);
    setAiAnswer(null);

    const allData = PROGRAMS.map(p =>
      `Programa: ${p.nombre} | Facultad: ${p.facultad} | Tipo: ${p.subtipo} | Arancel: ${p.arancel} | Matrícula: ${p.matricula} | Inicio: ${p.inicio} | Duración: ${p.duracion} | Modalidad: ${p.modalidad} | Horario: ${p.horario} | Director: ${p.director} | Código: ${p.codigo}`
    ).join("\n");

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: `Eres el asistente de māS Educación Continua UNIACC 2026. Responde preguntas sobre los programas de forma clara, directa y amigable en español. Aquí están todos los programas disponibles:\n\n${allData}\n\nResponde siempre de forma concisa (máximo 3 párrafos). Si preguntan por precio, arancel o costo de algún programa específico, dalo con claridad. Si hay varios programas relevantes, menciónalos brevemente.`,
          messages: [{ role: "user", content: searchQuery }]
        })
      });
      const data = await res.json();
      setAiAnswer(data.content?.[0]?.text || "No pude encontrar esa información.");
    } catch {
      setAiAnswer("Hubo un error al consultar. Intenta nuevamente.");
    }
    setAiLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newMessages = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(newMessages);
    setChatLoading(true);

    const ctx = selectedProgram
      ? `Programa: ${selectedProgram.nombre}\nFacultad: ${selectedProgram.facultad}\nObjetivo: ${selectedProgram.objetivo}\nPerfil: ${selectedProgram.perfil}\nArancel: ${selectedProgram.arancel}\nMatrícula: ${selectedProgram.matricula}\nModalidad: ${selectedProgram.modalidad}\nDuración: ${selectedProgram.duracion}\nHorario: ${selectedProgram.horario}\nDirector: ${selectedProgram.director}\nRequisitos: ${selectedProgram.requisitos}\nAprendizajes: ${selectedProgram.aprenderas}\nAtributos: ${selectedProgram.atributos.join("; ")}\nClaim: ${selectedProgram.claim}`
      : "";

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Eres un asesor académico de māS Educación Continua UNIACC. Responde con claridad y cercanía en español.\n${ctx}`,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: "assistant", content: data.content?.[0]?.text || "Error al procesar tu consulta." }]);
    } catch {
      setChatMessages([...newMessages, { role: "assistant", content: "Error al conectar. Intenta nuevamente." }]);
    }
    setChatLoading(false);
  };

  const generateContent = async () => {
    if (!selectedProgram || contentLoading) return;
    setContentLoading(true);
    setGeneratedContent("");
    const prompts = {
      email: `Escribe un email de marketing persuasivo para "${selectedProgram.nombre}" dirigido a ${selectedProgram.perfil}. Incluye asunto, cuerpo y CTA. Usa el claim: "${selectedProgram.claim}". Arancel: ${selectedProgram.arancel}. Inicio: ${selectedProgram.inicio}.`,
      linkedin: `Crea un post de LinkedIn profesional para "${selectedProgram.nombre}". Con emojis y hasta 3 hashtags. Claim: "${selectedProgram.claim}". Máximo 300 palabras.`,
      whatsapp: `Mensaje de WhatsApp corto y llamativo para "${selectedProgram.nombre}". Con emojis. Máximo 150 palabras. Incluye fechas, arancel (${selectedProgram.arancel}) y duración (${selectedProgram.duracion}).`,
      ficha: `Ficha informativa de "${selectedProgram.nombre}" con: Descripción, Dirigido a, Qué aprenderás, Aspectos clave, Datos prácticos y Próximos pasos.`,
      blog: `Artículo de blog de 400 palabras sobre "${selectedProgram.nombre}". Por qué es relevante hoy y qué diferencia a los graduados. Tono inspirador y profesional.`,
    };
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Eres experto en marketing educativo de māS UNIACC. Contexto: Facultad: ${selectedProgram.facultad}, Objetivo: ${selectedProgram.objetivo}, Modalidad: ${selectedProgram.modalidad}, Duración: ${selectedProgram.duracion}.`,
          messages: [{ role: "user", content: prompts[contentType] }]
        })
      });
      const data = await res.json();
      setGeneratedContent(data.content?.[0]?.text || "Error al generar.");
    } catch {
      setGeneratedContent("Error al conectar.");
    }
    setContentLoading(false);
  };

  const openProgram = (p) => {
    setSelectedProgram(p);
    setView("detail");
    setActiveTab("info");
    setChatMessages([]);
    setGeneratedContent("");
  };

  const accent = selectedProgram ? getColor(selectedProgram.facultad) : MAS_MAGENTA;

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: "100vh", background: "#F7F7F5", color: MAS_BLACK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #eee; } ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
        .card { transition: all 0.25s ease; cursor: pointer; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important; }
        .btn { cursor: pointer; border: none; transition: all 0.18s; font-family: 'Montserrat', sans-serif; }
        .btn:hover { opacity: 0.88; }
        .btn:active { transform: scale(0.97); }
        input, select, textarea { font-family: 'Montserrat', sans-serif; }
        .chip { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease; }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .dot { animation: pulse 1.2s ease infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .tab-btn { cursor: pointer; border: none; background: none; font-family: 'Montserrat', sans-serif; transition: all 0.2s; }
        input:focus, select:focus, textarea:focus { outline: none; }
        .search-wrap:focus-within { box-shadow: 0 0 0 2px ${MAS_MAGENTA}33; }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "#fff", borderBottom: "1px solid #E8E8E8", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {view !== "home" && (
            <button className="btn" onClick={() => { setView("home"); setSelectedProgram(null); }}
              style={{ background: "#F0F0F0", color: "#666", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 500 }}>
              ← Volver
            </button>
          )}
          <MasLogo dark={false} size={32} />
          <div style={{ width: "1px", height: "28px", background: "#E0E0E0" }} />
          <span style={{ fontSize: "12px", color: "#999", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Educación Continua 2026</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ background: "#F0F0F0", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", color: "#888", fontWeight: 600 }}>
            {PROGRAMS.length} programas
          </span>
        </div>
      </header>

      {/* HOME VIEW */}
      {view === "home" && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>

          {/* Hero */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "4px", height: "52px", background: `linear-gradient(to bottom, ${MAS_MAGENTA}, ${MAS_BLUE})`, borderRadius: "2px", marginTop: "4px" }} />
              <div>
                <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.15, color: MAS_BLACK }}>
                  Transformando la<br />
                  <span style={{ color: MAS_MAGENTA }}>educación continua</span><br />
                  en evolución profesional
                </h1>
              </div>
            </div>
            <p style={{ color: "#888", fontSize: "15px", marginLeft: "12px" }}>
              Explora programas, filtra por área o pregunta directamente en el buscador
            </p>
          </div>

          {/* Smart Search */}
          <div style={{ marginBottom: "32px" }}>
            <div className="search-wrap" style={{ background: "#fff", border: "1.5px solid #E0E0E0", borderRadius: "14px", padding: "4px", display: "flex", alignItems: "center", maxWidth: "680px", transition: "box-shadow 0.2s" }}>
              <span style={{ padding: "0 14px", fontSize: "18px", color: "#ccc" }}>
                {searchMode === "ai" ? "✦" : "🔍"}
              </span>
              <input
                placeholder="Busca un programa o pregunta algo... ej: ¿Cuánto cuesta el curso de IA?"
                value={searchQuery}
                onChange={handleSearch}
                onKeyDown={e => { if (e.key === "Enter") handleSearchSubmit(); }}
                style={{ flex: 1, border: "none", background: "transparent", fontSize: "14px", color: MAS_BLACK, padding: "12px 0" }}
              />
              {searchQuery && (
                <button className="btn" onClick={() => { setSearchQuery(""); setSearchMode("filter"); setAiAnswer(null); }}
                  style={{ background: "none", color: "#bbb", padding: "8px 12px", fontSize: "18px" }}>×</button>
              )}
              <button className="btn" onClick={handleSearchSubmit}
                style={{ background: MAS_MAGENTA, color: "#fff", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, margin: "2px" }}>
                Buscar
              </button>
            </div>
            {searchMode === "ai" && (
              <p style={{ fontSize: "12px", color: MAS_MAGENTA, marginTop: "8px", marginLeft: "4px", fontWeight: 500 }}>
                ✦ Modo pregunta activo — presiona Buscar o Enter para obtener una respuesta
              </p>
            )}
          </div>

          {/* AI Answer */}
          {(aiLoading || aiAnswer) && (
            <div className="fade-up" style={{ background: "#fff", border: `1.5px solid ${MAS_MAGENTA}33`, borderRadius: "14px", padding: "24px", marginBottom: "32px", maxWidth: "680px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: MAS_MAGENTA, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: "14px" }}>✦</span>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: MAS_MAGENTA, letterSpacing: "1px", textTransform: "uppercase" }}>Respuesta māS</span>
              </div>
              {aiLoading ? (
                <div style={{ display: "flex", gap: "6px", padding: "4px 0" }}>
                  {[0,1,2].map(i => <div key={i} className="dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: MAS_MAGENTA }} />)}
                </div>
              ) : (
                <p style={{ color: "#444", fontSize: "14px", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{aiAnswer}</p>
              )}
            </div>
          )}

          {/* Filters */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap", alignItems: "center" }}>
            {[
              { val: filterFacultad, set: setFilterFacultad, opts: FACULTADES, label: "Facultad" },
              { val: filterSubtipo, set: setFilterSubtipo, opts: SUBTIPOS, label: "Tipo" },
              { val: filterModalidad, set: setFilterModalidad, opts: MODALIDADES, label: "Modalidad" },
            ].map(f => (
              <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)}
                style={{ background: "#fff", border: "1.5px solid #E0E0E0", color: "#555", padding: "9px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
            <span style={{ color: "#aaa", fontSize: "13px", marginLeft: "4px" }}>
              {filteredPrograms.length} resultado{filteredPrograms.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "18px" }}>
            {filteredPrograms.map((p, i) => {
              const color = getColor(p.facultad);
              return (
                <div key={i} className="card" onClick={() => openProgram(p)}
                  style={{ background: "#fff", borderRadius: "14px", padding: "24px", border: "1.5px solid #EBEBEB", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
                  {/* Top color accent */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <span className="chip" style={{ background: color + "18", color: color }}>{p.subtipo}</span>
                    <span style={{ fontSize: "11px", color: "#bbb", fontWeight: 500 }}>{p.ola}</span>
                  </div>

                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: MAS_BLACK, marginBottom: "6px", lineHeight: 1.4 }}>{p.nombre}</h3>
                  <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "14px", fontWeight: 500 }}>{p.facultad}</p>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, marginBottom: "18px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.objetivo}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #F0F0F0", paddingTop: "14px" }}>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: MAS_BLACK }}>{p.arancel}</div>
                      <div style={{ fontSize: "11px", color: "#bbb", marginTop: "2px" }}>{p.duracion} · {p.modalidad.split(" ")[0]}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "11px", color: "#bbb" }}>Inicio</div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>{p.inicio}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPrograms.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px", color: "#ccc" }}>
              <div style={{ fontSize: "42px", marginBottom: "12px" }}>🔍</div>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>Sin resultados</div>
              <div style={{ fontSize: "14px", marginTop: "8px" }}>Intenta con otros filtros</div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL VIEW */}
      {view === "detail" && selectedProgram && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>

          {/* Program Header Card */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", marginBottom: "24px", border: "1.5px solid #EBEBEB", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderTop: `4px solid ${accent}` }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
              <span className="chip" style={{ background: accent + "18", color: accent }}>{selectedProgram.subtipo}</span>
              <span className="chip" style={{ background: "#F5F5F5", color: "#888" }}>{selectedProgram.facultad}</span>
              <span className="chip" style={{ background: "#F5F5F5", color: "#888" }}>{selectedProgram.ola}</span>
            </div>
            <h1 style={{ fontSize: "clamp(20px, 2.5vw, 30px)", fontWeight: 800, color: MAS_BLACK, marginBottom: "10px", lineHeight: 1.3 }}>{selectedProgram.nombre}</h1>
            <p style={{ color: "#aaa", fontSize: "14px", fontStyle: "italic", marginBottom: "28px", fontWeight: 400 }}>"{selectedProgram.claim}"</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
              {[
                { label: "Arancel", val: selectedProgram.arancel, highlight: true },
                { label: "Matrícula", val: selectedProgram.matricula },
                { label: "Duración", val: selectedProgram.duracion },
                { label: "Modalidad", val: selectedProgram.modalidad },
                { label: "Inicio", val: selectedProgram.inicio },
                { label: "Término", val: selectedProgram.termino },
              ].map(item => (
                <div key={item.label} style={{ background: "#F8F8F8", borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "10px", color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: item.highlight ? 800 : 600, color: item.highlight ? accent : MAS_BLACK }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", background: "#fff", border: "1.5px solid #EBEBEB", borderRadius: "12px", padding: "6px", marginBottom: "24px", gap: "4px" }}>
            {[
              { id: "info", label: "Información" },
              { id: "chat", label: "Consultas IA" },
              { id: "content", label: "Generar Contenido" },
            ].map(tab => (
              <button key={tab.id} className="tab-btn"
                onClick={() => setActiveTab(tab.id)}
                style={{ flex: 1, padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                  background: activeTab === tab.id ? accent : "transparent",
                  color: activeTab === tab.id ? "#fff" : "#aaa" }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* INFO TAB */}
          {activeTab === "info" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "Objetivo del Programa", content: selectedProgram.objetivo },
                { label: "¿Qué Aprenderás?", content: selectedProgram.aprenderas },
                { label: "Perfil de Ingreso", content: `${selectedProgram.perfil}\n\nRequisito: ${selectedProgram.requisitos}` },
              ].map(block => (
                <div key={block.label} style={{ background: "#fff", border: "1.5px solid #EBEBEB", borderRadius: "14px", padding: "24px" }}>
                  <div style={{ fontSize: "11px", color: accent, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "12px" }}>{block.label}</div>
                  <p style={{ color: "#555", lineHeight: 1.75, fontSize: "14px", whiteSpace: "pre-wrap" }}>{block.content}</p>
                </div>
              ))}
              <div style={{ background: "#fff", border: "1.5px solid #EBEBEB", borderRadius: "14px", padding: "24px" }}>
                <div style={{ fontSize: "11px", color: accent, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "12px" }}>Atributos del Programa</div>
                {selectedProgram.atributos.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: i < selectedProgram.atributos.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                    <span style={{ color: accent, fontSize: "14px", marginTop: "1px" }}>✦</span>
                    <span style={{ color: "#555", fontSize: "13px", lineHeight: 1.6 }}>{a}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", border: "1.5px solid #EBEBEB", borderRadius: "14px", padding: "24px", gridColumn: "1 / -1" }}>
                <div style={{ fontSize: "11px", color: accent, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "16px" }}>Información Adicional</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                  {[
                    { l: "Director(a)", v: selectedProgram.director },
                    { l: "Horario", v: selectedProgram.horario },
                    { l: "Código", v: selectedProgram.codigo },
                  ].map(i => (
                    <div key={i.l}>
                      <div style={{ fontSize: "11px", color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>{i.l}</div>
                      <div style={{ fontSize: "14px", color: "#555", fontWeight: 500 }}>{i.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div style={{ background: "#fff", border: "1.5px solid #EBEBEB", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", minHeight: "500px" }}>
              <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #F0F0F0" }}>
                <div style={{ fontSize: "11px", color: accent, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "4px" }}>Asistente IA</div>
                <div style={{ fontSize: "13px", color: "#aaa" }}>Resuelve dudas sobre {selectedProgram.nombre}</div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", minHeight: "280px", maxHeight: "360px", paddingRight: "4px", marginBottom: "16px" }}>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <span style={{ fontSize: "22px" }}>💬</span>
                    </div>
                    <div style={{ color: "#bbb", fontSize: "14px", marginBottom: "20px" }}>Haz tu primera pregunta sobre este programa</div>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                      {["¿Cuándo inicia?", "¿A quién está dirigido?", "¿Qué aprenderé?"].map(q => (
                        <button key={q} className="btn" onClick={() => setChatInput(q)}
                          style={{ background: "#F7F7F7", border: `1.5px solid ${accent}33`, color: "#777", padding: "8px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: 500 }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className="fade-up" style={{ marginBottom: "14px", display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "78%", padding: "12px 16px", borderRadius: "12px", fontSize: "14px", lineHeight: 1.65,
                      background: msg.role === "user" ? accent : "#F5F5F5",
                      color: msg.role === "user" ? "#fff" : "#444",
                      borderBottomRightRadius: msg.role === "user" ? "4px" : "12px",
                      borderBottomLeftRadius: msg.role === "user" ? "12px" : "4px",
                    }}>{msg.content}</div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ display: "flex", gap: "5px", padding: "12px 16px", background: "#F5F5F5", borderRadius: "12px", borderBottomLeftRadius: "4px", width: "fit-content" }}>
                    {[0,1,2].map(i => <div key={i} className="dot" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#ccc" }} />)}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <textarea placeholder="Escribe tu pregunta..." value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                  style={{ flex: 1, height: "44px", resize: "none", border: "1.5px solid #E0E0E0", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", color: MAS_BLACK, background: "#FAFAFA" }} />
                <button className="btn" onClick={sendChat} disabled={chatLoading}
                  style={{ background: accent, color: "#fff", padding: "12px 22px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", opacity: chatLoading ? 0.5 : 1 }}>
                  →
                </button>
              </div>
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === "content" && (
            <div style={{ background: "#fff", border: "1.5px solid #EBEBEB", borderRadius: "14px", padding: "24px" }}>
              <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #F0F0F0" }}>
                <div style={{ fontSize: "11px", color: accent, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "4px" }}>Generador de Contenido</div>
                <div style={{ fontSize: "13px", color: "#aaa" }}>Crea material de marketing para este programa</div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {[
                  { id: "email", label: "Email" },
                  { id: "linkedin", label: "LinkedIn" },
                  { id: "whatsapp", label: "WhatsApp" },
                  { id: "ficha", label: "Ficha Informativa" },
                  { id: "blog", label: "Artículo Blog" },
                ].map(ct => (
                  <button key={ct.id} className="btn"
                    onClick={() => { setContentType(ct.id); setGeneratedContent(""); }}
                    style={{ padding: "9px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 600,
                      background: contentType === ct.id ? accent : "#F5F5F5",
                      color: contentType === ct.id ? "#fff" : "#888",
                      border: contentType === ct.id ? "none" : "1.5px solid #E8E8E8" }}>
                    {ct.label}
                  </button>
                ))}
              </div>

              <button className="btn" onClick={generateContent} disabled={contentLoading}
                style={{ background: accent, color: "#fff", padding: "12px 28px", borderRadius: "10px", fontWeight: 700, marginBottom: "20px", fontSize: "14px", opacity: contentLoading ? 0.6 : 1 }}>
                {contentLoading ? "Generando..." : "✦ Generar Contenido"}
              </button>

              {generatedContent ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", color: "#bbb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>Contenido Generado</span>
                    <button className="btn" onClick={() => navigator.clipboard?.writeText(generatedContent)}
                      style={{ background: "#F5F5F5", border: "1.5px solid #E8E8E8", color: "#888", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                      Copiar
                    </button>
                  </div>
                  <div style={{ background: "#FAFAFA", border: "1.5px solid #EBEBEB", borderRadius: "12px", padding: "20px", fontSize: "14px", color: "#555", lineHeight: 1.8, maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
                    {generatedContent}
                  </div>
                </div>
              ) : !contentLoading && (
                <div style={{ textAlign: "center", padding: "40px", color: "#ddd" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>✦</div>
                  <div style={{ fontSize: "14px", color: "#bbb" }}>Selecciona un tipo de contenido y genera</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E8E8E8", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "48px", background: "#fff" }}>
        <MasLogo dark={false} size={22} />
        <span style={{ fontSize: "12px", color: "#ccc" }}>UNIACC · Educación Continua 2026</span>
      </footer>
    </div>
  );
}
