import React, { useState, useEffect, useRef } from 'react';
import { 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Briefcase, 
  Bus, 
  MessageCircle, 
  ClipboardList, 
  AlertTriangle, 
  Printer, 
  Copy, 
  Save, 
  RefreshCw, 
  MapPin, 
  ExternalLink, 
  Send, 
  Trash2, 
  Plus,
  Check,
  GraduationCap,
  Coins,
  FileText,
  Library,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Building2,
  Bookmark,
  Filter,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  HelpCircle,
  User as UserIcon,
  Compass,
  AlertCircle,
  History,
  RotateCcw,
  Apple,
  Home,
  Hospital,
  Baby,
  Zap,
  Book,
  Scale,
  Brain,
  Globe,
  Bell,
  Train,
  Clock,
  DollarSign,
  Navigation,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { auth, signInWithGoogle, logout, db, handleFirestoreError, OperationType } from './firebase';
import { BrandLogo } from './components/BrandLogo';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { runMIACompassAgent } from './services/geminiService';

// --- Translations ---
const translations = {
  English: {
    dashboard: "Dashboard",
    resources: "Resources",
    jobs: "Jobs",
    transit: "Transit Hub",
    edugrants: "EduGrants Hub",
    chat: "Ask MIACompa",
    plan: "My Plan",
    profile: "My Profile",
    newSearch: "New Search",
    printPlan: "Print Plan",
    resourcePlan: "Your Resource Plan",
    copyPlan: "Copy Plan",
    saveSteps: "Save Steps to My Plan",
    stepsSaved: "Steps Saved!",
    actionSteps: "Action Steps",
    savedPrograms: "Saved Programs",
    savedJobs: "Saved Jobs",
    noSteps: "No action steps saved yet.",
    addSupport: "Add Support Area",
    findResources: "Find Resources",
    criticalUrgency: "CRITICAL URGENCY DETECTED",
    call211: "Call 2-1-1 immediately for emergency assistance.",
    callNow: "Call Now",
    tripPlanner: "Trip Planner",
    from: "From",
    to: "To",
    useHome: "Use Home Address",
    openMaps: "Open in Google Maps",
    localJobs: "Local Job Openings",
    refresh: "Refresh",
    sortBy: "Sort By",
    newest: "Newest First",
    oldest: "Oldest First",
    title: "Job Title (A-Z)",
    applyNow: "Apply Now",
    careerSource: "CareerSource South Florida",
    careerSourceDesc: "Free job placement, training, and resume help for Miami-Dade residents.",
    visitCareerSource: "Visit CareerSource",
    askMIACompa: "Ask MIACompa",
    typeQuestion: "Type a follow-up question...",
    thinking: "MIACompa is thinking...",
    myProfile: "My Profile",
    saveProfile: "Save Profile",
    refreshPlan: "Refresh Plan",
    address: "Address",
    street: "Street Address",
    city: "City",
    neighborhood: "Neighborhood",
    zip: "Zip Code",
    language: "Preferred Language",
    age: "Age",
    familyStatus: "Family Status",
    children: "Number of Children",
    employment: "Employment Status",
    housing: "Housing Status",
    income: "Income Level",
    insurance: "Health Insurance",
    needs: "Current Needs",
    urgency: "Urgency Level",
    normal: "Normal",
    urgent: "Urgent",
    critical: "Critical",
    resourceMap: "Resource Map",
    resourceMapDesc: "View all Community Resource Center locations and hours on a map.",
    onboardingSurvey: "Onboarding Survey",
    stepOf: "Step",
    of: "of",
    tellUsAbout: "Tell us about yourself",
    workHousing: "Work & Housing",
    needHelpWith: "What do you need help with?",
    location: "Location",
    urgencyTitle: "Urgency",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    generatePlan: "Generate Plan",
    criticalDesc: "I need help immediately (within 24 hours)",
    highDesc: "I need help soon (within a few days)",
    normalDesc: "I am planning for the future",
    loadingTitle: "Navigating your resources...",
    loadingStep1: "Analyzing your profile",
    loadingStep2: "Searching verified programs",
    loadingStep3: "Checking eligibility",
    loadingStep4: "Building your action plan",
    landingTitle: "MIACompass Hub",
    landingSubtitle: "Miami has resources for you. Let's find them together.",
    signInGoogle: "Sign in with Google",
    startNavigator: "Start Your Navigator",
    updateProfile: "Update Profile",
    skipForNow: "Skip for now",
    verifiedResources: "Verified Resources",
    jobMatching: "Job Matching",
    transitPlanner: "Transit Planner",
    aiSupport: "AI Support",
    high: "High",
    familySituation: "Family Situation",
    employmentStatus: "Employment Status",
    housingSituation: "Housing Situation",
    incomeRange: "Monthly Income Range",
    yes: "Yes",
    no: "No",
    confirmNewSearch: "Are you sure you want to start a new search? This will clear your current plan and survey data.",
    confirmRefreshPlan: "Are you sure you want to refresh your plan? This will generate a new plan based on your current profile.",
    failedRefresh: "Failed to refresh plan. Please try again.",
    noNeeds: "No needs selected.",
    addMoreNeeds: "Add More Needs",
    noStepsSaved: "No action steps saved yet.",
    stepsNotFound: "We couldn't automatically find the 'Next Steps' section. You can try copying the plan and manually adding steps in the 'My Plan' tab.",
    stepsParseError: "We found the steps section but couldn't parse the individual steps. Please try again or add them manually.",
    stepsAlreadySaved: "All steps from this plan are already in your 'My Plan' tab.",
    generatingPlan: "Generating your personalized plan...",
    searchingJobs: "Searching for jobs...",
    noDescription: "No description available.",
    noRequirements: "No specific requirements listed.",
    noAppLink: "Application link not available. Contact company directly.",
    noJobsMatch: "No jobs match your current filters.",
    clickRefreshJobs: "Click refresh to find jobs matching your profile.",
    enterDestination: "Please enter a destination",
    selectOneArea: "Please select at least one area",
    needFood: "Food",
    needHousing: "Housing",
    needHealth: "Healthcare",
    needJobs: "Jobs",
    needChildcare: "Childcare",
    needUtilities: "Utilities",
    needEducation: "Education",
    needTransportation: "Transportation",
    needLegal: "Legal",
    needMentalHealth: "Mental Health",
    unemployed: "Unemployed",
    employedFull: "Employed (Full-time)",
    employedPart: "Employed (Part-time)",
    student: "Student",
    retired: "Retired",
    zipPlaceholder: "e.g. 33101",
    employed: "Employed",
    stable: "Stable",
    atRisk: "At Risk",
    unsheltered: "Unsheltered",
    low: "Low",
    medium: "Medium",
    single: "Single",
    married: "Married",
    singleParent: "Single Parent",
    all: "All",
    other: "Other",
    category: "Category",
    allCategories: "All Categories",
    allLocations: "All Locations",
    alphabetical: "Job Title (A-Z)",
    help: "Help",
    faqTitle: "Frequently Asked Questions",
    faq1: "What is MIACompass Hub?",
    ans1: "MIACompass Hub is a personalized navigator for Miami-Dade residents. It uses AI to match your specific needs with verified local resources, jobs, and transit options.",
    faq2: "How do I use the resource plan?",
    ans2: "Your resource plan is generated based on your survey answers. You can save specific 'Action Steps' to your 'My Plan' tab to track your progress. You can also print or copy the plan.",
    faq3: "What are the resource categories?",
    ans3: "We cover housing, food, healthcare, jobs, childcare, utilities, education, transportation, legal aid, and mental health. Each category is matched to your location and eligibility.",
    faq4: "How do I talk to MIACompa?",
    ans4: "MIACompa is your AI assistant. You can ask follow-up questions about your plan, ask for more details about a program, or get advice on how to apply for services in the 'Ask MIACompa' tab.",
    helpIntro: "Need help navigating the hub? Here are some common questions and tips for getting the most out of MIACompass.",
    searchHistory: "Search History",
    noHistory: "No search history found.",
    reaccessPlan: "Re-access Plan",
    restorePlan: "Restore this plan",
    historyItemDesc: "Search from",
    viewPlan: "View Plan",
    emergency: "Emergency",
    crisis: "Crisis",
    mentalHealth: "Mental Health",
    domesticViolence: "Domestic Violence",
    findMyResources: "Find My Resources",
    needHelpNow: "I Need Help Right Now",
    free100: "100% Free",
    engEsp: "English & Español",
    realPrograms: "Real Miami-Dade Programs",
    privateConfidential: "Private & Confidential",
    notSureWhereToStart: "Not sure where to start?",
    takeSurvey: "Take the Survey",
    getRoutes: "Get Routes",
    travelTime: "Travel Time",
    fare: "Fare",
    noRoutesFound: "No transit routes found.",
    loadingRoutes: "Finding best routes...",
    sendFeedback: "Send Feedback",
    feedbackTitle: "Share Your Feedback",
    feedbackPlaceholder: "How can we improve MIACompass? Tell us about your experience...",
    submitFeedback: "Submit Feedback",
    feedbackSuccess: "Thank you for your feedback! We use your input to improve the hub for all residents.",
    feedbackError: "Failed to send feedback. Please try again later."
  },
  Spanish: {
    dashboard: "Panel de Control",
    resources: "Recursos",
    jobs: "Empleos",
    transit: "Centro de Tránsito",
    edugrants: "Centro EduGrants",
    chat: "Pregunta a MIACompa",
    plan: "Mi Plan",
    profile: "Mi Perfil",
    newSearch: "Nueva Búsqueda",
    printPlan: "Imprimir Plan",
    resourcePlan: "Tu Plan de Recursos",
    copyPlan: "Copiar Plan",
    saveSteps: "Guardar Pasos en Mi Plan",
    stepsSaved: "¡Pasos Guardados!",
    actionSteps: "Pasos de Acción",
    savedPrograms: "Programas Guardados",
    savedJobs: "Empleos Guardados",
    noSteps: "No hay pasos de acción guardados aún.",
    addSupport: "Añadir Área de Apoyo",
    findResources: "Buscar Recursos",
    criticalUrgency: "URGENCIA CRÍTICA DETECTADA",
    call211: "Llame al 2-1-1 inmediatamente para asistencia de emergencia.",
    callNow: "Llamar Ahora",
    tripPlanner: "Planificador de Viajes",
    from: "Desde",
    to: "Hasta",
    useHome: "Usar Dirección de Casa",
    openMaps: "Abrir en Google Maps",
    localJobs: "Ofertas de Empleo Locales",
    refresh: "Actualizar",
    sortBy: "Ordenar Por",
    newest: "Más Recientes",
    oldest: "Más Antiguos",
    title: "Título del Puesto (A-Z)",
    applyNow: "Aplicar Ahora",
    careerSource: "CareerSource South Florida",
    careerSourceDesc: "Colocación laboral, capacitación y ayuda con el currículum gratis para residentes de Miami-Dade.",
    visitCareerSource: "Visitar CareerSource",
    askMIACompa: "Pregunta a MIACompa",
    typeQuestion: "Escribe una pregunta de seguimiento...",
    thinking: "MIACompa está pensando...",
    myProfile: "Mi Perfil",
    saveProfile: "Guardar Perfil",
    refreshPlan: "Actualizar Plan",
    address: "Dirección",
    street: "Dirección de la Calle",
    city: "Ciudad",
    neighborhood: "Barrio",
    zip: "Código Postal",
    language: "Idioma Preferido",
    age: "Edad",
    familyStatus: "Estado Familiar",
    children: "Número de Hijos",
    employment: "Estado de Empleo",
    housing: "Estado de Vivienda",
    income: "Nivel de Ingresos",
    insurance: "Seguro de Salud",
    needs: "Necesidades Actuales",
    urgency: "Nivel de Urgencia",
    normal: "Normal",
    urgent: "Urgente",
    critical: "Crítico",
    resourceMap: "Mapa de Recursos",
    resourceMapDesc: "Ver todas las ubicaciones y horarios de los Centros de Recursos Comunitarios en un mapa.",
    onboardingSurvey: "Encuesta de Incorporación",
    stepOf: "Paso",
    of: "de",
    tellUsAbout: "Cuéntanos sobre ti",
    workHousing: "Trabajo y Vivienda",
    needHelpWith: "¿Con qué necesitas ayuda?",
    location: "Ubicación",
    urgencyTitle: "Urgencia",
    cancel: "Cancelar",
    back: "Atrás",
    next: "Siguiente",
    generatePlan: "Generar Plan",
    criticalDesc: "Necesito ayuda de inmediato (dentro de 24 horas)",
    highDesc: "Necesito ayuda pronto (dentro de unos días)",
    normalDesc: "Estoy planeando para el futuro",
    loadingTitle: "Navegando por tus recursos...",
    loadingStep1: "Analizando tu perfil",
    loadingStep2: "Buscando programas verificados",
    loadingStep3: "Comprobando elegibilidad",
    loadingStep4: "Construyendo tu plan de acción",
    landingTitle: "Centro MIACompass",
    landingSubtitle: "Miami tiene recursos para ti. Encontrémoslos juntos.",
    signInGoogle: "Iniciar sesión con Google",
    startNavigator: "Iniciar tu Navegador",
    updateProfile: "Actualizar Perfil",
    skipForNow: "Omitir por ahora",
    verifiedResources: "Recursos Verificados",
    jobMatching: "Búsqueda de Empleo",
    transitPlanner: "Planificador de Tránsito",
    aiSupport: "Soporte de IA",
    high: "Alta",
    familySituation: "Situación Familiar",
    employmentStatus: "Estado de Empleo",
    housingSituation: "Situación de Vivienda",
    incomeRange: "Rango de Ingresos Mensuales",
    yes: "Sí",
    no: "No",
    confirmNewSearch: "¿Estás seguro de que quieres comenzar una nueva búsqueda? Esto borrará tu plan actual y los datos de la encuesta.",
    confirmRefreshPlan: "¿Estás seguro de que quieres actualizar tu plan? Esto generará un nuevo plan basado en tu perfil actual.",
    failedRefresh: "Error al actualizar el plan. Por favor, inténtalo de nuevo.",
    noNeeds: "No se han seleccionado necesidades.",
    addMoreNeeds: "Añadir más necesidades",
    noStepsSaved: "No hay pasos de acción guardados aún.",
    stepsNotFound: "No pudimos encontrar automáticamente la sección de 'Próximos Pasos'. Puedes intentar copiar el plan y añadir los pasos manualmente en la pestaña 'Mi Plan'.",
    stepsParseError: "Encontramos la sección de pasos pero no pudimos procesar los pasos individuales. Por favor, inténtalo de nuevo o añádelos manualmente.",
    stepsAlreadySaved: "Todos los pasos de este plan ya están en tu pestaña 'Mi Plan'.",
    generatingPlan: "Generando tu plan personalizado...",
    searchingJobs: "Buscando empleos...",
    noDescription: "Descripción no disponible.",
    noRequirements: "No se enumeran requisitos específicos.",
    noAppLink: "Enlace de solicitud no disponible. Contacta a la empresa directamente.",
    noJobsMatch: "No hay empleos que coincidan con tus filtros actuales.",
    clickRefreshJobs: "Haz clic en actualizar para encontrar empleos que coincidan con tu perfil.",
    enterDestination: "Por favor, introduce un destino",
    selectOneArea: "Por favor, selecciona al menos un área",
    needFood: "Comida",
    needHousing: "Vivienda",
    needHealth: "Salud",
    needJobs: "Empleos",
    needChildcare: "Cuidado Infantil",
    needUtilities: "Servicios Públicos",
    needEducation: "Educación",
    needTransportation: "Transporte",
    needLegal: "Legal",
    needMentalHealth: "Salud Mental",
    unemployed: "Desempleado",
    employedFull: "Empleado (Tiempo completo)",
    employedPart: "Empleado (Tiempo parcial)",
    student: "Estudiante",
    retired: "Jubilado",
    zipPlaceholder: "ej. 33101",
    employed: "Empleado",
    stable: "Estable",
    atRisk: "En riesgo",
    unsheltered: "Sin refugio",
    low: "Bajo",
    medium: "Medio",
    single: "Soltero/a",
    married: "Casado/a",
    singleParent: "Padre/Madre soltero/a",
    all: "Todos",
    other: "Otro",
    category: "Categoría",
    allCategories: "Todas las categorías",
    allLocations: "Todas las ubicaciones",
    alphabetical: "Título del Puesto (A-Z)",
    help: "Ayuda",
    faqTitle: "Preguntas Frecuentes",
    faq1: "¿Qué es el Centro MIACompass?",
    ans1: "El Centro MIACompass es un navegador personalizado para los residentes de Miami-Dade. Utiliza IA para emparejar sus necesidades específicas con recursos locales verificados, empleos y opciones de tránsito.",
    faq2: "¿Cómo uso el plan de recursos?",
    ans2: "Su plan de recursos se genera en función de sus respuestas a la encuesta. Puede guardar 'Pasos de Acción' específicos en su pestaña 'Mi Plan' para seguir su progreso. También puede imprimir o copiar el plan.",
    faq3: "¿Cuáles son las categorías de recursos?",
    ans3: "Cubrimos vivienda, alimentación, atención médica, empleos, cuidado infantil, servicios públicos, educación, transporte, asistencia legal y salud mental. Cada categoría se ajusta a su ubicación y elegibilidad.",
    faq4: "¿Cómo hablo con MIACompa?",
    ans4: "MIACompa es su asistente de IA. Puede hacer preguntas de seguimiento sobre su plan, pedir más detalles sobre un programa o recibir consejos sobre cómo solicitar servicios en la pestaña 'Pregunta a MIACompa'.",
    helpIntro: "¿Necesita ayuda para navegar por el centro? Aquí hay algunas preguntas comunes y consejos para aprovechar al máximo MIACompass.",
    searchHistory: "Historial de Búsqueda",
    noHistory: "No se encontró historial de búsqueda.",
    reaccessPlan: "Volver a acceder al Plan",
    restorePlan: "Restaurar este plan",
    historyItemDesc: "Búsqueda del",
    viewPlan: "Ver Plan",
    emergency: "Emergencia",
    crisis: "Crisis",
    mentalHealth: "Salud Mental",
    domesticViolence: "Violencia Doméstica",
    findMyResources: "Buscar Mis Recursos",
    needHelpNow: "Necesito Ayuda Ahora Mismo",
    free100: "100% Gratis",
    engEsp: "Inglés y Español",
    realPrograms: "Programas Reales de Miami-Dade",
    privateConfidential: "Privado y Confidencial",
    notSureWhereToStart: "¿No estás seguro de por dónde empezar?",
    takeSurvey: "Realizar la Encuesta",
    getRoutes: "Obtener Rutas",
    travelTime: "Tiempo de Viaje",
    fare: "Tarifa",
    noRoutesFound: "No se encontraron rutas de tránsito.",
    loadingRoutes: "Buscando las mejores rutas...",
    sendFeedback: "Enviar Comentarios",
    feedbackTitle: "Comparte tus Comentarios",
    feedbackPlaceholder: "¿Cómo podemos mejorar el Centro MIACompass? Cuéntanos tu experiencia...",
    submitFeedback: "Enviar Comentarios",
    feedbackSuccess: "¡Gracias por tus comentarios! Utilizamos tu opinión para mejorar el centro para todos los residentes.",
    feedbackError: "Error al enviar los comentarios. Por favor, inténtalo de nuevo más tarde."
  }
};

// --- Types ---
interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: string;
  surveyCompleted?: boolean;
  savedItems?: {
    programs: any[];
    jobs: any[];
    steps: any[];
  };
  searchHistory?: SearchHistoryItem[];
}

interface SearchHistoryItem {
  id: string;
  timestamp: any;
  surveyData: SurveyData;
  plan: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'job' | 'resource' | 'system';
}

interface SurveyData {
  language: string;
  age: string;
  family_status: string;
  children: string;
  employment: string;
  housing: string;
  income: string;
  insurance: string;
  needs: string[];
  street: string;
  city: string;
  zip: string;
  neighborhood: string;
  urgency: string;
}

// --- Components ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'survey' | 'loading' | 'dashboard'>('landing');
  const [surveyData, setSurveyData] = useState<SurveyData>(() => {
    const saved = localStorage.getItem('lastSurveyData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved survey data", e);
      }
    }
    return {
      language: 'English',
      age: '',
      family_status: 'Single',
      children: '0',
      employment: 'Employed',
      housing: 'Stable',
      income: 'Low',
      insurance: 'Yes',
      needs: [],
      street: '',
      city: '',
      zip: '',
      neighborhood: 'Other',
      urgency: 'normal'
    };
  });
  const [plan, setPlan] = useState<string | null>(() => localStorage.getItem('miacompass_plan'));
  const [activeTab, setActiveTab] = useState('resources');

  // Persist plan to localStorage
  useEffect(() => {
    if (plan) {
      localStorage.setItem('miacompass_plan', plan);
    } else {
      localStorage.removeItem('miacompass_plan');
    }
  }, [plan]);

  // Persist surveyData to localStorage
  useEffect(() => {
    localStorage.setItem('lastSurveyData', JSON.stringify(surveyData));
  }, [surveyData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Use onSnapshot for real-time updates
        const unsubProfile = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data() as UserProfile;
            setProfile(data);
          }
          setLoading(false);
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        });

        return () => unsubProfile();
      } else {
        setProfile(null);
        setView('landing');
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      // Profile creation is handled in firebase.ts
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleStartSurvey = () => {
    if (!user) {
      handleLogin();
    } else if (profile?.surveyCompleted) {
      setView('dashboard');
    } else {
      setView('survey');
    }
  };

  const handleSurveySubmit = async (data: SurveyData) => {
    setSurveyData(data);
    setView('loading');
    
    const timeoutId = setTimeout(() => {
      setView(v => {
        if (v === 'loading') {
          // Note: alert is discouraged in iframes, but keeping for now as per existing code
          // until a better notification system is implemented.
          alert("Plan generation is taking longer than expected. Please try again.");
          return 'survey';
        }
        return v;
      });
    }, 60000); // 1 minute timeout

    try {
      // Run AI Agent
      const generatedPlan = await runMIACompassAgent('survey', data);
      clearTimeout(timeoutId);
      setPlan(generatedPlan);
      
      // Save survey status and plan to Firestore
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const historyItem: SearchHistoryItem = {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          surveyData: data,
          plan: generatedPlan
        };

        await setDoc(userRef, { 
          surveyCompleted: true,
          lastSurveyData: data,
          currentPlan: generatedPlan,
          searchHistory: arrayUnion(historyItem)
        }, { merge: true });
      }
      
      setView('dashboard');
    } catch (error) {
      console.error("Survey submission failed", error);
      clearTimeout(timeoutId);
      setView('survey');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-blue text-white">
        <div className="text-center">
          <div className="mb-8 loading-compass">
            <BrandLogo size="xl" light showText={false} />
          </div>
          <h2 className="text-3xl">Loading MIACompa...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" role="main">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingPage 
            onStart={handleStartSurvey} 
            onLogin={handleLogin} 
            user={user} 
            language={surveyData.language} 
            onLanguageToggle={() => {
              const newLang = surveyData.language === 'English' ? 'Spanish' : 'English';
              setSurveyData({ ...surveyData, language: newLang });
            }}
          />
        )}
        {view === 'survey' && (
          <SurveyPage 
            onSubmit={handleSurveySubmit} 
            onBack={() => setView('landing')} 
            onCancel={() => { setView('dashboard'); setActiveTab('plan'); }}
            isReturningUser={!!profile?.surveyCompleted}
          />
        )}
        {view === 'loading' && (
          <LoadingScreen language={surveyData.language} />
        )}
        {view === 'dashboard' && (
          <Dashboard 
            user={user} 
            profile={profile} 
            plan={plan} 
            setPlan={setPlan}
            surveyData={surveyData}
            setSurveyData={setSurveyData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setView={setView}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

function LandingPage({ onStart, onLogin, user, language, onLanguageToggle }: { onStart: () => void, onLogin: () => void, user: User | null, language: string, onLanguageToggle: () => void }) {
  const t = translations[language as keyof typeof translations] || translations.English;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-white"
    >
      {/* Step 2: Emergency Hotlines Strip */}
      <div className="sticky top-0 z-[100] bg-coral text-white py-2 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracking-wider">
          <a href="tel:911" className="hover:underline flex items-center gap-1">
            <AlertTriangle size={12} /> {t.emergency} 911
          </a>
          <a href="tel:211" className="hover:underline flex items-center gap-1">
            <AlertCircle size={12} /> {t.crisis} 211
          </a>
          <a href="tel:988" className="hover:underline flex items-center gap-1">
            <Brain size={12} /> {t.mentalHealth} 988
          </a>
          <a href="tel:18005001119" className="hover:underline flex items-center gap-1">
            <ShieldCheck size={12} /> {t.domesticViolence} 1-800-500-1119
          </a>
        </div>
      </div>

      {/* Step 3: Nav Bar */}
      <nav className="bg-white border-b py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <BrandLogo size="md" />
          <div className="flex items-center gap-4">
            {!user ? (
              <button onClick={onLogin} className="hidden md:flex items-center gap-2 text-deep-blue font-bold text-sm hover:opacity-80">
                <LogIn size={18} /> {t.signInGoogle}
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2 text-deep-blue font-bold text-sm">
                <UserIcon size={18} /> {user.displayName || 'User'}
              </div>
            )}
            <button 
              onClick={onLanguageToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-deep-blue/10 hover:bg-deep-blue/5 transition-all text-sm font-bold text-deep-blue"
              aria-label="Toggle Language"
            >
              <Globe size={18} className="text-deep-blue" />
              <span>{language === 'English' ? 'ES' : 'EN'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Step 4: Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-deep-blue leading-tight mb-8">
            {t.landingSubtitle}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onStart} 
              className="px-8 py-4 bg-deep-blue text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {t.findMyResources} <ChevronRight />
            </button>
            <button 
              onClick={onStart} 
              className="px-8 py-4 bg-coral text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all"
            >
              {t.needHelpNow}
            </button>
          </div>
        </div>
      </section>

      {/* Step 5: Trust Signals Bar */}
      <div className="bg-sand py-8 border-y">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 text-deep-blue font-bold text-sm">
            <div className="w-8 h-8 rounded-full bg-deep-blue/10 flex items-center justify-center flex-shrink-0">
              <Coins size={16} />
            </div>
            {t.free100}
          </div>
          <div className="flex items-center gap-3 text-deep-blue font-bold text-sm">
            <div className="w-8 h-8 rounded-full bg-deep-blue/10 flex items-center justify-center flex-shrink-0">
              <Globe size={16} />
            </div>
            {t.engEsp}
          </div>
          <div className="flex items-center gap-3 text-deep-blue font-bold text-sm">
            <div className="w-8 h-8 rounded-full bg-deep-blue/10 flex items-center justify-center flex-shrink-0">
              <Building2 size={16} />
            </div>
            {t.realPrograms}
          </div>
          <div className="flex items-center gap-3 text-deep-blue font-bold text-sm">
            <div className="w-8 h-8 rounded-full bg-deep-blue/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={16} />
            </div>
            {t.privateConfidential}
          </div>
        </div>
      </div>

      {/* Step 5: Blue Banner */}
      <div className="bg-deep-blue text-white py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.notSureWhereToStart}</h2>
            <p className="opacity-80">Our AI navigator will guide you to the right programs in less than 2 minutes.</p>
          </div>
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-white text-deep-blue rounded-full font-bold text-lg hover:bg-sand transition-all whitespace-nowrap"
          >
            {t.takeSurvey}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-gray-400 text-xs">
        <p>© {new Date().getFullYear()} MIACompass Hub — Miami-Dade County Resource Navigator</p>
      </footer>
    </motion.div>
  );
}

function FeatureIcon({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-coral w-8 h-8 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function SurveyPage({ onSubmit, onBack, onCancel, isReturningUser }: { onSubmit: (data: SurveyData) => void, onBack: () => void, onCancel?: () => void, isReturningUser?: boolean }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SurveyData>({
    language: 'English',
    age: '',
    family_status: 'Single',
    children: '0',
    employment: 'Employed',
    housing: 'Stable',
    income: 'Low',
    insurance: 'Yes',
    needs: [],
    street: '',
    city: '',
    zip: '',
    neighborhood: 'Other',
    urgency: 'normal'
  });

  const t = translations[data.language as keyof typeof translations] || translations.English;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else onSubmit(data);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
    else if (!isReturningUser) onBack();
  };

  const updateData = (key: keyof SurveyData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateFields = (fields: Partial<SurveyData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const toggleNeed = (need: string) => {
    setData(prev => ({
      ...prev,
      needs: prev.needs.includes(need) 
        ? prev.needs.filter(n => n !== need) 
        : [...prev.needs, need]
    }));
  };

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-2xl card p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl">{t.onboardingSurvey}</h2>
          <div className="text-sm font-bold opacity-60">{t.stepOf} {step} {t.of} 5</div>
        </div>
        
        <div className="w-full bg-sand h-2 rounded-full mb-8 border border-black/5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={5} aria-label={`Step ${step} of 5`}>
          <motion.div 
            className="bg-coral h-full rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${step * 20}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl mb-6">{t.tellUsAbout}</h3>
              <Select label={t.language} value={data.language} onChange={v => updateData('language', v)} options={['English', 'Spanish']} />
              <Input label={t.age} type="number" value={data.age} onChange={v => updateData('age', v)} placeholder="e.g. 35" />
              <Select label={t.familySituation} value={data.family_status} onChange={v => updateData('family_status', v)} options={[t.single, t.married, t.singleParent]} />
              <Input label={t.children} type="number" value={data.children} onChange={v => updateData('children', v)} placeholder="0" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl mb-6">{t.workHousing}</h3>
              <Select label={t.employmentStatus} value={data.employment} onChange={v => updateData('employment', v)} options={[t.employed, t.unemployed, t.student, t.retired]} />
              <Select label={t.housingSituation} value={data.housing} onChange={v => updateData('housing', v)} options={[t.stable, t.atRisk, t.unsheltered]} />
              <Select label={t.incomeRange} value={data.income} onChange={v => updateData('income', v)} options={[t.low, t.medium, t.high]} />
              <Select label={t.insurance} value={data.insurance} onChange={v => updateData('insurance', v)} options={[t.yes, t.no]} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl mb-6">{t.needHelpWith}</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'food', label: t.needFood, icon: Apple },
                  { id: 'housing', label: t.needHousing, icon: Home },
                  { id: 'health', label: t.needHealth, icon: Hospital },
                  { id: 'jobs', label: t.needJobs, icon: Briefcase },
                  { id: 'childcare', label: t.needChildcare, icon: Baby },
                  { id: 'utilities', label: t.needUtilities, icon: Zap },
                  { id: 'education', label: t.needEducation, icon: Book },
                  { id: 'transportation', label: t.needTransportation, icon: Bus },
                  { id: 'legal', label: t.needLegal, icon: Scale },
                  { id: 'mental health', label: t.needMentalHealth, icon: Brain }
                ].map(need => (
                  <label key={need.id} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 capitalize">
                    <input type="checkbox" checked={data.needs.includes(need.id)} onChange={() => toggleNeed(need.id)} className="w-5 h-5" /> 
                    <need.icon size={18} className="text-coral" />
                    {need.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl mb-6">{t.location}</h3>
              <AddressAutofill 
                label={t.street} 
                value={data.street} 
                onChange={v => updateData('street', v)} 
                onAddressSelect={addr => {
                  const neighborhoodOptions = [t.other, 'Hialeah', 'Miami Beach', 'Homestead', 'North Miami', 'Little Havana', 'Little Haiti', 'Overtown', 'Liberty City', 'Coral Gables'];
                  let matchedNeighborhood = t.other;
                  if (addr.neighborhood) {
                    matchedNeighborhood = neighborhoodOptions.find(opt => 
                      addr.neighborhood!.toLowerCase().includes(opt.toLowerCase()) || 
                      opt.toLowerCase().includes(addr.neighborhood!.toLowerCase())
                    ) || t.other;
                  }
                  updateFields({ ...addr, neighborhood: matchedNeighborhood });
                }}
                placeholder="123 Main St" 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label={t.city} value={data.city} onChange={v => updateData('city', v)} placeholder="Miami" />
                <Input label={t.zip} value={data.zip} onChange={v => updateData('zip', v)} placeholder="33101" />
              </div>
              <Select label={t.neighborhood} value={data.neighborhood} onChange={v => updateData('neighborhood', v)} options={[t.other, 'Hialeah', 'Miami Beach', 'Homestead', 'North Miami', 'Little Havana', 'Little Haiti', 'Overtown', 'Liberty City', 'Coral Gables']} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl mb-6">{t.urgencyTitle}</h3>
              <UrgencyOption 
                value="critical" 
                current={data.urgency} 
                onChange={v => updateData('urgency', v)} 
                label={t.critical} 
                icon={AlertCircle}
                iconColor="text-coral"
                desc={t.criticalDesc} 
                color="text-coral"
              />
              <UrgencyOption 
                value="high" 
                current={data.urgency} 
                onChange={v => updateData('urgency', v)} 
                label={t.high} 
                icon={AlertTriangle}
                iconColor="text-yellow-500"
                desc={t.highDesc} 
              />
              <UrgencyOption 
                value="normal" 
                current={data.urgency} 
                onChange={v => updateData('urgency', v)} 
                label={t.normal} 
                icon={CheckCircle2}
                iconColor="text-teal"
                desc={t.normalDesc} 
              />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-12">
          <div>
            {step > 1 && (
              <button onClick={handlePrev} className="px-6 py-2 font-bold opacity-60 hover:opacity-100 flex items-center gap-2">
                <ChevronLeft size={18} /> {t.back}
              </button>
            )}
            {step === 1 && !isReturningUser && (
              <button onClick={handlePrev} className="px-6 py-2 font-bold opacity-60 hover:opacity-100">
                {t.back}
              </button>
            )}
          </div>
          <button onClick={handleNext} className="btn-primary">
            {step === 5 ? t.generatePlan : t.next}
          </button>
        </div>

        {isReturningUser && onCancel && (
          <div className="mt-8 pt-4 border-t flex">
            <button onClick={onCancel} className="text-sm font-bold text-coral hover:underline opacity-80 hover:opacity-100">
              {t.cancel}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Select({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) {
  const id = React.useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold mb-2">{label}</label>
      <select id={id} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, action }: { label: string, type?: string, value: string, onChange: (v: string) => void, placeholder?: string, action?: React.ReactNode }) {
  const id = React.useId();
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-sm font-bold">{label}</label>
        {action}
      </div>
      <input id={id} type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full p-3 border rounded-xl" />
    </div>
  );
}

function AddressAutofill({ 
  label, 
  value, 
  onChange, 
  onAddressSelect, 
  placeholder 
}: { 
  label: string, 
  value: string, 
  onChange: (v: string) => void, 
  onAddressSelect: (address: { street: string, city: string, zip: string, neighborhood?: string }) => void,
  placeholder?: string 
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 4) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoading(true);
    try {
      // Nominatim API for Miami area specifically if possible, or just general
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=us`);
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error("Failed to fetch address suggestions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (v: string) => {
    onChange(v);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchSuggestions(v), 500);
  };

  const handleSelect = (item: any) => {
    const addr = item.address;
    const street = `${addr.house_number || ''} ${addr.road || ''}`.trim();
    const city = addr.city || addr.town || addr.village || addr.suburb || '';
    const zip = addr.postcode || '';
    
    // Try to extract neighborhood
    const neighborhood = addr.suburb || addr.neighbourhood || addr.city_district || '';
    
    onAddressSelect({ street, city, zip, neighborhood });
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <Input 
        label={label} 
        value={value} 
        onChange={handleInputChange} 
        placeholder={placeholder} 
        action={loading ? <RefreshCw size={14} className="animate-spin opacity-50" /> : null}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-[100] w-full mt-1 bg-white border rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-0 transition-colors"
            >
              <div className="font-bold text-sm">{item.display_name.split(',')[0]}</div>
              <div className="text-[10px] opacity-60 truncate">{item.display_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UrgencyOption({ value, current, onChange, label, desc, color = "", icon: Icon, iconColor = "" }: { value: string, current: string, onChange: (v: string) => void, label: string, desc: string, color?: string, icon?: React.ElementType, iconColor?: string }) {
  const active = current === value;
  const id = React.useId();
  return (
    <label htmlFor={id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${active ? 'border-deep-blue' : 'hover:border-gray-300'}`}>
      <input id={id} type="radio" checked={active} onChange={() => onChange(value)} className="w-6 h-6" />
      <div className="flex items-center gap-3">
        {Icon && <Icon className={iconColor} size={24} aria-hidden="true" />}
        <div>
          <div className={`font-bold ${color}`}>{label}</div>
          <div className="text-sm opacity-70">{desc}</div>
        </div>
      </div>
    </label>
  );
}

function LoadingScreen({ language }: { language: string }) {
  const t = translations[language as keyof typeof translations] || translations.English;
  const [step, setStep] = useState(0);
  const steps = [
    t.loadingStep1,
    t.loadingStep2,
    t.loadingStep3,
    t.loadingStep4
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev < steps.length ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-deep-blue text-white">
      <div className="mb-8 animate-spin-slow">
        <BrandLogo size="xl" light showText={false} />
      </div>
      <h2 className="text-3xl mb-8">{t.loadingTitle}</h2>
      
      <div className="space-y-4 w-full max-w-xs">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-opacity duration-500 ${step > i ? 'opacity-100' : 'opacity-40'}`}>
            <div className="w-4 h-4 rounded-full bg-white"></div>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationPanel({ notifications, onClose, onMarkRead, onClear, t }: { 
  notifications: Notification[], 
  onClose: () => void, 
  onMarkRead: (id: string) => void,
  onClear: () => void,
  t: any
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border z-[60] overflow-hidden"
    >
      <div className="p-4 border-b flex justify-between items-center bg-sand/10">
        <h3 className="font-bold flex items-center gap-2">
          <Bell size={16} className="text-teal" />
          Notifications
        </h3>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <button onClick={onClear} className="text-[10px] text-gray-400 hover:text-coral font-bold uppercase tracking-wider">
              Clear All
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Plus size={18} className="rotate-45" />
          </button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell size={20} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-500">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-teal/5' : ''}`}
                onClick={() => onMarkRead(n.id)}
              >
                {!n.read && <div className="absolute top-4 right-4 w-2 h-2 bg-coral rounded-full" />}
                <div className="flex gap-3">
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === 'job' ? 'bg-blue-100 text-blue-600' : 
                    n.type === 'resource' ? 'bg-coral/10 text-coral' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {n.type === 'job' ? <Briefcase size={14} /> : 
                     n.type === 'resource' ? <AlertTriangle size={14} /> : 
                     <Bell size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{n.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{n.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EduGrantsPanel({ surveyData, savedItems, setSavedItems }: { surveyData: SurveyData, savedItems: any, setSavedItems: any }) {
  const t = translations[surveyData.language as keyof typeof translations] || translations.English;
  const [locationTab, setLocationTab] = useState<'florida' | 'miami' | 'broward'>('miami');

  const toggleSave = (item: any) => {
    const isSaved = savedItems.programs.some((p: any) => p.name === item.name);
    if (isSaved) {
      setSavedItems({
        ...savedItems,
        programs: savedItems.programs.filter((p: any) => p.name !== item.name)
      });
    } else {
      setSavedItems({
        ...savedItems,
        programs: [...savedItems.programs, item]
      });
    }
  };

  const data = {
    florida: {
      grants: [
        { name: "Bright Futures Scholarship", org: "Florida Department of Education", covers: "Merit-based scholarship for FL high school graduates.", qualifies: "FL residents, high GPA/test scores, community service.", website: "https://www.floridastudentfinancialaidsg.org/", icon: <Coins /> },
        { name: "Florida Student Assistance Grant (FSAG)", org: "Florida Department of Education", covers: "Need-based grant for undergraduate students.", qualifies: "FL residents with substantial financial need.", website: "https://www.floridastudentfinancialaidsg.org/", icon: <Coins /> },
        { name: "Florida Prepaid College Plan", org: "Florida Prepaid College Board", covers: "Prepaid tuition and fees for FL colleges/universities.", qualifies: "FL residents (purchased in advance).", website: "https://www.myfloridaprepaid.com/", icon: <Coins /> },
        { name: "State Workforce Grants", org: "CareerSource Florida", covers: "Funding for vocational and technical training.", qualifies: "Unemployed or underemployed FL residents.", website: "https://careersourceflorida.com/", icon: <Coins /> },
        { name: "Minority Teacher Education Scholarship", org: "Florida Fund for Minority Teachers", covers: "$4,000 annual scholarship for minority students in teaching.", qualifies: "Minority students pursuing teaching degrees in FL.", website: "https://www.ffmt.org/", icon: <Coins /> },
        { name: "Jose Marti Scholarship", org: "Florida Department of Education", covers: "Need-based scholarship for students of Hispanic heritage.", qualifies: "Hispanic students with 3.0+ GPA and financial need.", website: "https://www.floridastudentfinancialaidsg.org/", icon: <Coins /> }
      ],
      colleges: [
        { name: "Florida College System", org: "State of Florida", covers: "Access to 28 state colleges offering AA degrees and certificates.", qualifies: "All FL residents (open enrollment).", website: "https://www.fldoe.org/schools/higher-ed/fl-college-system/", icon: <GraduationCap /> },
        { name: "Florida College Promise", org: "State of Florida", covers: "Free tuition for eligible students at state colleges.", qualifies: "Pell-eligible students at participating colleges.", website: "https://www.fldoe.org/", icon: <GraduationCap /> },
        { name: "State University System", org: "UF, FSU, FIU, FAU, UCF", covers: "World-class public university education.", qualifies: "Competitive admission for high school graduates.", website: "https://www.flbog.edu/", icon: <GraduationCap /> },
        { name: "Florida Virtual School (FLVS)", org: "State of Florida", covers: "Free online K-12 education for all FL students.", qualifies: "All FL residents (K-12).", website: "https://www.flvs.net/", icon: <GraduationCap /> }
      ],
      fafsa: [
        { name: "FL Student Financial Aid Info", org: "OSFA", covers: "Central hub for all Florida state-funded financial aid.", qualifies: "All FL students.", website: "https://www.floridastudentfinancialaidsg.org/", icon: <FileText /> },
        { name: "FAFSA State Deadlines", org: "Federal Student Aid", covers: "Florida state aid deadline is May 15 each year.", qualifies: "All FAFSA applicants in FL.", website: "https://studentaid.gov/", icon: <FileText /> },
        { name: "Free FAFSA Help Line", org: "State of Florida", covers: "Direct phone support for FAFSA completion.", qualifies: "Anyone needing help with FAFSA.", phone: "1-888-827-2004", icon: <FileText /> }
      ],
      study: [
        { name: "CareerSource Training Vouchers", org: "CareerSource Florida", covers: "Vouchers for free industry-recognized certifications.", qualifies: "Eligible job seekers.", website: "https://careersourceflorida.com/", icon: <Library /> },
        { name: "Workforce Training Programs", org: "State of Florida", covers: "Rapid credentialing for high-demand jobs.", qualifies: "FL residents looking for career changes.", website: "https://www.gettherefl.com/", icon: <Library /> },
        { name: "Online Degree Programs", org: "FL State Colleges", covers: "Flexible online AA and Bachelor's degrees.", qualifies: "Working adults and remote students.", website: "https://www.floridashines.org/", icon: <Library /> }
      ]
    },
    miami: {
      grants: [
        { name: "MDC EASE Grant", org: "Miami Dade College", covers: "Need-based grant for MDC students.", qualifies: "MDC students with financial need.", website: "https://www.mdc.edu/financialaid/", icon: <Coins /> },
        { name: "MDC Foundation Scholarships", org: "MDC Foundation", covers: "Hundreds of private scholarships for MDC students.", qualifies: "Current and incoming MDC students.", website: "https://www.mdc.edu/scholarships/", icon: <Coins /> },
        { name: "Knight Foundation Miami Grants", org: "Knight Foundation", covers: "Funding for arts, journalism, and tech education.", qualifies: "Miami-based creators and students.", website: "https://knightfoundation.org/miami/", icon: <Coins /> },
        { name: "The Children's Trust Funding", org: "The Children's Trust", covers: "Education and enrichment funding for youth.", qualifies: "Miami-Dade families and youth programs.", website: "https://www.thechildrenstrust.org/", icon: <Coins /> },
        { name: "United Way Miami Grants", org: "United Way Miami", covers: "Education support and financial stability grants.", qualifies: "Low-income Miami-Dade residents.", website: "https://unitedwaymiami.org/", icon: <Coins /> },
        { name: "Youth Fair Scholarships", org: "Miami-Dade County Youth Fair", covers: "Scholarships for local high school seniors.", qualifies: "Miami-Dade graduating seniors.", website: "https://www.fairexpo.com/", icon: <Coins /> }
      ],
      colleges: [
        { name: "Miami Dade College (MDC)", org: "8 Campuses", covers: "Wolfson, Kendall, Hialeah, North, Homestead, Padron, Medical, Interamerican.", qualifies: "Open enrollment for all residents.", website: "https://www.mdc.edu/", icon: <GraduationCap /> },
        { name: "FIU", org: "Florida International University", covers: "Miami's public research university.", qualifies: "Competitive admission.", website: "https://www.fiu.edu/", icon: <GraduationCap /> },
        { name: "Barry University", org: "Private University", covers: "Catholic university in Miami Shores.", qualifies: "Private admission.", website: "https://www.barry.edu/", icon: <GraduationCap /> },
        { name: "St. Thomas University", org: "Private University", covers: "Catholic university in Miami Gardens.", qualifies: "Private admission.", website: "https://www.stu.edu/", icon: <GraduationCap /> },
        { name: "Keiser University Miami", org: "Private University", covers: "Career-focused degree programs.", qualifies: "Private admission.", website: "https://www.keiseruniversity.edu/", icon: <GraduationCap /> }
      ],
      fafsa: [
        { name: "MDC Financial Aid Office", org: "Miami Dade College", covers: "Direct help with FAFSA and scholarships.", qualifies: "MDC students.", phone: "(305) 237-2525", website: "https://www.mdc.edu/financialaid/", icon: <FileText /> },
        { name: "Free FAFSA Workshops", org: "MDC Campuses", covers: "In-person workshops to complete your FAFSA.", qualifies: "Anyone applying for college.", website: "https://www.mdc.edu/financialaid/", icon: <FileText /> },
        { name: "FIU Financial Aid", org: "FIU", covers: "Support for FIU students and applicants.", qualifies: "FIU students.", phone: "(305) 348-7272", website: "https://onestop.fiu.edu/", icon: <FileText /> }
      ],
      study: [
        { name: "MDC Continuing Education", org: "Miami Dade College", covers: "HVAC, coding, nursing aide, CDL training.", qualifies: "Adults seeking workforce skills.", website: "https://www.mdc.edu/ce/", icon: <Library /> },
        { name: "Robert Morgan Educational Center", org: "M-DCPS", covers: "Technical and trade programs (automotive, culinary, etc.).", qualifies: "Adults and high school students.", website: "https://www.robertmorgan.edu/", icon: <Library /> },
        { name: "Free GED / Adult Ed", org: "Miami-Dade Public Schools", covers: "GED prep and adult basic education.", qualifies: "Adults without high school diplomas.", website: "https://www.adulteducationmiami.com/", icon: <Library /> },
        { name: "Free ESOL English Classes", org: "M-DCPS", covers: "English for Speakers of Other Languages.", qualifies: "Non-native English speakers.", website: "https://www.adulteducationmiami.com/", icon: <Library /> },
        { name: "CareerSource South Florida", org: "Workforce Board", covers: "Free training and job placement services.", qualifies: "Miami-Dade job seekers.", website: "https://www.careersourcesfl.com/", icon: <Library /> }
      ]
    },
    broward: {
      grants: [
        { name: "Broward College Scholarships", org: "BC Foundation", covers: "Need and merit-based scholarships for BC students.", qualifies: "Broward College students.", website: "https://www.broward.edu/scholarships/", icon: <Coins /> },
        { name: "CareerSource Broward Grants", org: "Workforce Board", covers: "Funding for vocational and technical training.", qualifies: "Broward County residents.", website: "https://careersourcebroward.com/", icon: <Coins /> },
        { name: "Children's Services Council", org: "Broward County", covers: "Education and youth development funding.", qualifies: "Broward families.", website: "https://www.cscbroward.org/", icon: <Coins /> },
        { name: "Broward Education Foundation", org: "BCPS", covers: "Scholarships for Broward public school students.", qualifies: "BCPS graduating seniors.", website: "https://browardedfoundation.org/", icon: <Coins /> },
        { name: "United Way Broward Funding", org: "United Way", covers: "Education and financial prosperity grants.", qualifies: "Low-income Broward residents.", website: "https://www.unitedwaybroward.org/", icon: <Coins /> }
      ],
      colleges: [
        { name: "Broward College (BC)", org: "3 Campuses", covers: "Central, North, South campuses and centers.", qualifies: "Open enrollment.", website: "https://www.broward.edu/", icon: <GraduationCap /> },
        { name: "Nova Southeastern University", org: "Private University", covers: "Private research university in Ft. Lauderdale.", qualifies: "Private admission.", website: "https://www.nova.edu/", icon: <GraduationCap /> },
        { name: "FAU Davie Campus", org: "Public University", covers: "Broward campus for Florida Atlantic University.", qualifies: "Competitive admission.", website: "https://www.fau.edu/broward/", icon: <GraduationCap /> },
        { name: "Keiser University Ft. Lauderdale", org: "Private University", covers: "Main campus for Keiser University.", qualifies: "Private admission.", website: "https://www.keiseruniversity.edu/", icon: <GraduationCap /> }
      ],
      fafsa: [
        { name: "BC Financial Aid Office", org: "Broward College", covers: "Assistance with FAFSA and state aid.", qualifies: "BC students.", phone: "(954) 201-7350", website: "https://www.broward.edu/financialaid/", icon: <FileText /> },
        { name: "Free FAFSA Help", org: "BC Campuses", covers: "One-on-one help with financial aid forms.", qualifies: "Anyone applying for college.", website: "https://www.broward.edu/financialaid/", icon: <FileText /> }
      ],
      study: [
        { name: "Broward Adult Education", org: "BCPS", covers: "Free GED prep and ESOL classes.", qualifies: "Broward residents.", website: "https://www.broward.k12.fl.us/ace/", icon: <Library /> },
        { name: "CareerSource Broward Vouchers", org: "Workforce Board", covers: "Free training vouchers for high-demand jobs.", qualifies: "Eligible Broward job seekers.", website: "https://careersourcebroward.com/", icon: <Library /> },
        { name: "BC Workforce Certificates", org: "Broward College", covers: "Short-term training for immediate employment.", qualifies: "Adults seeking career skills.", website: "https://www.broward.edu/academics/workforce/", icon: <Library /> },
        { name: "McFatter Technical College", org: "BCPS", covers: "Trade and technical training programs.", qualifies: "Adults and high school students.", website: "https://www.mcfattertechnicalcollege.edu/", icon: <Library /> }
      ]
    }
  };

  const currentData = data[locationTab];

  return (
    <div className="space-y-6" role="tabpanel" id="edugrants-panel">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl">{t.edugrants}</h2>
      </div>

      <div className="flex gap-2 bg-white p-1 rounded-2xl border shadow-sm w-fit">
        <button 
          onClick={() => setLocationTab('florida')} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${locationTab === 'florida' ? 'bg-deep-blue text-white' : 'hover:bg-sand/20'}`}
        >
          🌴 Florida
        </button>
        <button 
          onClick={() => setLocationTab('miami')} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${locationTab === 'miami' ? 'bg-deep-blue text-white' : 'hover:bg-sand/20'}`}
        >
          🏙️ Miami-Dade
        </button>
        <button 
          onClick={() => setLocationTab('broward')} 
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${locationTab === 'broward' ? 'bg-deep-blue text-white' : 'hover:bg-sand/20'}`}
        >
          🌊 Broward/Ft. Lauderdale
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <EduSection title="💰 Grants & Funding" items={currentData.grants} onSave={toggleSave} savedItems={savedItems} />
        <EduSection title="🎓 College Options" items={currentData.colleges} onSave={toggleSave} savedItems={savedItems} />
        <EduSection title="📝 FAFSA Support" items={currentData.fafsa} onSave={toggleSave} savedItems={savedItems} />
        <EduSection title="📚 Study Opportunities" items={currentData.study} onSave={toggleSave} savedItems={savedItems} />
      </div>
    </div>
  );
}

function EduSection({ title, items, onSave, savedItems }: { title: string, items: any[], onSave: (item: any) => void, savedItems: any }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <EduCard key={idx} item={item} onSave={onSave} isSaved={savedItems.programs.some((p: any) => p.name === item.name)} />
        ))}
      </div>
    </div>
  );
}

function EduCard({ item, onSave, isSaved }: { item: any, onSave: (item: any) => void, isSaved: boolean }) {
  return (
    <div className="card p-6 flex flex-col h-full hover:shadow-xl transition-all border-t-4 border-teal">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal">
            {item.icon}
          </div>
          <div>
            <h4 className="font-bold leading-tight">{item.name}</h4>
            <p className="text-xs opacity-60">{item.org}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 space-y-3 mb-6">
        <div>
          <p className="text-[10px] uppercase font-bold opacity-40 mb-1 tracking-wider">What it covers</p>
          <p className="text-sm leading-relaxed">{item.covers}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold opacity-40 mb-1 tracking-wider">Who qualifies</p>
          <p className="text-sm leading-relaxed">{item.qualifies}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto pt-4 border-t">
        <div className="flex flex-wrap gap-4 text-xs font-medium opacity-70">
          {item.website && (
            <a href={item.website} target="_blank" className="flex items-center gap-1 hover:text-teal transition-colors">
              <Globe size={14} /> Website
            </a>
          )}
          {item.phone && (
            <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-teal transition-colors">
              <RefreshCw size={14} /> {item.phone}
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onSave(item)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${isSaved ? 'bg-sand text-deep-blue' : 'bg-sand/30 hover:bg-sand/50'}`}
          >
            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Saved" : "Save"}
          </button>
          {item.website && (
            <a 
              href={item.website} 
              target="_blank" 
              className="flex-1 bg-deep-blue text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
            >
              Apply <ChevronRight size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function HelpPanel({ language }: { language: string }) {
  const t = translations[language as keyof typeof translations] || translations.English;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: t.faq1, a: t.ans1 },
    { q: t.faq2, a: t.ans2 },
    { q: t.faq3, a: t.ans3 },
    { q: t.faq4, a: t.ans4 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <HelpCircle className="text-coral" size={32} /> {t.help}
          </h2>
          <p className="opacity-70 mt-2 max-w-2xl">{t.helpIntro}</p>
        </div>
        <button 
          onClick={() => (window as any).openFeedbackModal?.()}
          className="flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
        >
          <MessageSquare size={20} /> {t.sendFeedback}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card p-8">
          <h3 className="text-xl font-bold mb-6 border-b pb-4">{t.faqTitle}</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-sand/10 transition-colors font-bold"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 opacity-80 leading-relaxed border-t bg-sand/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-teal/5 border-teal/20">
            <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mb-4">
              <ClipboardList className="text-teal" size={24} />
            </div>
            <h4 className="font-bold mb-2">{t.plan}</h4>
            <p className="text-sm opacity-70">Focus on the "Action Steps" generated for you. These are the most direct ways to get help.</p>
          </div>
          <div className="card p-6 bg-coral/5 border-coral/20">
            <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center mb-4">
              <MessageCircle className="text-coral" size={24} />
            </div>
            <h4 className="font-bold mb-2">{t.chat}</h4>
            <p className="text-sm opacity-70">Don't be afraid to ask MIACompa for specifics. It knows about thousands of local programs.</p>
          </div>
          <div className="card p-6 bg-deep-blue/5 border-deep-blue/20">
            <div className="w-12 h-12 rounded-full bg-deep-blue/10 flex items-center justify-center mb-4">
              <RefreshCw className="text-deep-blue" size={24} />
            </div>
            <h4 className="font-bold mb-2">{t.refreshPlan}</h4>
            <p className="text-sm opacity-70">If your situation changes, update your profile and refresh your plan for new recommendations.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Dashboard({ user, profile, plan, setPlan, surveyData, setSurveyData, activeTab, setActiveTab, setView }: { 
  user: User | null, 
  profile: UserProfile | null, 
  plan: string | null, 
  setPlan: (p: string | null) => void,
  surveyData: SurveyData,
  setSurveyData: (d: SurveyData) => void,
  activeTab: string,
  setActiveTab: (t: string) => void,
  setView: (v: 'landing' | 'survey' | 'loading' | 'dashboard') => void
}) {
  const t = translations[surveyData.language as keyof typeof translations] || translations.English;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Expose feedback modal to child components
  useEffect(() => {
    (window as any).openFeedbackModal = () => setShowFeedback(true);
    return () => { delete (window as any).openFeedbackModal; };
  }, []);

  const addNotification = (type: 'job' | 'resource' | 'system', title: string, message: string) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(7),
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 20));
  };

  // Notify on urgent plan
  useEffect(() => {
    if (plan && (surveyData.urgency === 'critical' || surveyData.urgency === 'urgent')) {
      const hasUrgentNotif = notifications.some(n => n.type === 'resource' && n.title === 'Urgent Resources Found');
      if (!hasUrgentNotif) {
        addNotification('resource', 'Urgent Resources Found', 'We have identified high-priority resources matching your urgent needs. Check your plan.');
      }
    }
  }, [plan, surveyData.urgency]);

  const [savedItems, setSavedItems] = useState<{programs: any[], jobs: any[], steps: any[]}>(() => {
    const saved = localStorage.getItem('miacompass_saved_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved items", e);
      }
    }
    return {
      programs: [],
      jobs: [],
      steps: []
    };
  });

  // Persist savedItems to localStorage
  useEffect(() => {
    localStorage.setItem('miacompass_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  // Sync savedItems with Firestore
  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, { savedItems }, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      });
    }
  }, [savedItems, user]);

  // Load savedItems from profile
  useEffect(() => {
    if (profile?.savedItems) {
      setSavedItems(profile.savedItems);
    }
  }, [profile]);

  const handleLogout = () => logout();

  const handleStartNewSearch = () => {
    setPlan(null);
    setSurveyData({
      language: 'English',
      age: '',
      family_status: 'Single',
      children: '0',
      employment: 'Employed',
      housing: 'Stable',
      income: 'Low',
      insurance: 'Yes',
      needs: [],
      street: '',
      city: '',
      zip: '',
      neighborhood: 'Other',
      urgency: 'normal'
    });
    localStorage.removeItem('miacompass_plan');
    localStorage.removeItem('lastSurveyData');
    setView('survey');
  };

  return (
    <div className="flex-1 flex flex-col">
      <nav className="sticky top-0 bg-white border-b z-50 no-print">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center h-16">
          <button 
            onClick={() => setView('landing')} 
            className="hover:opacity-80 transition-opacity"
            aria-label="Go to Home"
          >
            <BrandLogo size="sm" />
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const newLang = surveyData.language === 'English' ? 'Spanish' : 'English';
                const newData = { ...surveyData, language: newLang };
                setSurveyData(newData);
                if (user) {
                  const userRef = doc(db, 'users', user.uid);
                  setDoc(userRef, { lastSurveyData: newData }, { merge: true }).catch(err => {
                    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
                  });
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-gray-50 transition-all text-sm font-bold text-gray-600"
              aria-label="Toggle Language"
            >
              <Globe size={16} className="text-teal" />
              <span>{surveyData.language === 'English' ? 'ES' : 'EN'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('help')} 
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500" 
              title={t.help}
              aria-label={t.help}
            >
              <HelpCircle size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('plan')} 
              className="relative p-2 hover:bg-gray-100 rounded-full"
              aria-label={`${t.plan} (${savedItems.steps.length} ${t.actionSteps})`}
            >
              <ClipboardList />
              {savedItems.steps.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-coral text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {savedItems.steps.length}
                </span>
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 bg-coral text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <NotificationPanel 
                    notifications={notifications} 
                    onClose={() => setShowNotifications(false)} 
                    onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
                    onClear={() => setNotifications([])}
                    t={t}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold" aria-label="User profile">
                  {user?.displayName?.[0] || 'U'}
                </div>
              )}
              <button 
                onClick={handleLogout} 
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto no-scrollbar" role="tablist" aria-label="Dashboard navigation">
          <TabBtn id="resources" active={activeTab} onClick={setActiveTab} label={t.resources} icon={Building2} />
          <TabBtn id="edugrants" active={activeTab} onClick={setActiveTab} label={t.edugrants} icon={GraduationCap} />
          <TabBtn id="jobs" active={activeTab} onClick={setActiveTab} label={t.jobs} icon={Briefcase} />
          <TabBtn id="transit" active={activeTab} onClick={setActiveTab} label={t.transit} icon={Bus} />
          <TabBtn id="chat" active={activeTab} onClick={setActiveTab} label={t.chat} icon={MessageCircle} />
          <TabBtn id="profile" active={activeTab} onClick={setActiveTab} label={t.profile} icon={UserIcon} />
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6">
        {activeTab === 'resources' && <ResourcesPanel plan={plan} urgency={surveyData.urgency} savedItems={savedItems} setSavedItems={setSavedItems} language={surveyData.language} onStartNewSearch={handleStartNewSearch} />}
        {activeTab === 'edugrants' && <EduGrantsPanel surveyData={surveyData} savedItems={savedItems} setSavedItems={setSavedItems} />}
        {activeTab === 'jobs' && <JobsPanel surveyData={surveyData} savedItems={savedItems} setSavedItems={setSavedItems} onNotification={addNotification} />}
        {activeTab === 'transit' && <TransitPanel surveyData={surveyData} />}
        {activeTab === 'chat' && <ChatPanel surveyData={surveyData} />}
        {activeTab === 'profile' && (
          <ProfilePanel 
            surveyData={surveyData} 
            setSurveyData={setSurveyData} 
            setPlan={setPlan} 
            user={user} 
            onStartNewSearch={handleStartNewSearch} 
            onHelp={() => setActiveTab('help')}
            savedItems={savedItems}
            setSavedItems={setSavedItems}
            plan={plan}
            searchHistory={profile?.searchHistory || []}
          />
        )}
        {activeTab === 'help' && <HelpPanel language={surveyData.language} />}
      </main>

      <footer className="bg-white border-t py-8 px-6 mt-auto no-print">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <BrandLogo size="sm" />
            <span className="text-xs font-bold">© 2026 MIACompass Hub</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowFeedback(true)}
              className="text-xs font-bold text-teal hover:underline flex items-center gap-1"
            >
              <MessageSquare size={14} /> {t.sendFeedback}
            </button>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-deep-blue">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-deep-blue">Terms of Service</a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackModal 
            onClose={() => setShowFeedback(false)} 
            language={surveyData.language} 
            user={user}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfilePanel({ 
  surveyData, 
  setSurveyData, 
  setPlan, 
  user, 
  onStartNewSearch, 
  onHelp,
  savedItems,
  setSavedItems,
  plan,
  searchHistory
}: { 
  surveyData: SurveyData, 
  setSurveyData: (d: SurveyData) => void,
  setPlan: (p: string | null) => void,
  user: User | null,
  onStartNewSearch: () => void,
  onHelp: () => void,
  savedItems: any,
  setSavedItems: any,
  plan: string | null,
  searchHistory: SearchHistoryItem[]
}) {
  const t = translations[surveyData.language as keyof typeof translations] || translations.English;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'plan'>('profile');

  const handleRefreshPlan = async () => {
    if (!confirm(t.confirmRefreshPlan)) return;
    setIsRefreshing(true);
    try {
      const generatedPlan = await runMIACompassAgent('survey', surveyData);
      setPlan(generatedPlan);
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { 
          currentPlan: generatedPlan,
          lastSurveyData: surveyData
        }, { merge: true });
      }
      alert(t.refreshPlan);
    } catch (error) {
      console.error("Plan refresh failed", error);
      alert(t.failedRefresh);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateField = (key: keyof SurveyData, value: any) => {
    const newData = { ...surveyData, [key]: value };
    setSurveyData(newData);
    // Save to Firestore if user exists
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, { lastSurveyData: newData }, { merge: true }).catch(console.error);
    }
  };

  const updateFields = (fields: Partial<SurveyData>) => {
    const newData = { ...surveyData, ...fields };
    setSurveyData(newData);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, { lastSurveyData: newData }, { merge: true }).catch(console.error);
    }
  };

  return (
    <div className="space-y-8" role="tabpanel" id="profile-panel" aria-labelledby="profile-tab">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveSubTab('profile')}
            className={`text-2xl font-bold pb-2 border-b-4 transition-all ${activeSubTab === 'profile' ? 'border-teal text-deep-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {t.myProfile}
          </button>
          <button 
            onClick={() => setActiveSubTab('plan')}
            className={`text-2xl font-bold pb-2 border-b-4 transition-all ${activeSubTab === 'plan' ? 'border-teal text-deep-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {t.plan}
          </button>
        </div>
        
        {activeSubTab === 'profile' && (
          <div className="flex gap-2">
            <button onClick={onStartNewSearch} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-coral text-coral font-bold hover:bg-coral/5 transition-all text-sm">
              <RefreshCw size={16} /> {t.newSearch}
            </button>
            <button 
              onClick={handleRefreshPlan} 
              disabled={isRefreshing}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? t.thinking : t.refreshPlan}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'profile' ? (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="card p-6 space-y-6">
              <h3 className="text-xl font-bold border-b pb-2">{t.profile}</h3>
              <div className="space-y-4">
                <Select label={t.language} value={surveyData.language} onChange={v => updateField('language', v)} options={['English', 'Spanish']} />
                <Input label={t.age} type="number" value={surveyData.age} onChange={v => updateField('age', v)} />
                <Select label={t.familyStatus} value={surveyData.family_status} onChange={v => updateField('family_status', v)} options={['Single', 'Married', 'Single Parent']} />
                <Input label={t.children} type="number" value={surveyData.children} onChange={v => updateField('children', v)} />
              </div>
            </div>

            <div className="card p-6 space-y-6">
              <h3 className="text-xl font-bold border-b pb-2">{t.address}</h3>
              <div className="space-y-4">
                <AddressAutofill 
                  label={t.street} 
                  value={surveyData.street} 
                  onChange={v => updateField('street', v)} 
                  onAddressSelect={addr => {
                    const neighborhoodOptions = [t.other, 'Hialeah', 'Miami Beach', 'Homestead', 'North Miami', 'Little Havana', 'Little Haiti', 'Overtown', 'Liberty City', 'Coral Gables'];
                    let matchedNeighborhood = t.other;
                    if (addr.neighborhood) {
                      matchedNeighborhood = neighborhoodOptions.find(opt => 
                        addr.neighborhood!.toLowerCase().includes(opt.toLowerCase()) || 
                        opt.toLowerCase().includes(addr.neighborhood!.toLowerCase())
                      ) || t.other;
                    }
                    updateFields({ ...addr, neighborhood: matchedNeighborhood });
                  }}
                  placeholder="123 Main St" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input label={t.city} value={surveyData.city} onChange={v => updateField('city', v)} placeholder="Miami" />
                  <Input label={t.zip} value={surveyData.zip} onChange={v => updateField('zip', v)} placeholder="33101" />
                </div>
                <Select label={t.neighborhood} value={surveyData.neighborhood} onChange={v => updateField('neighborhood', v)} options={[t.other, 'Hialeah', 'Miami Beach', 'Homestead', 'North Miami', 'Little Havana', 'Little Haiti', 'Overtown', 'Liberty City', 'Coral Gables']} />
              </div>
            </div>

            <div className="card p-6 space-y-6">
              <h3 className="text-xl font-bold border-b pb-2">{t.needs}</h3>
              <div className="flex flex-wrap gap-2">
                {surveyData.needs.map(need => (
                  <div key={need} className="bg-teal/10 text-teal px-3 py-1 rounded-full text-sm font-bold capitalize flex items-center gap-2">
                    {need}
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <label className="block text-sm font-bold mb-2">{t.urgency}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => updateField('urgency', 'normal')}
                    className={`p-2 text-xs font-bold rounded-lg border-2 transition-all ${surveyData.urgency === 'normal' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 text-gray-500'}`}
                  >
                    {t.normal}
                  </button>
                  <button 
                    onClick={() => updateField('urgency', 'urgent')}
                    className={`p-2 text-xs font-bold rounded-lg border-2 transition-all ${surveyData.urgency === 'urgent' ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 text-gray-500'}`}
                  >
                    {t.urgent}
                  </button>
                  <button 
                    onClick={() => updateField('urgency', 'critical')}
                    className={`p-2 text-xs font-bold rounded-lg border-2 transition-all ${surveyData.urgency === 'critical' ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-500'}`}
                  >
                    {t.critical}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t md:col-span-2">
              <button 
                onClick={onHelp}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-coral hover:text-coral transition-all font-bold"
              >
                <HelpCircle size={20} /> {t.help} & FAQ
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <MyPlanPanel 
              savedItems={savedItems} 
              setSavedItems={setSavedItems} 
              surveyData={surveyData} 
              setSurveyData={setSurveyData} 
              plan={plan} 
              setPlan={setPlan} 
              user={user} 
              onStartNewSearch={onStartNewSearch} 
              searchHistory={searchHistory} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabBtn({ id, active, onClick, label, icon: Icon }: { id: string, active: string, onClick: (id: string) => void, label: string, icon?: React.ElementType }) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => onClick(id)} 
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-panel`}
      id={`${id}-tab`}
      className={`px-4 py-4 font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${isActive ? 'text-coral border-coral' : 'text-gray-500 border-transparent hover:text-deep-blue'}`}
    >
      {Icon && <Icon size={18} aria-hidden="true" />}
      {label}
    </button>
  );
}

function ResourcesPanel({ plan, urgency, savedItems, setSavedItems, language, onStartNewSearch }: { 
  plan: string | null, 
  urgency: string,
  savedItems: any,
  setSavedItems: any,
  language: string,
  onStartNewSearch: () => void
}) {
  const t = translations[language as keyof typeof translations] || translations.English;
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!plan) return;
    navigator.clipboard.writeText(plan);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveSteps = () => {
    if (!plan) return;
    
    console.log("Attempting to save steps from plan...");
    
    // More robust regex to find the steps section
    // Handles variations in emojis, text, and formatting
    const stepsRegex = /(?:###?\s*)?(?:YOUR\s+)?(?:NEXT\s+STEPS|PRÓXIMOS\s+PASOS)(?:\s+IN\s+ORDER)?\s*:?/i;
    const match = plan.match(stepsRegex);
    
    let stepsSection = '';
    if (match) {
      // Take everything after the header
      stepsSection = plan.substring(match.index! + match[0].length);
      // But stop if there's another major header (like "Getting There")
      const nextHeaderMatch = stepsSection.match(/\n(?:###?|---|\*\*)/);
      if (nextHeaderMatch) {
        stepsSection = stepsSection.substring(0, nextHeaderMatch.index);
      }
    } else {
      // Fallback: search for any numbered list at the end of the document
      const lines = plan.split('\n');
      let lastListIndex = -1;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim().match(/^(\d+\.|-|\*)\s+/)) {
          lastListIndex = i;
          break;
        }
      }
      
      if (lastListIndex !== -1) {
        let start = lastListIndex;
        // Search backwards to find the start of the list
        while (start > 0 && lines[start-1].trim().match(/^(\d+\.|-|\*)\s+/)) {
          start--;
        }
        stepsSection = lines.slice(start).join('\n');
      }
    }
    
    if (!stepsSection || stepsSection.trim().length === 0) {
      // Last ditch effort: find any line that starts with a number
      const anyNumberedLines = plan.split('\n').filter(l => l.trim().match(/^\d+\.\s+/));
      if (anyNumberedLines.length > 0) {
        stepsSection = anyNumberedLines.join('\n');
      }
    }
    
    if (!stepsSection || stepsSection.trim().length === 0) {
      console.error("Could not find steps section in plan.");
      alert(t.stepsNotFound);
      return;
    }
    
    // Get lines that look like list items (1. , 2. , - , * )
    const lines = stepsSection.split('\n')
      .map(l => l.trim())
      .filter(l => l.match(/^(\d+\.|-|\*)\s+/))
      .map(l => l.replace(/^(\d+\.|-|\*)\s+/, '').trim());
      
    if (lines.length === 0) {
      console.error("Could not extract any lines from steps section.");
      alert(t.stepsParseError);
      return;
    }
    
    console.log(`Extracted ${lines.length} steps.`);
    
    // Merge with existing steps, avoiding duplicates
    const newSteps = [...savedItems.steps];
    let addedCount = 0;
    lines.forEach(stepText => {
      if (!newSteps.some((s: any) => s.text === stepText)) {
        newSteps.push({ text: stepText, completed: false });
        addedCount++;
      }
    });
    
    if (addedCount === 0) {
      alert(t.stepsAlreadySaved);
      return;
    }

    setSavedItems({
      ...savedItems,
      steps: newSteps
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6" role="tabpanel" id="resources-panel" aria-labelledby="resources-tab">
      {urgency === 'critical' && (
        <div className="bg-coral text-white p-4 rounded-2xl flex items-center justify-between shadow-lg no-print">
          <div className="flex items-center gap-3">
            <AlertTriangle />
            <div>
              <div className="font-bold">{t.criticalUrgency}</div>
              <div className="text-sm">{t.call211}</div>
            </div>
          </div>
          <a href="tel:211" className="text-coral px-4 py-2 rounded-full font-bold" style={{ backgroundColor: '#FF4DB8' }}>{t.callNow}</a>
        </div>
      )}
      
      <div className="flex justify-between items-center no-print">
        <h2 className="text-3xl">{t.resourcePlan}</h2>
        <div className="flex gap-2">
          <button onClick={onStartNewSearch} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-coral text-coral font-bold hover:bg-coral/5 transition-all text-xs">
            <RefreshCw size={16} /> <span className="hidden md:inline">{t.newSearch}</span>
          </button>
          <button onClick={handlePrint} className="p-2 hover:bg-white rounded-xl border flex items-center gap-2 text-xs font-bold" title={t.printPlan}>
            <Printer size={20} /> <span className="hidden md:inline">{t.printPlan}</span>
          </button>
          <button onClick={handleCopy} className={`p-2 hover:bg-white rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${isCopied ? 'text-teal border-teal' : ''}`} title={t.copyPlan}>
            {isCopied ? <Check size={20} /> : <Copy size={20} />}
            <span className="hidden md:inline">{isCopied ? 'Copied!' : t.copyPlan}</span>
          </button>
        </div>
      </div>

      <div className="no-print bg-white p-6 rounded-3xl border-2 border-dashed border-teal/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal/10 text-teal rounded-full flex items-center justify-center">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-deep-blue">{t.resourceMap}</h3>
            <p className="text-sm opacity-70">{t.resourceMapDesc}</p>
          </div>
        </div>
        <a 
          href="https://www.miamidade.gov/global/service.page?Mduid_service=ser1542309305236810" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full md:w-auto px-8 py-3 bg-teal text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <ExternalLink size={20} /> {t.resourceMap}
        </a>
      </div>

      <div className="card p-8 markdown-body shadow-inner bg-sand/20 print:shadow-none print:border-none print:bg-white">
        {plan ? <ReactMarkdown>{plan}</ReactMarkdown> : <div className="text-center py-12 opacity-50 italic">{t.generatingPlan}</div>}
      </div>
      
      <div className="flex justify-center pt-4 no-print">
        <button 
          onClick={handleSaveSteps} 
          disabled={!plan || isSaved}
          className={`btn-primary flex items-center gap-3 px-8 py-4 text-lg shadow-xl transition-all ${isSaved ? 'bg-teal border-teal scale-95' : 'hover:scale-105 active:scale-95'}`}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="animate-bounce" /> {t.stepsSaved}
            </>
          ) : (
            <>
              <Save /> {t.saveSteps}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function JobsPanel({ surveyData, savedItems, setSavedItems, onNotification }: { 
  surveyData: SurveyData, 
  savedItems: any, 
  setSavedItems: any,
  onNotification?: (type: 'job' | 'resource' | 'system', title: string, message: string) => void
}) {
  const t = translations[surveyData.language as keyof typeof translations] || translations.English;
  const [jobs, setJobs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedJobIndex, setExpandedJobIndex] = useState<number | null>(null);
  const [jobZip, setJobZip] = useState(surveyData.zip);
  const [radius, setRadius] = useState('10');

  const fetchJobs = async () => {
    setLoading(true);
    setExpandedJobIndex(null);
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setJobs([]);
        console.error("fetchJobs timed out");
      }
    }, 30000); // 30 second timeout

    try {
      const jobSurveyData = { ...surveyData, zip: jobZip, radius };
      const res = await runMIACompassAgent('jobs', jobSurveyData);
      clearTimeout(timeoutId);
      let parsedJobs = [];
      try {
        const cleanRes = res.replace(/```json\n?|```/g, '').trim();
        parsedJobs = JSON.parse(cleanRes || "[]");
        if (parsedJobs.length > 0 && onNotification) {
          onNotification('job', 'New Job Matches', `We found ${parsedJobs.length} new job openings matching your profile.`);
        }
      } catch (e) {
        console.error("Failed to parse jobs JSON:", e, res);
        parsedJobs = [];
      }
      setJobs(parsedJobs);
    } catch (error) {
      console.error("fetchJobs failed:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = (job: any) => {
    const isSaved = savedItems.jobs.some((j: any) => j.title === job.title && j.company === job.company);
    if (isSaved) {
      setSavedItems({
        ...savedItems,
        jobs: savedItems.jobs.filter((j: any) => !(j.title === job.title && j.company === job.company))
      });
    } else {
      setSavedItems({
        ...savedItems,
        jobs: [...savedItems.jobs, job]
      });
    }
  };

  const categories = jobs ? Array.from(new Set(jobs.map(j => j.category))) : [];
  const locations = jobs ? Array.from(new Set(jobs.map(j => j.location))) : [];

  const filteredJobs = jobs ? jobs.filter(job => {
    const matchCategory = filterCategory === 'all' || job.category === filterCategory;
    const matchLocation = filterLocation === 'all' || job.location === filterLocation;
    return matchCategory && matchLocation;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.datePosted || 0).getTime() - new Date(a.datePosted || 0).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.datePosted || 0).getTime() - new Date(b.datePosted || 0).getTime();
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  }) : null;

  return (
    <div className="space-y-6" role="tabpanel" id="jobs-panel" aria-labelledby="jobs-tab">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl">{t.localJobs}</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border">
            <MapPin size={14} className="opacity-50" />
            <input 
              type="text" 
              value={jobZip || ''} 
              onChange={e => setJobZip(e.target.value)} 
              placeholder="Zip"
              className="w-16 text-sm outline-none"
            />
            <select 
              value={radius || ''} 
              onChange={e => setRadius(e.target.value)}
              className="text-sm outline-none bg-transparent border-l pl-2"
            >
              <option value="5">5 mi</option>
              <option value="10">10 mi</option>
              <option value="25">25 mi</option>
              <option value="50">50 mi</option>
            </select>
          </div>
          <button onClick={fetchJobs} className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {t.refresh}
          </button>
        </div>
      </div>

      <div className="bg-deep-blue text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-teal/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
            <Briefcase className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold border-white text-white">{t.careerSource}</h3>
            <p className="text-sm opacity-80">{t.careerSourceDesc}</p>
          </div>
        </div>
        <a 
          href="https://www.careersourcesfl.com/" 
          target="_blank" 
          className="bg-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all whitespace-nowrap flex items-center gap-2"
        >
          {t.visitCareerSource} <ExternalLink size={18} />
        </a>
      </div>

      {jobs && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border shadow-sm">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-1">
              <Filter size={12} /> {t.category}
            </label>
            <select 
              value={filterCategory || ''} 
              onChange={e => setFilterCategory(e.target.value)}
              className="w-full p-2 bg-sand/20 rounded-lg text-sm outline-none border border-transparent focus:border-teal/30"
            >
              <option value="all">{t.allCategories}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-1">
              <MapPin size={12} /> {t.location}
            </label>
            <select 
              value={filterLocation || ''} 
              onChange={e => setFilterLocation(e.target.value)}
              className="w-full p-2 bg-sand/20 rounded-lg text-sm outline-none border border-transparent focus:border-teal/30"
            >
              <option value="all">{t.allLocations}</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-1">
              <ArrowUpDown size={12} /> {t.sortBy}
            </label>
            <select 
              value={sortBy || ''} 
              onChange={e => setSortBy(e.target.value)}
              className="w-full p-2 bg-sand/20 rounded-lg text-sm outline-none border border-transparent focus:border-teal/30"
            >
              <option value="newest">{t.newest}</option>
              <option value="oldest">{t.oldest}</option>
              <option value="title">{t.alphabetical}</option>
            </select>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="card p-12 text-center">
            <div className="loading-compass text-4xl inline-block">
              <Compass className="text-teal animate-spin-slow" size={36} />
            </div>
            <p className="mt-4">{t.searchingJobs}</p>
          </div>
        ) : filteredJobs ? (
          filteredJobs.length > 0 ? (
            filteredJobs.map((job, i) => {
              const isSaved = savedItems.jobs.some((j: any) => j.title === job.title && j.company === job.company);
              const isExpanded = expandedJobIndex === i;
              return (
                <div key={i} className="card overflow-hidden hover:border-teal/30 transition-all">
                  <div 
                    className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer"
                    onClick={() => setExpandedJobIndex(isExpanded ? null : i)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal bg-teal/10 px-2 py-0.5 rounded">
                          {job.category}
                        </span>
                        {job.datePosted && (
                          <span className="text-[10px] opacity-50 flex items-center gap-1">
                            <Calendar size={10} /> {job.datePosted}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-deep-blue">{job.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-70 mt-1">
                        <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="text-gray-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-bold ${isSaved ? 'bg-coral border-coral text-white' : 'border-gray-200 text-gray-400 hover:border-coral hover:text-coral'}`}
                        title={isSaved ? "Remove from Plan" : "Save to My Plan"}
                      >
                        <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                        <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save to Plan'}</span>
                      </button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t bg-gray-50/50"
                      >
                        <div className="p-6 space-y-4">
                          <div>
                            <h4 className="text-sm font-bold uppercase opacity-50 mb-1">Description</h4>
                            <p className="text-gray-700">{job.description || t.noDescription}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold uppercase opacity-50 mb-1">Requirements</h4>
                            <p className="text-gray-700">{job.requirements || t.noRequirements}</p>
                          </div>
                          <div className="pt-2">
                            {job.link ? (
                              <a 
                                href={job.link} 
                                target="_blank" 
                                className="inline-flex items-center gap-2 bg-deep-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90"
                              >
                                {t.applyNow} <ExternalLink size={18} />
                              </a>
                            ) : (
                              <div className="text-sm text-coral font-bold bg-coral/10 px-4 py-2 rounded-lg inline-block">
                                {t.noAppLink}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="card p-12 text-center opacity-50">
              <p>{t.noJobsMatch}</p>
            </div>
          )
        ) : (
          <div className="card p-12 text-center opacity-50">
            <p>{t.clickRefreshJobs}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TransitPanel({ surveyData }: { surveyData: SurveyData }) {
  const t = translations[surveyData.language as keyof typeof translations] || translations.English;
  const homeAddress = `${surveyData.street}, ${surveyData.city}, FL ${surveyData.zip}`.trim().replace(/^, , FL $/, '');
  const [from, setFrom] = useState(homeAddress || '');
  const [to, setTo] = useState(() => localStorage.getItem('miacompass_transit_to') || '');
  const [routes, setRoutes] = useState<any[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  useEffect(() => {
    localStorage.setItem('miacompass_transit_to', to);
  }, [to]);

  const fetchRoutes = async () => {
    if (!to) return alert(t.enterDestination);
    setLoadingRoutes(true);
    try {
      const response = await fetch(`/api/directions?origin=${encodeURIComponent(from || 'Miami, FL')}&destination=${encodeURIComponent(to)}`);
      const data = await response.json();
      if (data.status === 'OK') {
        setRoutes(data.routes);
      } else {
        setRoutes([]);
        if (data.status === 'ZERO_RESULTS') {
          alert(t.noRoutesFound);
        } else {
          console.error("Directions API error:", data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch routes", error);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const openGoogleMaps = () => {
    if (!to) return alert(t.enterDestination);
    const f = encodeURIComponent(from || 'Current Location');
    const destination = encodeURIComponent(to);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${f}&destination=${destination}&travelmode=transit`, '_blank');
  };

  return (
    <div className="space-y-6" role="tabpanel" id="transit-panel" aria-labelledby="transit-tab">
      <h2 className="text-3xl">{t.transit}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 h-fit">
          <h3 className="text-xl mb-4 flex items-center gap-2"><MapPin className="text-coral" /> {t.tripPlanner}</h3>
          <div className="space-y-4">
            <Input 
              label={t.from} 
              value={from} 
              onChange={setFrom} 
              placeholder="Current Location" 
              action={
                homeAddress && from !== homeAddress ? (
                  <button 
                    onClick={() => setFrom(homeAddress)}
                    className="text-[10px] font-bold text-teal hover:underline uppercase tracking-wider"
                  >
                    {t.useHome}
                  </button>
                ) : null
              }
            />
            <Input label={t.to} value={to} onChange={setTo} placeholder="Destination Address" />
            <div className="flex gap-2">
              <button 
                onClick={fetchRoutes} 
                disabled={loadingRoutes}
                className="flex-1 bg-teal text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loadingRoutes ? <RefreshCw className="animate-spin" /> : <Navigation />} {t.getRoutes}
              </button>
              <button onClick={openGoogleMaps} className="p-4 border rounded-xl hover:bg-gray-50 transition-all" title={t.openMaps}>
                <ExternalLink />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {loadingRoutes ? (
            <div className="card p-12 flex flex-col items-center justify-center text-center space-y-4">
              <RefreshCw className="animate-spin text-teal" size={32} />
              <p className="font-bold text-gray-500">{t.loadingRoutes}</p>
            </div>
          ) : routes.length > 0 ? (
            <div className="space-y-4">
              {routes.map((route, idx) => {
                const leg = route.legs[0];
                const fare = leg.fare ? leg.fare.text : '$2.25 (Est.)';
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="card p-4 hover:border-teal transition-all cursor-pointer group"
                    onClick={() => openGoogleMaps()}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-teal/10 rounded-lg text-teal">
                          <Bus size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">Route {idx + 1}</div>
                          <div className="text-xs text-gray-400">{leg.steps.length} steps</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-teal">{leg.duration.text}</div>
                        <div className="text-xs text-gray-400">{leg.distance.text}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        <span>{leg.arrival_time?.text || 'Arrives soon'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-gray-400" />
                        <span>{fare}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between group-hover:text-teal transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-widest">View Details</span>
                      <ChevronRight size={14} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl border">
                <h3 className="font-bold mb-2">Miami-Dade Transit (MDT)</h3>
                <p className="text-sm opacity-80 mb-4">Standard fare is $2.25. Free for seniors 65+ with Golden Passport.</p>
                <div className="flex gap-2">
                  <a href="https://www.miamidade.gov/transit" target="_blank" className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full">Schedules</a>
                  <a href="https://www.miamidade.gov/global/service.page?Mduid_service=ser1482434190823521" target="_blank" className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full">Reduced Fares</a>
                </div>
              </div>
              <div className="bg-teal/10 p-6 rounded-2xl border border-teal/20">
                <h3 className="font-bold text-teal mb-2">Medicaid Transportation</h3>
                <p className="text-sm text-teal opacity-80">Free rides to medical appointments for Medicaid members.</p>
                <div className="mt-2 font-bold text-teal">Call: 1-855-832-6740</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatPanel({ surveyData }: { surveyData: SurveyData }) {
  const t = translations[surveyData.language as keyof typeof translations] || translations.English;
  const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string}[]>([
    { role: 'agent', text: surveyData.language === 'Spanish' ? "¡Hola! Soy tu asistente MIACompa. Recuerdo tu perfil y plan de recursos. ¿Cómo puedo ayudarte hoy?" : "Hello! I'm your MIACompa assistant. I remember your profile and resource plan. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      
      const response = await runMIACompassAgent('chat', { message: userMsg }, history);
      setMessages(prev => [...prev, { role: 'agent', text: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] md:h-[600px]" role="tabpanel" id="chat-panel" aria-labelledby="chat-tab">
      <h2 className="text-3xl mb-6">{t.askMIACompa}</h2>
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-white rounded-t-2xl border border-b-0"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === 'user' ? 'chat-user' : 'chat-agent'}`}>
            <ReactMarkdown>{m.text}</ReactMarkdown>
          </div>
        ))}
        {loading && <div className="chat-bubble chat-agent italic opacity-50" aria-busy="true">{t.thinking}</div>}
      </div>
      <div className="p-4 bg-white rounded-b-2xl border flex gap-2">
        <textarea 
          value={input || ''} 
          onChange={e => setInput(e.target.value)}
          placeholder={t.typeQuestion} 
          className="flex-1 p-3 border rounded-xl resize-none h-12"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          aria-label="Chat input"
        />
        <button onClick={handleSend} className="bg-deep-blue text-white p-3 rounded-xl" aria-label="Send message">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

function MyPlanPanel({ savedItems, setSavedItems, surveyData, setSurveyData, plan, setPlan, user, onStartNewSearch, searchHistory }: { 
  savedItems: any, 
  setSavedItems: any,
  surveyData: SurveyData,
  setSurveyData: (d: SurveyData) => void,
  plan: string | null,
  setPlan: (p: string | null) => void,
  user: User | null,
  onStartNewSearch: () => void,
  searchHistory: SearchHistoryItem[]
}) {
  const t = translations[surveyData.language as keyof typeof translations] || translations.English;
  const [subTab, setSubTab] = useState('steps');
  const [showAddNeeds, setShowAddNeeds] = useState(false);
  const [newNeeds, setNewNeeds] = useState<string[]>([]);
  const [isFinding, setIsFinding] = useState(false);

  const allNeeds = [
    { id: 'food', label: t.needFood, icon: Apple },
    { id: 'housing', label: t.needHousing, icon: Home },
    { id: 'health', label: t.needHealth, icon: Hospital },
    { id: 'jobs', label: t.needJobs, icon: Briefcase },
    { id: 'childcare', label: t.needChildcare, icon: Baby },
    { id: 'utilities', label: t.needUtilities, icon: Zap },
    { id: 'education', label: t.needEducation, icon: Book },
    { id: 'transportation', label: t.needTransportation, icon: Bus },
    { id: 'legal', label: t.needLegal, icon: Scale },
    { id: 'mental health', label: t.needMentalHealth, icon: Brain }
  ];

  const toggleNewNeed = (needId: string) => {
    if (surveyData.needs.includes(needId)) return;
    setNewNeeds(prev => prev.includes(needId) ? prev.filter(n => n !== needId) : [...prev, needId]);
  };

  const handleFindResources = async () => {
    if (newNeeds.length === 0) {
      alert(t.selectOneArea);
      return;
    }

    setIsFinding(true);
    try {
      const summary = `Language: ${surveyData.language}, Age: ${surveyData.age}, Family: ${surveyData.family_status}, Children: ${surveyData.children}, Zip: ${surveyData.zip}, Urgency: ${surveyData.urgency}`;
      const message = `The user needs additional resources for: ${newNeeds.join(', ')}. Their profile: ${summary}. Please find and list specific programs for ONLY these new categories: ${newNeeds.join(', ')}. Use the same format as the original plan with Federal, Florida, and Miami-Dade sections. Keep it focused — only cover the new categories requested.`;
      
      const response = await runMIACompassAgent('chat', { message });
      
      // Append to existing plan
      const updatedPlan = (plan || '') + "\n\n---\n\n### ADDITIONAL RESOURCES: " + newNeeds.join(', ').toUpperCase() + "\n\n" + response;
      setPlan(updatedPlan);

      // Extract new steps
      const stepsRegex = /(YOUR NEXT STEPS IN ORDER|SUS PRÓXIMOS PASOS EN ORDEN):?/i;
      const parts = response.split(stepsRegex);
      const stepsSection = parts.length >= 3 ? parts[2] : null;
      
      let addedStepsCount = 0;
      if (stepsSection) {
        const lines = stepsSection.split('\n')
          .map(l => l.trim())
          .filter(l => l.match(/^(\d+\.|-|\*)\s+/))
          .map(l => l.replace(/^(\d+\.|-|\*)\s+/, '').trim());
        
        if (lines.length > 0) {
          const updatedSteps = [...savedItems.steps];
          lines.forEach(step => {
            if (!updatedSteps.includes(step)) {
              updatedSteps.push(step);
              addedStepsCount++;
            }
          });
          setSavedItems({ ...savedItems, steps: updatedSteps });
        }
      }

      // Update surveyData needs
      const updatedNeeds = [...surveyData.needs, ...newNeeds];
      const updatedSurveyData = { ...surveyData, needs: updatedNeeds };
      setSurveyData(updatedSurveyData);
      localStorage.setItem('lastSurveyData', JSON.stringify(updatedSurveyData));

      // Save to Firestore
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { 
          currentPlan: updatedPlan,
          lastSurveyData: updatedSurveyData
        }, { merge: true });
      }

      alert(`${newNeeds.length} new resource areas added to your plan!`);
      setShowAddNeeds(false);
      setNewNeeds([]);
    } catch (error) {
      console.error("Failed to add needs", error);
      alert("Failed to find additional resources. Please try again.");
    } finally {
      setIsFinding(false);
    }
  };

  return (
    <div className="space-y-6" role="tabpanel" id="plan-panel" aria-labelledby="plan-tab">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl">{t.plan}</h2>
        <div className="flex gap-2">
          <button onClick={onStartNewSearch} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-coral text-coral font-bold hover:bg-coral/5 transition-all">
            <RefreshCw size={18} /> {t.newSearch}
          </button>
          <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
            <Printer size={20} /> {t.printPlan}
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b">
        <SubTabBtn id="steps" active={subTab} onClick={setSubTab} label={t.actionSteps} />
        <SubTabBtn id="programs" active={subTab} onClick={setSubTab} label={t.savedPrograms} />
        <SubTabBtn id="jobs" active={subTab} onClick={setSubTab} label={t.savedJobs} />
        <SubTabBtn id="history" active={subTab} onClick={setSubTab} label={t.searchHistory} />
      </div>

      <div className="min-h-[300px]">
        {subTab === 'history' && (
          <div className="space-y-4">
            {searchHistory && searchHistory.length > 0 ? (
              [...searchHistory].reverse().map((item) => (
                <div key={item.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar size={14} />
                        {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                      <h4 className="font-bold text-lg text-deep-blue">
                        {t.historyItemDesc} {item.surveyData.zip || item.surveyData.city}
                      </h4>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setPlan(item.plan);
                          setSurveyData(item.surveyData);
                          localStorage.setItem('miacompass_plan', item.plan);
                          localStorage.setItem('lastSurveyData', JSON.stringify(item.surveyData));
                          alert(t.restorePlan);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-teal/10 text-teal rounded-lg font-medium hover:bg-teal/20 transition-colors"
                        aria-label={`Restore plan from ${new Date(item.timestamp).toLocaleDateString()} at ${new Date(item.timestamp).toLocaleTimeString()}`}
                      >
                        <RotateCcw size={16} /> {t.viewPlan}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.surveyData.needs.map(need => (
                      <span key={need} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600 capitalize">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <History className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">{t.noHistory}</p>
              </div>
            )}
          </div>
        )}

        {subTab === 'steps' && (
          <div className="space-y-6">
            <div className="space-y-3">
              {savedItems.steps.length > 0 ? savedItems.steps.map((s: any, i: number) => (
                <div key={i} className={`flex items-center gap-3 p-4 bg-white rounded-xl border transition-all ${s.completed ? 'opacity-50 bg-gray-50' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={s.completed} 
                    onChange={() => {
                      const updatedSteps = [...savedItems.steps];
                      updatedSteps[i] = { ...s, completed: !s.completed };
                      setSavedItems({ ...savedItems, steps: updatedSteps });
                    }}
                    className="w-5 h-5 accent-teal cursor-pointer" 
                    aria-label={`Mark "${s.text}" as ${s.completed ? 'incomplete' : 'complete'}`}
                  />
                  <span className={`flex-1 ${s.completed ? 'line-through' : ''}`}>{s.text}</span>
                  <button 
                    onClick={() => setSavedItems({
                      ...savedItems,
                      steps: savedItems.steps.filter((_: any, index: number) => index !== i)
                    })}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                    aria-label={`Remove step: ${s.text}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )) : <div className="text-center py-12 opacity-50">{t.noSteps}</div>}
            </div>

            <hr className="opacity-10" />

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Need help with something else?</h3>
              
              {!showAddNeeds ? (
                <button 
                  onClick={() => setShowAddNeeds(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-teal text-teal font-bold hover:bg-teal/5 transition-all"
                >
                  <Plus size={20} /> {t.addSupport}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6 bg-teal/5 border-teal/20"
                >
                  <h4 className="text-xl font-bold mb-1">What else do you need support with?</h4>
                  <p className="text-sm opacity-70 mb-6">Select new areas — we'll find additional resources for you.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                    {allNeeds.map(need => {
                      const isAlreadySelected = surveyData.needs.includes(need.id);
                      const isSelected = newNeeds.includes(need.id);
                      return (
                        <label 
                          key={need.id} 
                          className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${isAlreadySelected ? 'opacity-40 bg-gray-100 cursor-not-allowed' : 'hover:bg-white'}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isAlreadySelected || isSelected} 
                            disabled={isAlreadySelected}
                            onChange={() => toggleNewNeed(need.id)}
                            className="w-5 h-5" 
                          />
                          <need.icon size={18} className="text-teal" />
                          <span className="text-sm">{need.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={handleFindResources}
                      disabled={isFinding}
                      className="w-full bg-deep-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {isFinding ? (
                        <>
                          <RefreshCw size={20} className="animate-spin" />
                          Finding resources for {newNeeds.join(', ')}...
                        </>
                      ) : (
                        <>{t.findResources} for Selected →</>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setShowAddNeeds(false);
                        setNewNeeds([]);
                      }}
                      className="w-full text-center text-sm font-bold opacity-60 hover:opacity-100 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
        {subTab === 'programs' && (
          <div className="grid md:grid-cols-2 gap-4">
            {savedItems.programs.length > 0 ? savedItems.programs.map((p: any, i: number) => (
              <div key={i} className="p-4 bg-white rounded-xl border flex justify-between items-start">
                <span>{p}</span>
                <button 
                  onClick={() => setSavedItems({
                    ...savedItems,
                    programs: savedItems.programs.filter((_: any, index: number) => index !== i)
                  })}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                  aria-label={`Remove program: ${p}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )) : <div className="col-span-2 text-center py-12 opacity-50">No programs saved yet.</div>}
          </div>
        )}
        {subTab === 'jobs' && (
          <div className="space-y-4">
            {savedItems.jobs.length > 0 ? savedItems.jobs.map((j: any, i: number) => (
              <div key={i} className="p-4 bg-white rounded-xl border flex justify-between items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-deep-blue">{j.title}</h4>
                  <div className="text-sm opacity-70">{j.company} • {j.location}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={j.link} target="_blank" className="p-2 text-teal hover:bg-teal/5 rounded-lg" aria-label={`View job details for ${j.title} at ${j.company}`}>
                    <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={() => setSavedItems({
                      ...savedItems,
                      jobs: savedItems.jobs.filter((job: any) => !(job.title === j.title && job.company === j.company))
                    })}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    aria-label={`Remove job: ${j.title} at ${j.company}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )) : <div className="text-center py-12 opacity-50">No jobs saved yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function SubTabBtn({ id, active, onClick, label }: { id: string, active: string, onClick: (id: string) => void, label: string }) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => onClick(id)} 
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-subpanel`}
      id={`${id}-subtab`}
      className={`pb-2 font-bold border-b-2 transition-all ${isActive ? 'text-coral border-coral' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
    >
      {label}
    </button>
  );
}

function FeedbackModal({ onClose, language, user }: { onClose: () => void, language: string, user: User | null }) {
  const t = translations[language as keyof typeof translations] || translations.English;
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      // Save feedback to Firestore
      const feedbackRef = collection(db, 'feedback');
      await addDoc(feedbackRef, {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        userName: user?.displayName || 'anonymous',
        feedback,
        timestamp: new Date().toISOString(),
        language
      });
      setIsSuccess(true);
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      console.error("Failed to submit feedback", error);
      alert(t.feedbackError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-deep-blue/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-deep-blue">{t.feedbackTitle}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <LogOut size={20} className="rotate-180" />
            </button>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-teal/10 text-teal rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <p className="font-bold text-deep-blue">{t.feedbackSuccess}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.feedbackTitle}</label>
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t.feedbackPlaceholder}
                  className="w-full h-40 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-teal focus:bg-white outline-none transition-all resize-none font-medium"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className="flex-1 py-4 bg-teal text-white rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="animate-spin" /> : <Send size={20} />}
                  {t.submitFeedback}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
