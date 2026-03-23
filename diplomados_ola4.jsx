import { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════
   MĀS BRAND TOKENS
═══════════════════════════════════════════════ */
const B = {
  black:   '#0D0D0D',
  pink:    '#E91D8D',
  blue:    '#3AAAD4',
  orange:  '#F5821F',
  white:   '#FFFFFF',
  cream:   '#F7F5F2',
  gray1:   '#F0EDEA',
  gray2:   '#E2DDD8',
  gray3:   '#B0A89E',
  gray4:   '#6E665E',
  gray5:   '#3A342E',

  pinkDim:   '#E91D8D18',
  blueDim:   '#3AAAD418',
  orangeDim: '#F5821F18',
  blackDim:  '#0D0D0D0C',
};

/* Phase colors using brand palette */
const PHASES = [
  { id:'info',     label:'Información base',   s:'Info',     color: B.blue    },
  { id:'assets',   label:'Assets visuales',    s:'Assets',   color: B.pink    },
  { id:'landing',  label:'Landing page',       s:'Landing',  color: B.orange  },
  { id:'piezas',   label:'Piezas difusión',    s:'Piezas',   color: '#9B59B6' },
  { id:'crm',      label:'CRM (Mantis)',        s:'CRM',      color: '#27AE60' },
  { id:'campana',  label:'Campaña',            s:'Campaña',  color: B.pink    },
  { id:'mailings', label:'Mailings',           s:'Mailings', color: B.orange  },
  { id:'director', label:'Contenido director', s:'Director', color: B.blue    },
];

const ALL_TASKS = [
  { id:'info_fechas',    phase:'info',     label:'Fechas definidas (inicio / término)' },
  { id:'info_director',  phase:'info',     label:'Director confirmado' },
  { id:'info_docentes',  phase:'info',     label:'Docentes confirmados' },
  { id:'info_resena',    phase:'info',     label:'Reseña del director lista' },
  { id:'info_modalidad', phase:'info',     label:'Modalidad y duración definidas' },
  { id:'info_arancel',   phase:'info',     label:'Arancel y matrícula definidos' },
  { id:'asset_imagen',   phase:'assets',   label:'Imagen del programa disponible' },
  { id:'asset_fotos',    phase:'assets',   label:'Fotos director / docentes disponibles' },
  { id:'lp_brief',       phase:'landing',  label:'Brief landing page enviado' },
  { id:'lp_pub',         phase:'landing',  label:'Landing page publicada' },
  { id:'lp_rev',         phase:'landing',  label:'Revisión y ajustes completados' },
  { id:'lp_val',         phase:'landing',  label:'Web validada ✓' },
  { id:'pz_brief',       phase:'piezas',   label:'Brief piezas de difusión enviado' },
  { id:'pz_rec',         phase:'piezas',   label:'Piezas recibidas' },
  { id:'pz_rev',         phase:'piezas',   label:'Revisión y ajustes completados' },
  { id:'pz_val',         phase:'piezas',   label:'Piezas validadas ✓' },
  { id:'crm_mantis',     phase:'crm',      label:'Producto ingresado a Mantis' },
  { id:'camp_pres',      phase:'campana',  label:'Presupuesto de campaña definido' },
  { id:'camp_copies',    phase:'campana',  label:'Copies de anuncios redactados' },
  { id:'camp_seg',       phase:'campana',  label:'Segmentación e inputs definidos' },
  { id:'mail_bbdd',      phase:'mailings', label:'Base de datos generada' },
  { id:'mail_sabiasq',   phase:'mailings', label:'Mail "Sabías qué" redactado' },
  { id:'mail_malla',     phase:'mailings', label:'Mail "Conoce la malla" redactado' },
  { id:'mail_recom',     phase:'mailings', label:'Recomendación del director redactada' },
  { id:'dir_mail',       phase:'director', label:'Texto mail del director redactado' },
  { id:'dir_li',         phase:'director', label:'Copy LinkedIn del director listo' },
  { id:'dir_imgs',       phase:'director', label:'Imágenes de difusión del director listas' },
];

const FACULTIES = ['Artes','Arquitectura y Diseño','Ciencias Jurídicas y Sociales','Comunicaciones','Diversidad, Género e Inclusión','Negocios y Tecnología','Psicología'];
const OLAS      = ['Ola 1','Ola 2','Ola 3','Ola 4','Ola 5','Ola 6'];
const SUBTIPOS  = ['Diplomado','Curso','Taller'];

/* Faculty → brand color mapping */
const FAC_COLOR = {
  'Artes':                         B.pink,
  'Arquitectura y Diseño':         B.orange,
  'Ciencias Jurídicas y Sociales': B.blue,
  'Psicología':                    '#27AE60',
  'Comunicaciones':                '#9B59B6',
  'Negocios y Tecnología':         B.blue,
  'Diversidad, Género e Inclusión':B.pink,
};
const DEF_FAC_COLOR = B.gray3;

const OLA_COLOR = {
  'Ola 1': B.orange,
  'Ola 2': B.blue,
  'Ola 3': '#27AE60',
  'Ola 4': B.pink,
  'Ola 5': '#9B59B6',
  'Ola 6': B.orange,
};

const TIPO_COLOR = { 'Diplomado': B.pink, 'Curso': B.blue, 'Taller': B.orange };

/* ── helpers ── */
const emptyTasks = () => Object.fromEntries(ALL_TASKS.map(t => [t.id, false]));
const getPct = (tasks, ct=[]) => {
  const n = ALL_TASKS.length + (ct||[]).length;
  const d = ALL_TASKS.filter(t=>tasks[t.id]).length + (ct||[]).filter(t=>t.done).length;
  return n===0 ? 0 : Math.round(d/n*100);
};
const getDone = (tasks, ct=[]) =>
  ALL_TASKS.filter(t=>tasks[t.id]).length + (ct||[]).filter(t=>t.done).length;

const pctColor = p => {
  if (p===100) return '#27AE60';
  if (p>=60)   return B.blue;
  if (p>=25)   return B.orange;
  return B.gray3;
};

const mkProg = (d={}) => ({
  id: d.id||`p_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
  nombre:d.nombre||'', ola:d.ola||'', subtipo:d.subtipo||'',
  facultad:d.facultad||'', modalidad:d.modalidad||'',
  inicio:d.inicio||'', termino:d.termino||'', duracion:d.duracion||'',
  director:d.director||'', arancel:d.arancel||'', matricula:d.matricula||'',
  situacion:d.situacion||'', codigo:d.codigo||'', notas:d.notas||'',
  tasks:{...emptyTasks(),...(d.tasks||{})}, customTasks:d.customTasks||[],
});
const autoT = d => {
  const t = emptyTasks();
  if (d.modalidad) t.info_modalidad=true;
  if (d.inicio)    t.info_fechas=true;
  if (d.director)  t.info_director=true;
  if (d.arancel)   t.info_arancel=true;
  return t;
};

/* ── DATA ── */
const RAW=[{"id":"p_0","nombre":"Taller Storytelling Jurídico","ola":"","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"TSJAN1AR"},{"id":"p_1","nombre":"Curso de Nueva Ley de Protección de Datos y Compliance","ola":"","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_2","nombre":"Curso de Gobernanza, Gestión de Riesgos y Protección de Datos Personales","ola":"","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_3","nombre":"Curso de Responsabilidad Organizacional en la Protección de Datos Personales","ola":"","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_4","nombre":"Curso de Gestión de vulneraciones de datos personales y continuidad del negocio","ola":"","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_5","nombre":"Curso de Gobernanza y Gestión Pública Local","ola":"","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_11","nombre":"Diplomado en Compliance, Integridad y Gestión Reputacional","ola":"Ola 1","subtipo":"Diplomado","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"02/07/2026","termino":"26/11/2026","duracion":"5 meses","director":"Katrina Karen Badilla Guzman","arancel":"$900.000","matricula":"$100.000","situacion":"Admisión abierta 2026","codigo":"DCIGR1AR"},{"id":"p_12","nombre":"Curso en Marco normativo, Compliance e Integridad","ola":"Ola 1","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"02/07/2026","termino":"30/07/2026","duracion":"1 mes","director":"Katrina Karen Badilla Guzman","arancel":"$200.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CMNCI1AR"},{"id":"p_13","nombre":"Curso de Sistemas de Integridad, Mecanismos Preventivos y Protocolos Institucionales","ola":"Ola 1","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"01/09/2026","termino":"29/09/2026","duracion":"1 mes","director":"Katrina Karen Badilla Guzman","arancel":"$200.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CSIMP1AR"},{"id":"p_14","nombre":"Curso de Transparencia, Rendición de Cuentas y Riesgo Reputacional","ola":"Ola 1","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"01/10/2026","termino":"27/10/2026","duracion":"1 mes","director":"Katrina Karen Badilla Guzman","arancel":"$200.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CTRCR1AR"},{"id":"p_15","nombre":"Curso de Gestión Reputacional, Comunicación y Respuesta a Incidentes","ola":"Ola 1","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"03/11/2026","termino":"26/11/2026","duracion":"1 mes","director":"Katrina Karen Badilla Guzman","arancel":"$200.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CGRCE1AR"},{"id":"p_16","nombre":"Diplomado en Comunicaciones Internas","ola":"Ola 1","subtipo":"Diplomado","facultad":"Comunicaciones","modalidad":"Online asincrónico + sesiones sincrónicas","inicio":"04/05/2026","termino":"21/08/2026","duracion":"4 meses","director":"Alejandra Natalia Riveros Martinez","arancel":"$900.000","matricula":"$100.000","situacion":"Admisión abierta 2026","codigo":"DCOIN1AR"},{"id":"p_17","nombre":"Diplomado en Comunicación y Marketing Digital","ola":"Ola 1","subtipo":"Diplomado","facultad":"Comunicaciones","modalidad":"Online asincrónico + sesiones sincrónicas","inicio":"04/05/2026","termino":"21/08/2026","duracion":"4 meses","director":"Alejandra Natalia Riveros Martinez","arancel":"$900.000","matricula":"$100.000","situacion":"Admisión abierta 2026","codigo":"DCMDI1AR"},{"id":"p_18","nombre":"Diplomado en Psicoterapia Online: Diseño y Análisis de Intervenciones Clínicas","ola":"Ola 1","subtipo":"Diplomado","facultad":"Psicología","modalidad":"Online sincrónico","inicio":"07/05/2026","termino":"05/09/2026","duracion":"4 meses","director":"Cristopher Arturo Urbina Yañez","arancel":"$900.000","matricula":"$100.000","situacion":"Admisión abierta 2026","codigo":"DPODA1AR"},{"id":"p_19","nombre":"Curso en Psicoterapia online infanto-juvenil","ola":"Ola 1","subtipo":"Curso","facultad":"Psicología","modalidad":"Online sincrónico","inicio":"02/07/2026","termino":"01/08/2026","duracion":"1 mes","director":"Cristopher Arturo Urbina Yañez","arancel":"$300.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CPOIJ1AR"},{"id":"p_20","nombre":"Curso en Psicoterapia online con adultos","ola":"Ola 1","subtipo":"Curso","facultad":"Psicología","modalidad":"Online sincrónico","inicio":"06/08/2026","termino":"05/09/2026","duracion":"1 mes","director":"Cristopher Arturo Urbina Yañez","arancel":"$300.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CPOAD1AR"},{"id":"p_21","nombre":"Diplomado en Dinámica y Espacialidad Escénica","ola":"Ola 1","subtipo":"Diplomado","facultad":"Artes","modalidad":"Semipresencial","inicio":"02/06/2026","termino":"24/10/2026","duracion":"5 meses","director":"Carlos Delgado Lizama","arancel":"$1.000.000","matricula":"$100.000","situacion":"Admisión abierta 2026","codigo":"DDESE1SR"},{"id":"p_22","nombre":"Curso en Gestión de Riesgos Éticos","ola":"Ola 1","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"04/08/2026","termino":"27/08/2026","duracion":"1 mes","director":"Katrina Karen Badilla Guzman","arancel":"$200.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CGRET1AR"},{"id":"p_23","nombre":"Diplomado en Derecho de Familia, Mediación e Intervención Familiar","ola":"Ola 2","subtipo":"Diplomado","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"01/06/2026","termino":"21/11/2026","duracion":"6 meses","director":"Miguel Antonio Gatica Chandia","arancel":"$900.000","matricula":"$100.000","situacion":"Admisión abierta 2026","codigo":"DDFMI1AR"},{"id":"p_24","nombre":"Curso: Herramientas para la autoproducción musical independiente","ola":"Ola 2","subtipo":"Curso","facultad":"Artes","modalidad":"Online sincrónico","inicio":"05/05/2026","termino":"21/07/2026","duracion":"3 meses","director":"Cristobal Francisco De Ferrari Zaldivar","arancel":"$400.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CHAMI1AR"},{"id":"p_25","nombre":"Curso en Marca personal para psicólogos en redes sociales","ola":"Ola 2","subtipo":"Curso","facultad":"Psicología","modalidad":"Online sincrónico","inicio":"04/05/2026","termino":"10/06/2026","duracion":"6 semanas","director":"Cristopher Arturo Urbina Yañez","arancel":"$200.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CMPPR1AR"},{"id":"p_26","nombre":"Curso de Lengua de Señas Chilena: Primeros Auxilios Comunicacionales","ola":"Ola 2","subtipo":"Curso","facultad":"Diversidad, Género e Inclusión","modalidad":"Online sincrónico","inicio":"05/05/2026","termino":"28/05/2026","duracion":"4 semanas","director":"Yendiryn Lucero Cifuentes Huete","arancel":"$150.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CLSCI1AR"},{"id":"p_27","nombre":"Curso en IA y herramientas digitales para el marketing y las comunicaciones","ola":"Ola 2","subtipo":"Curso","facultad":"Comunicaciones","modalidad":"Online sincrónico","inicio":"07/05/2026","termino":"02/07/2026","duracion":"2 meses","director":"Ignacio Antonio Palacios Barria","arancel":"$250.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CIAHD1AR"},{"id":"p_28","nombre":"Curso en Desafíos del Ambiente Psicoterapéutico Online","ola":"Ola 2","subtipo":"Curso","facultad":"Psicología","modalidad":"Online sincrónico","inicio":"07/05/2026","termino":"28/05/2026","duracion":"1 mes","director":"Cristopher Arturo Urbina Yañez","arancel":"$300.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CDAPO1AR"},{"id":"p_29","nombre":"Curso en Ética y Ciberseguridad en Psicoterapia Online","ola":"Ola 2","subtipo":"Curso","facultad":"Psicología","modalidad":"Online sincrónico","inicio":"04/06/2026","termino":"18/06/2026","duracion":"1 mes","director":"Cristopher Arturo Urbina Yañez","arancel":"$300.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CECPO1AR"},{"id":"p_30","nombre":"Curso: Modelos y Metodología de Intervención Familiar","ola":"Ola 2","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"31/08/2026","termino":"21/09/2026","duracion":"1 mes","director":"Miguel Antonio Gatica Chandia","arancel":"$150.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CMMIF1AR"},{"id":"p_31","nombre":"Curso: Organización de los Tribunales de Familia","ola":"Ola 2","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"03/08/2026","termino":"24/08/2026","duracion":"1 mes","director":"Miguel Antonio Gatica Chandia","arancel":"$150.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"COTFA1AR"},{"id":"p_32","nombre":"Taller de Intervención Familiar","ola":"Ola 2","subtipo":"Taller","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"28/09/2026","termino":"24/10/2026","duracion":"1 mes","director":"Miguel Antonio Gatica Chandia","arancel":"$200.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"TINFA1AR"},{"id":"p_33","nombre":"Taller de Mediación Familiar","ola":"Ola 2","subtipo":"Taller","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"02/11/2026","termino":"21/11/2026","duracion":"1 mes","director":"Miguel Antonio Gatica Chandia","arancel":"$200.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"TMEFA1AR"},{"id":"p_34","nombre":"Pasantía Clínica en Psicología y Salud Mental Comunitaria","ola":"Ola 2","subtipo":"","facultad":"Psicología","modalidad":"Presencial","inicio":"","termino":"","duracion":"5 meses","director":"Aline Andrea Orellana Araya","arancel":"","matricula":"","situacion":"Admisión abierta 2026","codigo":"PCPSM1DR"},{"id":"p_35","nombre":"Curso: Desarrollo de Habilidades Comunicacionales en Lengua de Señas","ola":"Ola 2","subtipo":"Curso","facultad":"Diversidad, Género e Inclusión","modalidad":"Online sincrónico","inicio":"09/06/2026","termino":"02/07/2026","duracion":"4 semanas","director":"Yendiryn Lucero Cifuentes Huete","arancel":"$150.000","matricula":"$1","situacion":"Admisión abierta 2026","codigo":"CDHCL1AR"},{"id":"p_36","nombre":"Curso en Maquillaje y Caracterización Teatral","ola":"Ola 3","subtipo":"Curso","facultad":"Artes","modalidad":"Presencial","inicio":"09/06/2026","termino":"27/06/2026","duracion":"1 mes","director":"","arancel":"$400.000","matricula":"$1","situacion":"","codigo":"CMCTE1VR"},{"id":"p_37","nombre":"Taller Storytelling Jurídico","ola":"Ola 3","subtipo":"Taller","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Presencial","inicio":"30/05/2026","termino":"27/06/2026","duracion":"1 mes","director":"","arancel":"$200.000","matricula":"$1","situacion":"","codigo":"TSJAN1DR"},{"id":"p_38","nombre":"Curso en Apreciación y Crítica de Cine","ola":"Ola 3","subtipo":"Curso","facultad":"Comunicaciones","modalidad":"Online sincrónico","inicio":"01/06/2026","termino":"27/07/2026","duracion":"2 meses","director":"","arancel":"$250.000","matricula":"$1","situacion":"","codigo":"CACCI1AR"},{"id":"p_39","nombre":"Curso de Neuroeducación y Aprendizaje Digital","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"10/06/2026","termino":"08/07/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CNEAD1AR"},{"id":"p_40","nombre":"Curso de IA Generativa para la Creación de Experiencias de Aprendizaje","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"22/07/2026","termino":"19/08/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CIGCE1AR"},{"id":"p_41","nombre":"Diplomado en E-learning","ola":"Ola 3","subtipo":"Diplomado","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"10/06/2026","termino":"09/12/2026","duracion":"6 meses","director":"Danilo Bermudez Macias","arancel":"$800.000","matricula":"$100.000","situacion":"","codigo":"DELEA1AR"},{"id":"p_42","nombre":"Curso de Producción de Recursos Multimedia para AVA","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"26/08/2026","termino":"30/09/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CPRME1AR"},{"id":"p_43","nombre":"Curso en Narrativas Educativas y Storytelling Transmedia","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"07/10/2026","termino":"04/11/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CNEST1AR"},{"id":"p_44","nombre":"Curso de Estrategias de Tutoría y Moderación Virtual","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"26/08/2026","termino":"30/09/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CETMV1AR"},{"id":"p_45","nombre":"Curso en Acompañamiento Socioemocional y Vínculo Pedagógico en AVA","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"07/10/2026","termino":"04/11/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CASVP1AR"},{"id":"p_46","nombre":"Curso en Dirección y Gestión de Proyectos E-learning","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"26/08/2026","termino":"30/09/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CDGPE1AR"},{"id":"p_47","nombre":"Curso de Liderazgo y Gestión del Cambio para la transformación digital","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"07/10/2026","termino":"04/11/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CLGCT1AR"},{"id":"p_48","nombre":"Curso en Estrategias DUA y de Ajuste Curricular en AVA","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"26/08/2026","termino":"30/09/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CEDAC1AR"},{"id":"p_49","nombre":"Curso en Tecnologías para la Inclusión y la accesibilidad digital","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"07/10/2026","termino":"04/11/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CHTIA1AR"},{"id":"p_50","nombre":"Curso de Evaluación en AVA: Diseño de Instrumentos y Rúbricas","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"11/11/2026","termino":"09/12/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CEAVA1AR"},{"id":"p_51","nombre":"Curso de Seguimiento, Analítica de Aprendizaje y Retención en AVA","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"11/11/2026","termino":"09/12/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CSAAR1AR"},{"id":"p_52","nombre":"Curso en Aseguramiento de la Calidad y modelos de evaluación en E-learning","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"11/11/2026","termino":"09/12/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CACME1AR"},{"id":"p_53","nombre":"Curso en Neurodiversidad y Aprendizaje Flexible en Educación Online","ola":"Ola 3","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"11/11/2026","termino":"09/12/2026","duracion":"1 mes","director":"Danilo Bermudez Macias","arancel":"$160.000","matricula":"$1","situacion":"","codigo":"CNAFE1AR"},{"id":"p_54","nombre":"Curso en Maquillaje y Caracterización Teatral (2ª ed.)","ola":"Ola 3","subtipo":"Curso","facultad":"Artes","modalidad":"Presencial","inicio":"11/07/2026","termino":"08/08/2026","duracion":"1 mes","director":"","arancel":"$400.000","matricula":"$1","situacion":"","codigo":"CMCTE1DR"},{"id":"p_55","nombre":"Diplomado en Danza Espectáculo","ola":"Ola 4","subtipo":"Diplomado","facultad":"Artes","modalidad":"Presencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_56","nombre":"Curso Lecturas Fundamentales en Artes y Humanidades","ola":"Ola 4","subtipo":"Curso","facultad":"Artes","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"CLFAH1AR"},{"id":"p_57","nombre":"Curso: Teatro Analítico como Dispositivo Clínico y de Creación","ola":"Ola 4","subtipo":"Curso","facultad":"Psicología","modalidad":"Semipresencial","inicio":"05/09/2026","termino":"24/10/2026","duracion":"2 meses","director":"Ruben Alexis Morgado Maiza","arancel":"$250.000","matricula":"$0","situacion":"","codigo":"CTADC1SR"},{"id":"p_58","nombre":"Diplomado en Diseño 4D: Tecnologías de Fabricación Experimental","ola":"Ola 4","subtipo":"Diplomado","facultad":"Arquitectura y Diseño","modalidad":"Semipresencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"DDTFE1SR"},{"id":"p_59","nombre":"Diplomado en Diseño de Experiencias Espaciales y Arquitectura Temporal","ola":"Ola 4","subtipo":"Diplomado","facultad":"Arquitectura y Diseño","modalidad":"Semipresencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_60","nombre":"Diplomado en Retrofit y Rehabilitación de Espacios","ola":"Ola 4","subtipo":"Diplomado","facultad":"Arquitectura y Diseño","modalidad":"Semipresencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_61","nombre":"Diplomado en Diseño Estratégico de Espacios Comerciales","ola":"Ola 4","subtipo":"Diplomado","facultad":"Arquitectura y Diseño","modalidad":"Semipresencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_62","nombre":"Diplomado en Urbanismo Táctico y Diseño de Intervenciones Urbanas","ola":"Ola 4","subtipo":"Diplomado","facultad":"Arquitectura y Diseño","modalidad":"Semipresencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_63","nombre":"Diplomado en Gestión Técnica, Normativa y Tramitación de Obras","ola":"Ola 4","subtipo":"Diplomado","facultad":"Arquitectura y Diseño","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_64","nombre":"Taller: Dibujo, Mente y Estructura","ola":"Ola 4","subtipo":"Taller","facultad":"Artes","modalidad":"Presencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"TDMES1DR"},{"id":"p_65","nombre":"Taller de Fotografía Análoga","ola":"Ola 4","subtipo":"Taller","facultad":"Artes","modalidad":"Presencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"TFATA1DR"},{"id":"p_66","nombre":"Taller Dibujo Analógico y Consciente","ola":"Ola 4","subtipo":"Taller","facultad":"Artes","modalidad":"Presencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"TDAPR1DR"},{"id":"p_67","nombre":"Diplomado en Gestión Pública Local, Participación Ciudadana y Gobiernos Territoriales","ola":"Ola 4","subtipo":"Diplomado","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"28/07/2026","termino":"21/01/2027","duracion":"5 meses","director":"Edith Margarita Jorquera Muñoz","arancel":"$800.000","matricula":"$100.000","situacion":"","codigo":"DGPPG1AR"},{"id":"p_68","nombre":"Diplomado en Protección y Gobernanza de Datos Personales","ola":"Ola 4","subtipo":"Diplomado","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"17/08/2026","termino":"21/12/2026","duracion":"4 meses","director":"Felipe Esteban Osorio Umaña","arancel":"$800.000","matricula":"$100.000","situacion":"","codigo":"DPGDP1AR"},{"id":"p_69","nombre":"Diplomado en Bienestar y Salud Mental en Comunidades","ola":"Ola 4","subtipo":"Diplomado","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"DBSMC1SR"},{"id":"p_70","nombre":"Diplomado en Abordaje Integral de la Neurodiversidad en el Aula","ola":"Ola 4","subtipo":"Diplomado","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"DAINA1AR"},{"id":"p_71","nombre":"Curso en Finanzas Personales","ola":"Ola 4","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"Online sincrónico","inicio":"01/07/2026","termino":"22/07/2026","duracion":"1 mes","director":"","arancel":"$80.000","matricula":"$0","situacion":"","codigo":"CFIPE1AR","notas":"Horario: miércoles 19:00–21:00"},{"id":"p_72","nombre":"Taller de Fotografía Estenopeica","ola":"Ola 4","subtipo":"Taller","facultad":"Artes","modalidad":"Presencial","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"TFOES1DR"},{"id":"p_73","nombre":"Curso de Diseño y Gestión de Procesos de Participación Ciudadana","ola":"Ola 4","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"01/09/2026","termino":"01/10/2026","duracion":"1 mes","director":"Edith Margarita Jorquera Muñoz","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_74","nombre":"Curso de Diagnóstico Territorial y Análisis de Contextos locales","ola":"Ola 4","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"06/10/2026","termino":"05/11/2026","duracion":"1 mes","director":"Edith Margarita Jorquera Muñoz","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_75","nombre":"Curso de Planificación y Gestión de Programas Públicos Locales","ola":"Ola 4","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"10/11/2026","termino":"17/12/2026","duracion":"1 mes","director":"Edith Margarita Jorquera Muñoz","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_76","nombre":"Diplomado en Propiedad Intelectual e Industrias Creativas","ola":"Ola 4","subtipo":"Diplomado","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"17/08/2026","termino":"16/12/2026","duracion":"4 meses","director":"Felipe Esteban Osorio Umaña","arancel":"$800.000","matricula":"$100.000","situacion":"","codigo":"DPIIC1AR"},{"id":"p_77","nombre":"Curso en Políticas e Industrias Creativas","ola":"Ola 4","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"Felipe Esteban Osorio Umaña","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_78","nombre":"Curso de Propiedad Intelectual en Chile","ola":"Ola 4","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"Felipe Esteban Osorio Umaña","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_79","nombre":"Curso: Administración y planificación en proyectos de arte y cultura","ola":"Ola 4","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"Felipe Esteban Osorio Umaña","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_80","nombre":"Curso de Gestión de Derechos de Propiedad Intelectual","ola":"Ola 4","subtipo":"Curso","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"Felipe Esteban Osorio Umaña","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_81","nombre":"Taller de Redacción de Escritos Judiciales","ola":"Ola 5","subtipo":"Taller","facultad":"Ciencias Jurídicas y Sociales","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_82","nombre":"Diplomado en Actuación para Cine y Televisión","ola":"Ola 5","subtipo":"Diplomado","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_83","nombre":"Curso: Apreciación de música popular chilena","ola":"Ola 5","subtipo":"Curso","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_84","nombre":"Taller Artes Vivas: cuerpo, arte y tecnología","ola":"Ola 5","subtipo":"Taller","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_85","nombre":"Diplomado en Escritura académica e Investigación en Artes y Humanidades","ola":"Ola 5","subtipo":"Diplomado","facultad":"Artes","modalidad":"Online sincrónico","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":"DEAIA1AR"},{"id":"p_86","nombre":"Taller: Escribe tu primer guión","ola":"Ola 5","subtipo":"Taller","facultad":"Comunicaciones","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_87","nombre":"Taller Grounding desde el Mindfulness","ola":"Ola 5","subtipo":"Taller","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_88","nombre":"Diplomado en Producción de Espectáculos","ola":"Ola 5","subtipo":"Diplomado","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_89","nombre":"Diplomado en Canto e Interpretación Escénica","ola":"Ola 5","subtipo":"Diplomado","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_90","nombre":"Taller Teatro Musical","ola":"Ola 5","subtipo":"Taller","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_91","nombre":"Diplomado en Teatro y Educación","ola":"Ola 5","subtipo":"Diplomado","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_92","nombre":"Curso: Hamlet","ola":"Ola 5","subtipo":"Curso","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_93","nombre":"Curso de Introducción a la Ópera","ola":"Ola 5","subtipo":"Curso","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_94","nombre":"Curso de introducción a la Actuación para Medios Audiovisuales","ola":"Ola 5","subtipo":"Curso","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_95","nombre":"Diplomado en Opinión Pública","ola":"Ola 5","subtipo":"Diplomado","facultad":"Comunicaciones","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_96","nombre":"Diplomado en Gestión Estratégica de Personas","ola":"Ola 5","subtipo":"Diplomado","facultad":"Negocios y Tecnología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_97","nombre":"People Economics: gestión del Capital Humano","ola":"Ola 5","subtipo":"Curso","facultad":"Negocios y Tecnología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_98","nombre":"Diplomado en Business & Management para Industrias Creativas","ola":"Ola 5","subtipo":"Diplomado","facultad":"Negocios y Tecnología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_99","nombre":"Diplomado SAP","ola":"Ola 5","subtipo":"Diplomado","facultad":"Negocios y Tecnología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_100","nombre":"Diplomados en ONGs","ola":"Ola 5","subtipo":"Diplomado","facultad":"Negocios y Tecnología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_101","nombre":"Diplomado en Arteterapia","ola":"Ola 5","subtipo":"Diplomado","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_102","nombre":"Diplomado en Seguridad Psicológica y Felicidad Organizacional","ola":"Ola 5","subtipo":"Diplomado","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_103","nombre":"Diplomado en Gestión de la Diversidad, Convivencia Laboral y Ley Karin","ola":"Ola 5","subtipo":"Diplomado","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_104","nombre":"Taller: Intervención en violencia de género en campus universitarios","ola":"Ola 5","subtipo":"Taller","facultad":"Diversidad, Género e Inclusión","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_105","nombre":"Curso: Gestión integral Ley 21.369 en IES","ola":"Ola 5","subtipo":"Curso","facultad":"Diversidad, Género e Inclusión","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_106","nombre":"Curso: Bienestar Psicológico, Inclusión y Deporte","ola":"Ola 6","subtipo":"Curso","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_107","nombre":"Curso: Cultura Organizacional AI Ready","ola":"Ola 6","subtipo":"Curso","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_108","nombre":"Curso: Psicología y Comunidad Sorda","ola":"Ola 6","subtipo":"Curso","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_109","nombre":"Taller de Evaluación Psicológica para Deportistas","ola":"Ola 6","subtipo":"Taller","facultad":"Psicología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_110","nombre":"Curso Mapping","ola":"Ola 6","subtipo":"Curso","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_111","nombre":"Diplomado Diseño Editorial","ola":"Ola 6","subtipo":"Diplomado","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_112","nombre":"Diplomado Tatuaje Profesional","ola":"Ola 6","subtipo":"Diplomado","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_113","nombre":"Curso: Creación de Canciones","ola":"Ola 6","subtipo":"Curso","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_114","nombre":"Curso Apreciación del Arte Visual Contemporáneo","ola":"Ola 6","subtipo":"Curso","facultad":"Artes","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_115","nombre":"Taller de Fotografía Publicitaria","ola":"Ola 6","subtipo":"Taller","facultad":"Comunicaciones","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_116","nombre":"Taller Redacción Creativa","ola":"Ola 6","subtipo":"Taller","facultad":"Comunicaciones","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_117","nombre":"Taller de Locución","ola":"Ola 6","subtipo":"Taller","facultad":"Comunicaciones","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_118","nombre":"Taller Marketing Personal","ola":"Ola 6","subtipo":"Taller","facultad":"Comunicaciones","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_119","nombre":"Diplomado en Storytelling Transmedia","ola":"Ola 6","subtipo":"Diplomado","facultad":"Comunicaciones","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_120","nombre":"Diplomado en Dirección Estratégica y Especialización en Ventas","ola":"Ola 6","subtipo":"Diplomado","facultad":"Negocios y Tecnología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""},{"id":"p_121","nombre":"Diplomado en Auditoría Forense e IA aplicada","ola":"Ola 6","subtipo":"Diplomado","facultad":"Negocios y Tecnología","modalidad":"","inicio":"","termino":"","duracion":"","director":"","arancel":"","matricula":"","situacion":"","codigo":""}];
/* ── Task overrides based on known Ola 4 progress ── */
const LP_DONE    = new Set(['p_68','p_76','p_67','p_57','p_71']); // LP brief solicitado
const INFO_READY = new Set(['p_73','p_74','p_75']);                 // Info OK, sin arancel ni LP

const applyOverrides = (d, base) => {
  const t = { ...base };
  if (LP_DONE.has(d.id)) {
    t.info_fechas    = !!d.inicio;
    t.info_director  = !!d.director;
    t.info_modalidad = !!d.modalidad;
    t.info_arancel   = !!(d.arancel);
    t.lp_brief       = true;
  }
  if (INFO_READY.has(d.id)) {
    t.info_fechas    = !!d.inicio;
    t.info_director  = !!d.director;
    t.info_modalidad = !!d.modalidad;
  }
  return t;
};

const SEED = RAW.map(d => mkProg({ ...d, tasks: applyOverrides(d, autoT(d)) }));

/* ═══════════════════════════════════════════════
   CSS — Montserrat + māS brand
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.mas { font-family: 'Montserrat', sans-serif; -webkit-font-smoothing: antialiased; background: #F7F5F2; color: #0D0D0D; }
.mas *, .mas input, .mas select, .mas textarea, .mas button { font-family: 'Montserrat', sans-serif; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D8D2CA; border-radius: 4px; }

.card { transition: box-shadow .18s ease, transform .16s ease, border-color .18s ease; }
.card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.10) !important; transform: translateY(-2px); }
.trow { transition: background .1s; cursor: pointer; }
.trow:hover { background: #F0EDEA !important; }
.pill { cursor: pointer; border: none; transition: all .13s ease; font-family: 'Montserrat', sans-serif; }
.pill:hover { opacity: .82; }
.phdr { cursor: pointer; transition: background .15s; }
.phdr:hover { background: #F7F5F2 !important; }
.btn { cursor: pointer; transition: all .15s ease; font-family: 'Montserrat', sans-serif; }
.btn:hover { filter: brightness(.94); }
.btn:active { transform: scale(.97); }
.inp:focus { outline: none; border-color: #3AAAD4 !important; box-shadow: 0 0 0 3px #3AAAD420; }
`;

/* ═══════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════ */

/* The māS logo mark — three colored dashes */
const MasLogo = ({ size = 14 }) => (
  <div style={{ display:'flex', flexDirection:'column', gap: size * 0.15, flexShrink: 0 }}>
    {[B.orange, B.blue, B.pink].map((c, i) => (
      <div key={i} style={{ width: size * (i===1?1.6:1.2), height: size * 0.18, background: c, borderRadius: 2 }}/>
    ))}
  </div>
);

const Bar = ({ pct, h=4, color }) => (
  <div style={{ height: h, borderRadius: h/2, background: B.gray1, overflow:'hidden' }}>
    <div style={{ height:'100%', width:`${pct}%`, background: color||pctColor(pct), borderRadius: h/2, transition:'width .45s ease' }}/>
  </div>
);

/* Pill tag */
const Tag = ({ children, color }) => (
  <span style={{
    display:'inline-flex', alignItems:'center',
    background: color + '18',
    color,
    border: `1.5px solid ${color}40`,
    borderRadius: 3, padding:'2px 8px',
    fontSize: 9, fontWeight: 700,
    letterSpacing:'.06em', textTransform:'uppercase',
    whiteSpace:'nowrap', lineHeight:'16px',
  }}>{children}</span>
);

const FAC_SHORT = {'Arquitectura y Diseño':'Arq. & Dis.','Ciencias Jurídicas y Sociales':'Cs. Jurídicas','Diversidad, Género e Inclusión':'Diversidad','Negocios y Tecnología':'Negocios'};
const FacTag  = ({f}) => <Tag color={FAC_COLOR[f]||DEF_FAC_COLOR}>{FAC_SHORT[f]||f||'Sin facultad'}</Tag>;
const OlaTag  = ({ola}) => ola ? <Tag color={OLA_COLOR[ola]||B.gray3}>{ola}</Tag> : null;
const TipoTag = ({s}) => s ? <Tag color={TIPO_COLOR[s]||B.gray3}>{s}</Tag> : null;

/* Progress circle */
const Ring = ({ pct, size=54 }) => {
  const stroke = 3.5, r = (size-stroke*2)/2, circ = 2*Math.PI*r;
  const col = pctColor(pct);
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={B.gray1} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ-(pct/100)*circ}
        strokeLinecap="round" style={{ transition:'stroke-dashoffset .5s ease' }}/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill={col} fontSize={size*.21} fontWeight="800"
        style={{ transform:'rotate(90deg)', transformOrigin:'50% 50%', fontFamily:'Montserrat,sans-serif' }}>
        {pct}%
      </text>
    </svg>
  );
};

const Chk = ({ checked, color, onChange }) => (
  <div onClick={onChange} style={{
    width:18, height:18, borderRadius:4, flexShrink:0, cursor:'pointer',
    border:`2px solid ${checked ? color : B.gray2}`,
    background: checked ? color : B.white,
    display:'flex', alignItems:'center', justifyContent:'center',
    transition:'all .15s ease',
    boxShadow: checked ? `0 2px 8px ${color}50` : 'none',
  }}>
    {checked && <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
      <path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>}
  </div>
);

/* Filter pill */
const FPill = ({ label, active, color, onClick }) => (
  <button className="pill" onClick={onClick} style={{
    padding:'4px 12px', borderRadius:20, fontSize:10.5, fontWeight:600,
    letterSpacing:'.02em', whiteSpace:'nowrap',
    background: active ? color : B.white,
    color: active ? B.white : B.gray4,
    border: `1.5px solid ${active ? color : B.gray2}`,
    boxShadow: active ? `0 2px 8px ${color}40` : 'none',
  }}>{label}</button>
);

/* Stat box */
const StatBox = ({ label, value, color, accent }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 18px', borderLeft:`1px solid ${B.gray1}` }}>
    <div style={{ fontSize:22, fontWeight:900, color, letterSpacing:'-.03em', lineHeight:1 }}>{value}</div>
    {accent && <div style={{ width:20, height:3, background:accent, borderRadius:2, margin:'4px auto 2px' }}/>}
    <div style={{ fontSize:9, color:B.gray3, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', whiteSpace:'nowrap', marginTop: accent ? 0 : 4 }}>{label}</div>
  </div>
);

/* Priority star badge */
const PriorityBadge = ({ size=12 }) => (
  <span title="Prioridad" style={{
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background: B.pink, color: B.white,
    borderRadius: 4, padding:'2px 6px',
    fontSize: size, fontWeight: 800,
    letterSpacing:'.02em', lineHeight:'16px',
    flexShrink:0,
  }}>★ PRIORITARIO</span>
);

/* ═══════════════════════════════════════════════
   PROGRAM CARD
═══════════════════════════════════════════════ */
function PCard({ prog, selected, onClick }) {
  const p = getPct(prog.tasks, prog.customTasks);
  const done = getDone(prog.tasks, prog.customTasks);
  const total = ALL_TASKS.length + (prog.customTasks||[]).length;
  const col = pctColor(p);
  const facColor = FAC_COLOR[prog.facultad] || DEF_FAC_COLOR;
  const isPriority = PRIORITY_IDS.has(prog.id);

  return (
    <div className="card" onClick={onClick} style={{
      borderRadius:10, cursor:'pointer', overflow:'hidden',
      background: isPriority ? '#FFF8FD' : B.white,
      border: `1.5px solid ${selected ? facColor : isPriority ? B.pink+'60' : B.gray2}`,
      boxShadow: selected
        ? `0 0 0 3px ${facColor}20, 0 4px 16px rgba(0,0,0,.08)`
        : isPriority ? `0 2px 10px ${B.pink}18` : '0 1px 4px rgba(0,0,0,.06)',
      position:'relative',
    }}>
      {/* top accent line */}
      <div style={{ height:3, background: isPriority
        ? `linear-gradient(90deg, ${B.pink}, ${B.orange})`
        : `linear-gradient(90deg, ${facColor}, ${facColor}60)` }}/>

      <div style={{ padding:'12px 14px 12px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:8 }}>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', flex:1, minWidth:0 }}>
            <FacTag f={prog.facultad}/>
            {prog.ola && <OlaTag ola={prog.ola}/>}
            {prog.subtipo && <TipoTag s={prog.subtipo}/>}
          </div>
          {isPriority && <PriorityBadge size={9}/>}
          <span style={{
            fontSize:11.5, fontWeight:800, color:col,
            background:`${col}15`, borderRadius:4, padding:'1px 7px', flexShrink:0,
          }}>{p}%</span>
        </div>

        <div style={{ fontSize:12.5, fontWeight:600, color:B.black, lineHeight:1.45, marginBottom:10,
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {prog.nombre || 'Sin nombre'}
        </div>

        <Bar pct={p} h={3} color={col}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
          <span style={{ fontSize:10.5, color:B.gray3, fontWeight:500 }}>{done}/{total} tareas</span>
          {prog.inicio
            ? <span style={{ fontSize:10, color:B.gray3, fontWeight:500 }}>{prog.inicio}</span>
            : prog.codigo ? <span style={{ fontSize:9.5, color:B.gray2, fontWeight:600, letterSpacing:'.03em' }}>{prog.codigo}</span>
            : null}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════ */
const IS = {
  width:'100%', padding:'8px 11px', borderRadius:7,
  border:`1.5px solid ${B.gray2}`, background:B.white,
  color:B.black, fontSize:13, outline:'none',
  fontFamily:"'Montserrat',sans-serif", transition:'border-color .15s, box-shadow .15s',
};

const INFO_FIELDS = [
  ['nombre','Nombre del programa','text'],['ola','Ola','sel_ola'],
  ['subtipo','Tipo','sel_sub'],['facultad','Facultad','sel_fac'],
  ['modalidad','Modalidad','text'],['inicio','Fecha inicio','text'],
  ['termino','Fecha término','text'],['duracion','Duración','text'],
  ['director','Director','text'],['arancel','Arancel','text'],
  ['matricula','Matrícula','text'],['codigo','Código','text'],
  ['situacion','Situación','text'],['notas','Notas','textarea'],
];

function Detail({ prog, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({...prog});
  const [open, setOpen] = useState(Object.fromEntries(PHASES.map(ph=>[ph.id,true])));
  const [addFor, setAddFor] = useState(null);
  const [newLbl, setNewLbl] = useState('');

  useEffect(()=>{ setForm({...prog}); setEditing(false); setAddFor(null); setNewLbl(''); },[prog.id]);
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = () => { onUpdate({...prog,...form}); setEditing(false); };
  const toggle = tid => onUpdate({...prog,tasks:{...prog.tasks,[tid]:!prog.tasks[tid]}});
  const toggleCT = ctid => onUpdate({...prog,customTasks:(prog.customTasks||[]).map(t=>t.id===ctid?{...t,done:!t.done}:t)});
  const deleteCT = ctid => onUpdate({...prog,customTasks:(prog.customTasks||[]).filter(t=>t.id!==ctid)});
  const addCT = phId => {
    const lbl=newLbl.trim(); if(!lbl)return;
    onUpdate({...prog,customTasks:[...(prog.customTasks||[]),{id:`ct_${Date.now()}`,phase:phId,label:lbl,done:false}]});
    setNewLbl(''); setAddFor(null);
  };

  const ct = prog.customTasks||[];
  const p = getPct(prog.tasks,ct);
  const done = getDone(prog.tasks,ct);
  const total = ALL_TASKS.length+ct.length;
  const facColor = FAC_COLOR[prog.facultad]||DEF_FAC_COLOR;
  const isPriority = PRIORITY_IDS.has(prog.id);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:B.cream }}>
      {/* PRIORITY BANNER */}
      {isPriority && (
        <div style={{
          background:`linear-gradient(90deg, ${B.pink}, ${B.orange})`,
          color: B.white, padding:'6px 24px',
          fontSize:10.5, fontWeight:700, letterSpacing:'.08em',
          display:'flex', alignItems:'center', gap:8, flexShrink:0,
        }}>
          <span style={{fontSize:13}}>★</span>
          PROGRAMA PRIORITARIO — REQUIERE ATENCIÓN INMEDIATA
        </div>
      )}
      {/* HEADER */}
      <div style={{
        padding:'20px 24px 18px', flexShrink:0,
        background:B.white, borderBottom:`1px solid ${B.gray1}`,
        position:'relative', overflow:'hidden',
      }}>
        {/* Top color bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg, ${facColor}, ${B.pink}, ${B.blue})` }}/>

        <div style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:14, marginTop:4 }}>
          <Ring pct={p} size={56}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:6 }}>
              <FacTag f={prog.facultad}/>
              {prog.ola && <OlaTag ola={prog.ola}/>}
              {prog.subtipo && <TipoTag s={prog.subtipo}/>}
              {prog.situacion && <Tag color={'#27AE60'}>{prog.situacion}</Tag>}
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:B.black, lineHeight:1.3, letterSpacing:'-.01em' }}>
              {prog.nombre || '—'}
            </div>
            {prog.director && (
              <div style={{ fontSize:11, color:B.gray3, marginTop:5, display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:4, height:4, borderRadius:'50%', background:facColor, display:'inline-block', flexShrink:0 }}/>
                {prog.director}
              </div>
            )}
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontSize:11, fontWeight:700, color:B.gray3 }}>{done}/{total}</div>
            <div style={{ fontSize:9, color:B.gray3, marginTop:2, textTransform:'uppercase', letterSpacing:'.06em' }}>tareas</div>
          </div>
        </div>

        <Bar pct={p} h={5} color={facColor}/>

        <div style={{ display:'flex', gap:6, marginTop:12 }}>
          <button className="btn" onClick={()=>setEditing(!editing)} style={{
            background:'none', border:`1.5px solid ${editing?B.blue:B.gray2}`,
            color: editing ? B.blue : B.gray4,
            borderRadius:7, padding:'5px 13px', fontSize:11.5, fontWeight:600,
          }}>{editing?'✕ Cancelar':'✎ Editar'}</button>
          {editing && (
            <button className="btn" onClick={save} style={{
              background:B.pink, color:B.white, border:'none',
              borderRadius:7, padding:'5px 16px', fontSize:11.5, fontWeight:700,
              boxShadow:`0 4px 14px ${B.pink}50`,
            }}>Guardar</button>
          )}
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex:1, overflow:'auto', padding:'16px 24px' }}>

        {/* Info section */}
        {editing ? (
          <div style={{ marginBottom:16, padding:16, background:B.white, borderRadius:10, border:`1px solid ${B.gray2}` }}>
            <div style={{ fontSize:9, fontWeight:800, color:B.gray3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>Información</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 14px' }}>
              {INFO_FIELDS.map(([k,lbl,type])=>(
                <div key={k} style={{ gridColumn:['nombre','director','notas'].includes(k)?'1/-1':'auto' }}>
                  <label style={{ display:'block', fontSize:9.5, color:B.gray3, marginBottom:4, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase' }}>{lbl}</label>
                  {type==='sel_fac'
                    ? <select className="inp" value={form[k]||''} onChange={e=>upd(k,e.target.value)} style={IS}><option value="">—</option>{FACULTIES.map(x=><option key={x}>{x}</option>)}</select>
                    : type==='sel_ola'
                    ? <select className="inp" value={form[k]||''} onChange={e=>upd(k,e.target.value)} style={IS}><option value="">—</option>{OLAS.map(o=><option key={o}>{o}</option>)}</select>
                    : type==='sel_sub'
                    ? <select className="inp" value={form[k]||''} onChange={e=>upd(k,e.target.value)} style={IS}><option value="">—</option>{SUBTIPOS.map(s=><option key={s}>{s}</option>)}</select>
                    : type==='textarea'
                    ? <textarea className="inp" value={form[k]||''} onChange={e=>upd(k,e.target.value)} rows={3} style={{...IS,resize:'vertical'}}/>
                    : <input className="inp" value={form[k]||''} onChange={e=>upd(k,e.target.value)} style={IS}/>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom:14, padding:'14px 16px', background:B.white, borderRadius:10, border:`1px solid ${B.gray1}`, boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px 20px' }}>
              {[['Modalidad',prog.modalidad],['Duración',prog.duracion],['Inicio',prog.inicio],['Término',prog.termino],['Arancel',prog.arancel],['Matrícula',prog.matricula],['Código',prog.codigo]].map(([k,v])=>!v?null:(
                <div key={k} style={{ fontSize:12, lineHeight:1.7 }}>
                  <span style={{ color:B.gray3, fontSize:9.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.04em' }}>{k} </span>
                  <span style={{ color:B.black, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
            {prog.notas && (
              <div style={{ marginTop:12, fontSize:12, color:B.gray4, padding:'9px 12px',
                background:B.cream, borderRadius:6, borderLeft:`3px solid ${B.blue}`, lineHeight:1.6, fontStyle:'italic' }}>
                {prog.notas}
              </div>
            )}
          </div>
        )}

        {/* Phase minimap */}
        <div style={{ marginBottom:14, padding:'14px 16px', background:B.white, borderRadius:10, border:`1px solid ${B.gray1}`, boxShadow:'0 1px 3px rgba(0,0,0,.04)' }}>
          <div style={{ fontSize:9, fontWeight:800, color:B.gray3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Avance por fase</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 20px' }}>
            {PHASES.map(ph=>{
              const pht=ALL_TASKS.filter(t=>t.phase===ph.id);
              const phc=ct.filter(t=>t.phase===ph.id);
              const phd=pht.filter(t=>prog.tasks[t.id]).length+phc.filter(t=>t.done).length;
              const phn=pht.length+phc.length;
              const php=phn===0?0:Math.round(phd/phn*100);
              return(
                <div key={ph.id}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:8, height:3, borderRadius:2, background:ph.color }}/>
                      <span style={{ fontSize:11, color:B.gray4, fontWeight:600 }}>{ph.s}</span>
                    </div>
                    <span style={{ fontSize:10, color:php===100?ph.color:B.gray3, fontWeight:700 }}>{phd}/{phn}</span>
                  </div>
                  <Bar pct={php} h={3} color={ph.color}/>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist label */}
        <div style={{ fontSize:9, fontWeight:800, color:B.gray3, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Checklist de tareas</div>

        {/* Phase accordions */}
        {PHASES.map(ph=>{
          const pht=ALL_TASKS.filter(t=>t.phase===ph.id);
          const phc=ct.filter(t=>t.phase===ph.id);
          const phd=pht.filter(t=>prog.tasks[t.id]).length+phc.filter(t=>t.done).length;
          const phn=pht.length+phc.length;
          const isOpen=open[ph.id];
          const allDone=phd===phn&&phn>0;
          const isAdding=addFor===ph.id;

          return(
            <div key={ph.id} style={{
              marginBottom:6, borderRadius:10, overflow:'hidden',
              border:`1.5px solid ${allDone?ph.color+'50':B.gray2}`,
              background:B.white, boxShadow:'0 1px 3px rgba(0,0,0,.04)',
            }}>
              <div className="phdr" onClick={()=>setOpen(o=>({...o,[ph.id]:!o[ph.id]}))} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 14px',
                background: allDone ? ph.color+'0C' : B.white,
                borderBottom: isOpen ? `1px solid ${B.gray1}` : 'none',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:10, height:4, borderRadius:2, background:ph.color, opacity:allDone?1:.45 }}/>
                  <span style={{ fontSize:12.5, fontWeight:700, color:allDone?ph.color:B.black }}>{ph.label}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{
                    fontSize:10.5, fontWeight:700,
                    color: allDone?ph.color:B.gray3,
                    background: allDone?`${ph.color}15`:B.cream,
                    padding:'2px 9px', borderRadius:12,
                  }}>{phd}/{phn}</span>
                  <span style={{ fontSize:9, color:B.gray3 }}>{isOpen?'▴':'▾'}</span>
                </div>
              </div>

              {isOpen && <>
                {pht.map(task=>(
                  <div key={task.id} className="trow" onClick={()=>toggle(task.id)} style={{
                    display:'flex', alignItems:'center', gap:12,
                    padding:'9px 14px', borderTop:`1px solid ${B.gray1}`,
                  }}>
                    <Chk checked={!!prog.tasks[task.id]} color={ph.color} onChange={()=>toggle(task.id)}/>
                    <span style={{
                      fontSize:13, lineHeight:1.4, flex:1,
                      color: prog.tasks[task.id] ? B.gray2 : B.gray5,
                      textDecoration: prog.tasks[task.id] ? 'line-through' : 'none',
                      fontWeight: prog.tasks[task.id] ? 400 : 500,
                      transition:'all .15s',
                    }}>{task.label}</span>
                  </div>
                ))}
                {phc.map(task=>(
                  <div key={task.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 14px', borderTop:`1px solid ${B.gray1}` }}>
                    <div className="trow" onClick={()=>toggleCT(task.id)} style={{ flex:1, display:'flex', alignItems:'center', gap:12 }}>
                      <Chk checked={task.done} color={ph.color} onChange={()=>toggleCT(task.id)}/>
                      <span style={{ fontSize:13, lineHeight:1.4, flex:1, color:task.done?B.gray2:B.gray5, textDecoration:task.done?'line-through':'none', fontWeight:500 }}>{task.label}</span>
                    </div>
                    <span style={{ fontSize:9, color:B.gray3, background:B.cream, borderRadius:4, padding:'2px 7px', fontWeight:700, letterSpacing:'.04em', border:`1px solid ${B.gray2}`, textTransform:'uppercase' }}>extra</span>
                    <button onClick={()=>deleteCT(task.id)} style={{ background:'none', border:'none', cursor:'pointer', color:B.gray3, fontSize:18, lineHeight:1 }}>×</button>
                  </div>
                ))}
                {isAdding ? (
                  <div style={{ display:'flex', gap:6, padding:'9px 14px', borderTop:`1px solid ${B.gray1}`, background:B.cream }}>
                    <input autoFocus value={newLbl} onChange={e=>setNewLbl(e.target.value)}
                      onKeyDown={e=>{ if(e.key==='Enter')addCT(ph.id); if(e.key==='Escape'){setAddFor(null);setNewLbl('');} }}
                      placeholder="Nombre de la tarea…" className="inp"
                      style={{...IS, flex:1, fontSize:12, padding:'6px 10px'}}/>
                    <button className="btn" onClick={()=>addCT(ph.id)} style={{ background:ph.color, color:B.white, border:'none', borderRadius:7, padding:'6px 14px', fontSize:12, fontWeight:700, flexShrink:0 }}>Agregar</button>
                    <button className="btn" onClick={()=>{setAddFor(null);setNewLbl('');}} style={{ background:B.white, border:`1.5px solid ${B.gray2}`, borderRadius:7, padding:'6px 10px', fontSize:12, color:B.gray4, flexShrink:0 }}>✕</button>
                  </div>
                ) : (
                  <div onClick={e=>{e.stopPropagation();setAddFor(ph.id);setNewLbl('');}} style={{
                    display:'flex', alignItems:'center', gap:8, padding:'8px 14px',
                    borderTop:`1px solid ${B.gray1}`, cursor:'pointer', color:B.gray3, fontSize:12.5, fontWeight:500,
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background=B.cream}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span style={{ color:ph.color, fontSize:18, lineHeight:1, fontWeight:300 }}>+</span>
                    Agregar tarea especial…
                  </div>
                )}
              </>}
            </div>
          );
        })}

        <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${B.gray1}`, display:'flex', justifyContent:'flex-end' }}>
          <button className="btn" onClick={onDelete} style={{
            background:'none', border:`1.5px solid #F0C0B0`,
            color:'#D05030', borderRadius:7, padding:'5px 14px', fontSize:11.5, fontWeight:600,
          }}>Eliminar programa</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NEW FORM
═══════════════════════════════════════════════ */
function NewForm({ onSave, onCancel }) {
  const [f, setF] = useState({ nombre:'',ola:'',subtipo:'',facultad:'',modalidad:'',inicio:'',director:'',arancel:'',matricula:'' });
  const upd = (k,v) => setF(x=>({...x,[k]:v}));
  const ok = f.nombre.trim().length > 0;
  return (
    <div style={{ padding:'24px', overflow:'auto', height:'100%', background:B.cream }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:900, color:B.black, letterSpacing:'-.01em' }}>Nuevo programa</div>
          <div style={{ fontSize:11, color:B.gray3, marginTop:3, fontWeight:500 }}>Completa los datos básicos para comenzar</div>
        </div>
        <button className="btn" onClick={onCancel} style={{ background:B.white, border:`1.5px solid ${B.gray2}`, borderRadius:8, width:34, height:34, color:B.gray4, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
      </div>
      <div style={{ background:B.white, borderRadius:10, border:`1px solid ${B.gray2}`, padding:'16px 18px' }}>
        {[['nombre','Nombre del programa *','text'],['ola','Ola','sel_ola'],['subtipo','Tipo','sel_sub'],['facultad','Facultad','sel_fac'],['modalidad','Modalidad','text'],['inicio','Fecha de inicio','text'],['director','Director académico','text'],['arancel','Arancel','text'],['matricula','Matrícula','text']].map(([k,lbl,type])=>(
          <div key={k} style={{ marginBottom:11 }}>
            <label style={{ display:'block', fontSize:9.5, color:B.gray3, marginBottom:4, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase' }}>{lbl}</label>
            {type==='sel_fac'
              ? <select className="inp" value={f[k]} onChange={e=>upd(k,e.target.value)} style={IS}><option value="">— Selecciona —</option>{FACULTIES.map(x=><option key={x}>{x}</option>)}</select>
              : type==='sel_ola'
              ? <select className="inp" value={f[k]} onChange={e=>upd(k,e.target.value)} style={IS}><option value="">— Sin ola —</option>{OLAS.map(o=><option key={o}>{o}</option>)}</select>
              : type==='sel_sub'
              ? <select className="inp" value={f[k]} onChange={e=>upd(k,e.target.value)} style={IS}><option value="">— Selecciona —</option>{SUBTIPOS.map(s=><option key={s}>{s}</option>)}</select>
              : <input className="inp" value={f[k]} onChange={e=>upd(k,e.target.value)} style={IS} placeholder={lbl.replace(' *','')}/>
            }
          </div>
        ))}
      </div>
      <button disabled={!ok} className="btn" onClick={()=>onSave(f)} style={{
        width:'100%', padding:'11px', borderRadius:8, border:'none', marginTop:14,
        background: ok ? B.pink : B.gray2,
        color: ok ? B.white : B.gray3,
        fontSize:14, fontWeight:800,
        boxShadow: ok ? `0 6px 20px ${B.pink}50` : 'none',
        letterSpacing:'.02em',
      }}>Crear programa</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════ */
const SK = 'ec2026_v7';
const PRIORITY_IDS = new Set(['p_67','p_68','p_76','p_69','p_70']);

export default function App() {
  const [programs, setPrograms] = useState(null);
  const [selected, setSelected] = useState(null);
  const [fFac,  setFFac]  = useState('Todos');
  const [fOla,  setFOla]  = useState('Todas');
  const [fTipo, setFTipo] = useState('Todos');
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(()=>{
    (async()=>{
      try {
        const res = await window.storage.get(SK);
        if(res?.value){ const d=JSON.parse(res.value); setPrograms(d); setSelected(d[0]?.id||null); }
        else { setPrograms(SEED); setSelected(SEED[0].id); }
      } catch { setPrograms(SEED); setSelected(SEED[0].id); }
      setReady(true);
    })();
  },[]);

  useEffect(()=>{
    if(!ready||!programs) return;
    (async()=>{ try { await window.storage.set(SK,JSON.stringify(programs)); } catch{} })();
  },[programs,ready]);

  const upd = useCallback(u => setPrograms(ps=>ps.map(p=>p.id===u.id?u:p)),[]);
  const del = useCallback(()=>{
    setPrograms(ps=>{ const n=ps.filter(p=>p.id!==selected); setSelected(n[0]?.id||null); return n; });
    setAdding(false);
  },[selected]);
  const add = useCallback(form=>{
    const p=mkProg(form);
    setPrograms(ps=>[...ps,p]); setSelected(p.id); setAdding(false);
  },[]);

  if(!ready||!programs) return(
    <div style={{ height:700, display:'flex', alignItems:'center', justifyContent:'center',
      background:B.cream, fontFamily:"'Montserrat',sans-serif", color:B.gray3, fontSize:14, fontWeight:500 }}>
      Cargando…
    </div>
  );

  const total   = programs.length;
  const avg     = total ? Math.round(programs.reduce((a,p)=>a+getPct(p.tasks,p.customTasks),0)/total) : 0;
  const sinIni  = programs.filter(p=>getPct(p.tasks,p.customTasks)<5).length;
  const enCurso = programs.filter(p=>{ const x=getPct(p.tasks,p.customTasks); return x>=5&&x<100; }).length;
  const done100 = programs.filter(p=>getPct(p.tasks,p.customTasks)===100).length;

  const olasVis   = OLAS.filter(o=>programs.some(p=>p.ola===o));
  const sinOlaCnt = programs.filter(p=>!p.ola).length;
  const anyFilter = fFac!=='Todos'||fOla!=='Todas'||fTipo!=='Todos'||search;

  const visible = programs.filter(p=>{
    const mf=fFac==='Todos'||p.facultad===fFac;
    const mo=fOla==='Todas'||(fOla==='Sin ola'?!p.ola:fOla==='Prioritarios'?PRIORITY_IDS.has(p.id):p.ola===fOla);
    const mt=fTipo==='Todos'||p.subtipo===fTipo;
    const ms=!search||p.nombre.toLowerCase().includes(search.toLowerCase())||(p.director||'').toLowerCase().includes(search.toLowerCase());
    return mf&&mo&&mt&&ms;
  }).sort((a,b) => {
    const pa = PRIORITY_IDS.has(a.id) ? 0 : 1;
    const pb = PRIORITY_IDS.has(b.id) ? 0 : 1;
    return pa - pb;
  });

  const selProg = programs.find(p=>p.id===selected);
  const FAC_SHORT_MAP = {'Arquitectura y Diseño':'Arq.','Ciencias Jurídicas y Sociales':'Jurídicas','Diversidad, Género e Inclusión':'Diversidad','Negocios y Tecnología':'Negocios'};

  return (
    <>
      <style>{CSS}</style>
      <div className="mas" style={{ display:'flex', flexDirection:'column', height:700, overflow:'hidden' }}>

        {/* ── TOPBAR ── */}
        <div style={{
          background:B.black, color:B.white,
          padding:'0 22px',
          display:'flex', alignItems:'stretch', gap:0,
          flexShrink:0,
        }}>
          {/* Brand identity */}
          <div style={{ padding:'12px 0', display:'flex', alignItems:'center', gap:14, paddingRight:24, borderRight:`1px solid #2A2A2A`, marginRight:22, flexShrink:0 }}>
            {/* māS wordmark */}
            <div style={{ display:'flex', flexDirection:'column', gap:0, lineHeight:1 }}>
              <div style={{ fontSize:18, fontWeight:900, color:B.white, letterSpacing:'-.02em' }}>māS</div>
              <div style={{ fontSize:7.5, color:'#888', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', marginTop:1 }}>Educación Continua</div>
            </div>
            <MasLogo size={16}/>
          </div>

          {/* Page title */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', paddingRight:24, borderRight:`1px solid #2A2A2A`, marginRight:0 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:'#CCC', letterSpacing:'.06em', textTransform:'uppercase' }}>Seguimiento de lanzamiento</div>
            <div style={{ fontSize:9, color:'#666', marginTop:2, fontWeight:500 }}>Olas 1–6 · 2026</div>
          </div>

          {/* Stats */}
          {[
            ['Programas', total, B.white, null],
            ['Promedio', `${avg}%`, pctColor(avg), pctColor(avg)],
            ['Sin iniciar', sinIni, '#888', null],
            ['En curso', enCurso, B.orange, B.orange],
            ['Completados', done100, '#27AE60', '#27AE60'],
          ].map(([label,value,color,accent])=>(
            <StatBox key={label} label={label} value={value} color={color} accent={accent}/>
          ))}

          <div style={{ flex:1 }}/>

          <div style={{ display:'flex', alignItems:'center' }}>
            <button className="btn" onClick={()=>{setAdding(true);setSelected(null);}} style={{
              background:B.pink, color:B.white, border:'none', borderRadius:8,
              padding:'8px 18px', fontSize:12, fontWeight:800, letterSpacing:'.02em',
              boxShadow:`0 4px 16px ${B.pink}60`,
            }}>+ Nuevo programa</button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

          {/* LEFT PANEL */}
          <div style={{ width:316, flexShrink:0, display:'flex', flexDirection:'column', borderRight:`1px solid ${B.gray2}`, background:B.white, overflow:'hidden' }}>

            {/* Search */}
            <div style={{ padding:'10px 12px', borderBottom:`1px solid ${B.gray1}` }}>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:B.gray3, fontSize:14, pointerEvents:'none' }}>⌕</span>
                <input className="inp" value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Buscar programa o director…"
                  style={{...IS, paddingLeft:30, fontSize:12}}/>
              </div>
            </div>

            {/* Filters — branded */}
            <div style={{ background:B.cream, borderBottom:`1px solid ${B.gray1}`, flexShrink:0 }}>
              {/* Ola */}
              <div style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', overflowX:'auto' }}>
                <span style={{ fontSize:8.5, color:B.gray3, fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em', flexShrink:0, width:22 }}>Ola</span>
                <FPill label="Todas" active={fOla==='Todas'} color={B.black} onClick={()=>setFOla('Todas')}/>
                <FPill label="★ Prior." active={fOla==='Prioritarios'} color={B.pink} onClick={()=>setFOla('Prioritarios')}/>
                {olasVis.map(o=><FPill key={o} label={o.replace('Ola ','')} active={fOla===o} color={OLA_COLOR[o]||B.gray3} onClick={()=>setFOla(o)}/>)}
                {sinOlaCnt>0 && <FPill label="—" active={fOla==='Sin ola'} color={B.gray3} onClick={()=>setFOla('Sin ola')}/>}
              </div>
              {/* Tipo */}
              <div style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', overflowX:'auto', borderTop:`1px solid ${B.gray2}` }}>
                <span style={{ fontSize:8.5, color:B.gray3, fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em', flexShrink:0, width:22 }}>Tipo</span>
                <FPill label="Todos" active={fTipo==='Todos'} color={B.black} onClick={()=>setFTipo('Todos')}/>
                {SUBTIPOS.map(s=><FPill key={s} label={s} active={fTipo===s} color={TIPO_COLOR[s]} onClick={()=>setFTipo(s)}/>)}
              </div>
              {/* Facultad */}
              <div style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', overflowX:'auto', borderTop:`1px solid ${B.gray2}` }}>
                <span style={{ fontSize:8.5, color:B.gray3, fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em', flexShrink:0, width:22 }}>Fac.</span>
                <FPill label="Todos" active={fFac==='Todos'} color={B.black} onClick={()=>setFFac('Todos')}/>
                {FACULTIES.map(f=><FPill key={f} label={FAC_SHORT_MAP[f]||f.split(' ')[0]} active={fFac===f} color={FAC_COLOR[f]||DEF_FAC_COLOR} onClick={()=>setFFac(f)}/>)}
              </div>
            </div>

            {/* Count row */}
            <div style={{ padding:'5px 14px', background:B.cream, borderBottom:`1px solid ${B.gray1}`,
              display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:10.5, color:B.gray3, fontWeight:500 }}>
                <strong style={{ color:B.black }}>{visible.length}</strong> de {programs.length} programas
              </span>
              {anyFilter && (
                <button className="btn" onClick={()=>{setFFac('Todos');setFOla('Todas');setFTipo('Todos');setSearch('');}} style={{
                  background:'none', border:'none', fontSize:10.5, color:B.pink, fontWeight:700,
                }}>Limpiar filtros</button>
              )}
            </div>

            {/* Cards */}
            <div style={{ flex:1, overflow:'auto', padding:'10px 10px', display:'flex', flexDirection:'column', gap:7 }}>
              {visible.map(prog=>(
                <PCard key={prog.id} prog={prog}
                  selected={prog.id===selected&&!adding}
                  onClick={()=>{ setSelected(prog.id); setAdding(false); }}/>
              ))}
              {visible.length===0 && (
                <div style={{ textAlign:'center', paddingTop:50, color:B.gray3 }}>
                  <div style={{ fontSize:36, marginBottom:8, opacity:.25 }}>◌</div>
                  <div style={{ fontSize:13, fontWeight:600 }}>Sin resultados</div>
                  <div style={{ fontSize:11, marginTop:4 }}>Prueba con otros filtros</div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ flex:1, overflow:'hidden', background:B.cream }}>
            {adding ? (
              <NewForm onSave={add} onCancel={()=>{ setAdding(false); if(!selProg&&programs[0]) setSelected(programs[0].id); }}/>
            ) : selProg ? (
              <Detail prog={selProg} onUpdate={upd} onDelete={del}/>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:14, color:B.gray3 }}>
                <MasLogo size={32}/>
                <div style={{ fontSize:14, fontWeight:700, color:B.gray4 }}>Selecciona un programa</div>
                <div style={{ fontSize:11.5, color:B.gray3, fontWeight:500 }}>para ver su detalle y checklist de lanzamiento</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
