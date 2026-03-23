import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Tv, Play, Power, User, Activity, 
  Settings, Bell, Shield, Home, ChevronRight, 
  Wifi, CheckCircle2, AlertCircle, Maximize2,
  Volume2, VolumeX, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CircleDot
} from 'lucide-react';

// Simulated Logs
const INITIAL_LOGS = [
  { id: 1, time: '10:42 AM', message: 'Sistema armado.', type: 'info' },
  { id: 2, time: '08:15 AM', message: 'Movimiento detectado en la entrada.', type: 'alert' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAutomationActive, setIsAutomationActive] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [simulating, setSimulating] = useState(false);
  const [tvStatus, setTvStatus] = useState<'off' | 'turning_on' | 'netflix'>('off');

  const addLog = (message: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setLogs(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message,
      type
    }, ...prev]);
  };

  // Simulation logic when automation is toggled on
  const runSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    
    setTimeout(() => {
      addLog('Cámara Frontal: Rostro reconocido (Julio).', 'success');
      
      setTimeout(() => {
        addLog('Iniciando secuencia de bienvenida...', 'info');
        setTvStatus('turning_on');
        
        setTimeout(() => {
          addLog('TV Sala: Encendido exitosamente.', 'success');
          
          setTimeout(() => {
            setTvStatus('netflix');
            addLog('TV Sala: Ejecutando Macro (Abrir Netflix -> Perfil 1 -> Reanudar).', 'success');
            setSimulating(false);
          }, 2000);
        }, 1500);
      }, 1000);
    }, 2000);
  };

  const toggleAutomation = () => {
    const newState = !isAutomationActive;
    setIsAutomationActive(newState);
    if (newState) {
      addLog('Modo "Cine Automático" activado. Esperando detección...', 'info');
    } else {
      setTvStatus('off');
      addLog('Modo "Cine Automático" desactivado.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-white/[0.02] flex flex-col justify-between hidden md:flex z-20">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="ml-3 font-display font-semibold tracking-wide hidden lg:block">AURA</span>
          </div>
          
          <nav className="p-4 space-y-2">
            <NavItem icon={<Activity />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavItem icon={<Camera />} label="Cámaras" active={activeTab === 'cameras'} onClick={() => setActiveTab('cameras')} />
            <NavItem icon={<Tv />} label="Dispositivos" active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} />
            <NavItem icon={<Shield />} label="Seguridad" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          </nav>
        </div>
        
        <div className="p-4">
          <NavItem icon={<Settings />} label="Configuración" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <div className="mt-4 flex items-center justify-center lg:justify-start lg:px-4 py-3 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
              <User className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="ml-3 hidden lg:block">
              <p className="text-sm font-medium">Julio</p>
              <p className="text-xs text-neutral-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-display font-medium tracking-tight capitalize">
              {activeTab === 'dashboard' ? 'Bienvenido a casa' : activeTab}
            </h1>
            <p className="text-sm text-neutral-400">
              {activeTab === 'dashboard' ? 'Tu sistema está en línea y seguro.' : `Gestionando ${activeTab} del sistema.`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative">
              <Bell className="w-4 h-4 text-neutral-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  isAutomationActive={isAutomationActive}
                  toggleAutomation={toggleAutomation}
                  simulating={simulating}
                  runSimulation={runSimulation}
                  tvStatus={tvStatus}
                  logs={logs}
                />
              )}
              {activeTab === 'cameras' && <CamerasView />}
              {activeTab === 'devices' && <DevicesView tvStatus={tvStatus} setTvStatus={setTvStatus} addLog={addLog} />}
              {activeTab === 'security' && <SecurityView logs={logs} />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- VIEWS ---

function DashboardView({ isAutomationActive, toggleAutomation, simulating, runSimulation, tvStatus, logs }: any) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Left Column: Camera & Automation */}
      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
        
        {/* Camera Feed Card */}
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden relative group">
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium tracking-wider uppercase">Entrada Principal</span>
          </div>
          
          <div className="aspect-video bg-neutral-900 relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop" 
              alt="Front Door" 
              className="w-full h-full object-cover opacity-60"
            />
            
            <AnimatePresence>
              {simulating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10"
                >
                  <motion.div 
                    animate={{ y: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    className="w-full h-1 bg-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,1)]"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-indigo-500/50 rounded-lg flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
                    <span className="text-indigo-400 text-xs font-mono mt-56">ANALIZANDO...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Automation Control */}
        <div className="rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-6 lg:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 className="text-xl font-display font-medium mb-2 flex items-center">
                <Play className="w-5 h-5 mr-2 text-indigo-400" />
                Modo Cine Automático
              </h2>
              <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
                Al detectar tu rostro en la cámara principal, enciende el televisor de la sala, abre Netflix y ejecuta la macro para reanudar tu serie.
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-4">
              <button 
                onClick={toggleAutomation}
                className={`w-16 h-8 rounded-full p-1 transition-colors duration-300 relative ${isAutomationActive ? 'bg-indigo-500' : 'bg-neutral-700'}`}
              >
                <motion.div 
                  layout
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: isAutomationActive ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              
              {isAutomationActive && !simulating && (
                <button 
                  onClick={runSimulation}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center"
                >
                  Simular Detección <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
        </div>
      </div>

      {/* Right Column: Status & Logs */}
      <div className="space-y-6 lg:space-y-8">
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-6">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6">Estado del Sistema</h3>
          <div className="space-y-4">
            <DeviceItem icon={<Camera />} name="Cámara Entrada" status="En línea" active={true} />
            <DeviceItem 
              icon={<Tv />} 
              name="TV Sala" 
              status={tvStatus === 'off' ? 'Apagado' : tvStatus === 'turning_on' ? 'Encendiendo...' : 'Netflix Activo'} 
              active={tvStatus !== 'off'} 
              highlight={tvStatus === 'netflix'}
            />
            <DeviceItem icon={<Wifi />} name="Hub Central" status="Conectado" active={true} />
          </div>
        </div>

        <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-6 flex-1 flex flex-col h-[400px]">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6">Registro de Actividad</h3>
          <div className="space-y-4 overflow-y-auto pr-2 flex-1">
            <AnimatePresence initial={false}>
              {logs.map((log: any) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  className="flex items-start space-x-3"
                >
                  <div className="mt-1">
                    {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {log.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                    {log.type === 'info' && <div className="w-4 h-4 rounded-full border-2 border-neutral-600" />}
                  </div>
                  <div>
                    <p className="text-sm text-neutral-200">{log.message}</p>
                    <span className="text-xs text-neutral-500 font-mono">{log.time}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function CamerasView() {
  const [isAdding, setIsAdding] = useState(false);
  const [rtspUrl, setRtspUrl] = useState('rtsp://Julio334:2030Julio@192.168.80.86:554/stream1');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [showExplanation, setShowExplanation] = useState(false);

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      const response = await fetch('/api/camera/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rtspUrl })
      });
      if (response.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('idle');
      }
    } catch (error) {
      console.error('Error testing camera:', error);
      setTestStatus('idle');
    }
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Camera */}
        <div className="col-span-1 md:col-span-2 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden relative group">
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium tracking-wider uppercase">Entrada Principal (4K)</span>
          </div>
          
          {/* Explanation Button Overlay */}
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setShowExplanation(true)}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium shadow-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              ¿Por qué no veo mi cámara real?
            </button>
          </div>

          <button className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="aspect-video bg-neutral-900 relative">
            <img src="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop" alt="Front Door" className="w-full h-full object-cover opacity-80" />
            <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 rounded text-[10px] font-mono text-neutral-400">
              SIMULACIÓN VISUAL
            </div>
          </div>
        </div>
        
        {/* Secondary Cameras */}
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden relative">
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium tracking-wider uppercase">Patio Trasero</span>
          </div>
          <div className="aspect-video bg-neutral-900">
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop" alt="Backyard" className="w-full h-full object-cover opacity-60" />
          </div>
        </div>

        {/* Add Camera Button */}
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden relative flex items-center justify-center bg-neutral-900/50 aspect-video">
           <div className="text-center">
             <Camera className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
             <p className="text-sm text-neutral-500">Añadir nueva cámara</p>
             <button 
               onClick={() => setIsAdding(true)}
               className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors border border-white/10"
             >
               Configurar IP / RTSP
             </button>
           </div>
        </div>
      </div>

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-indigo-500/30 p-8 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(99,102,241,0.15)]"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-display font-medium mb-4">El Muro de Seguridad (IP Local)</h3>
              
              <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
                <p>
                  Tu cámara está en la dirección <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300">192.168.80.86</code>. 
                  Esa es una <strong>dirección IP Privada</strong> (solo existe dentro de tu casa, conectada a tu router).
                </p>
                <p>
                  Esta aplicación que estás viendo ahora mismo está alojada en un <strong>servidor en la nube de Google</strong> (en internet público).
                </p>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                  <p className="text-red-400 font-medium mb-1">El problema técnico:</p>
                  <p className="text-red-300/80">
                    Un servidor en internet no puede "entrar" mágicamente a tu casa para ver la cámara 192.168.80.86. Tu router bloquea esa conexión por seguridad (Firewall).
                  </p>
                </div>
                <p className="font-medium text-white pt-2">¿Cómo lo solucionamos en la vida real?</p>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li><strong>Opción 1 (La que haremos):</strong> Descargas el código de esta app y la corres en una computadora <em>dentro de tu casa</em> (en la misma red Wi-Fi). Ahí sí podrá ver la cámara.</li>
                  <li><strong>Opción 2 (Insegura):</strong> Abres puertos en tu router (Port Forwarding) para exponer tu cámara a todo internet. (No recomendado).</li>
                </ul>
              </div>

              <button 
                onClick={() => setShowExplanation(false)}
                className="mt-8 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Camera Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-display font-medium mb-2">Enlazar Cámara</h3>
              <p className="text-sm text-neutral-400 mb-6">Ingresa la ruta RTSP de tu cámara IP para conectarla al sistema.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Nombre de la Cámara</label>
                  <input type="text" placeholder="Ej. Garaje" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">URL RTSP</label>
                  <input 
                    type="text" 
                    value={rtspUrl}
                    onChange={(e) => setRtspUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono text-xs" 
                  />
                  <p className="text-[10px] text-neutral-500 mt-2">Formato: rtsp://[usuario]:[contraseña]@[ip]:[puerto]/[stream]</p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleTestConnection}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors text-sm flex items-center justify-center ${
                    testStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {testStatus === 'idle' && 'Probar Conexión'}
                  {testStatus === 'testing' && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {testStatus === 'success' && <><CheckCircle2 className="w-4 h-4 mr-2" /> Conectado</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DevicesView({ tvStatus, setTvStatus, addLog }: any) {
  const handleRemoteClick = async (btn: string) => {
    addLog(`Enviando comando a TV: ${btn}`, 'info');
    try {
      await fetch('/api/tv/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: '192.168.80.90', command: btn })
      });
      addLog(`Comando enviado a TV: ${btn}`, 'success');
    } catch (error) {
      addLog(`Error enviando comando a TV: ${btn}`, 'alert');
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* TV Control Panel */}
      <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-display font-medium">TV Sala (Samsung Tizen)</h2>
            <p className="text-sm text-neutral-400">Conectado vía WebSocket (Puerto 8002)</p>
          </div>
          <button 
            onClick={async () => {
              const newStatus = tvStatus === 'off' ? 'turning_on' : 'off';
              setTvStatus(newStatus);
              addLog(`TV Sala: ${newStatus === 'off' ? 'Apagando (KEY_POWER)' : 'Encendiendo (WOL / KEY_POWER)'}...`, 'info');
              
              try {
                await fetch('/api/tv/command', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ip: '192.168.80.90', command: 'KEY_POWER' })
                });
                if(newStatus === 'turning_on') setTimeout(() => setTvStatus('netflix'), 1500);
              } catch (error) {
                addLog('Error al conectar con la TV', 'alert');
              }
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${tvStatus !== 'off' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/5 text-neutral-400 hover:bg-white/10'}`}
          >
            <Power className="w-5 h-5" />
          </button>
        </div>

        {/* Virtual Remote */}
        <div className="bg-black/40 rounded-3xl p-6 border border-white/5 max-w-xs mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button onClick={() => handleRemoteClick('KEY_VOLDOWN')} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center"><VolumeX className="w-5 h-5" /></button>
            <button onClick={() => handleRemoteClick('KEY_MUTE')} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-medium">MUTE</button>
            <button onClick={() => handleRemoteClick('KEY_VOLUP')} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center"><Volume2 className="w-5 h-5" /></button>
          </div>

          <div className="relative w-48 h-48 mx-auto bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-8">
            <button onClick={() => handleRemoteClick('KEY_UP')} className="absolute top-2 left-1/2 -translate-x-1/2 p-3 hover:bg-white/10 rounded-full"><ArrowUp className="w-5 h-5" /></button>
            <button onClick={() => handleRemoteClick('KEY_DOWN')} className="absolute bottom-2 left-1/2 -translate-x-1/2 p-3 hover:bg-white/10 rounded-full"><ArrowDown className="w-5 h-5" /></button>
            <button onClick={() => handleRemoteClick('KEY_LEFT')} className="absolute left-2 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
            <button onClick={() => handleRemoteClick('KEY_RIGHT')} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 rounded-full"><ArrowRight className="w-5 h-5" /></button>
            <button onClick={() => handleRemoteClick('KEY_ENTER')} className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-white/10 transition-colors">
              <CircleDot className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleRemoteClick('Launch Netflix')} className="py-3 rounded-xl bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20 hover:bg-[#E50914]/20 font-medium text-sm transition-colors">NETFLIX</button>
            <button onClick={() => handleRemoteClick('KEY_HOME')} className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium text-sm transition-colors">HOME</button>
          </div>
        </div>
      </div>

      {/* Macro Builder (The Netflix Solution) */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-indigo-500/20 p-8">
        <h2 className="text-xl font-display font-medium mb-2">Constructor de Macros (Samsung)</h2>
        <p className="text-sm text-neutral-400 mb-8">Define la secuencia exacta de botones que la app enviará al TV para saltarse las limitaciones de Netflix en Tizen OS.</p>
        
        <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[15px] before:w-[2px] before:bg-indigo-500/20">
          <MacroStep num={1} text="Wake On LAN / KEY_POWER" delay="0s" />
          <MacroStep num={2} text="Esperar inicio de Tizen OS" delay="6s" />
          <MacroStep num={3} text="Abrir App: Netflix (App ID: 11101200001)" delay="2s" />
          <MacroStep num={4} text="Esperar carga de Netflix" delay="8s" />
          <MacroStep num={5} text="KEY_ENTER (Seleccionar Perfil)" delay="3s" />
          <MacroStep num={6} text="KEY_DOWN (Ir a 'Continuar viendo')" delay="1s" />
          <MacroStep num={7} text="KEY_ENTER (Reproducir)" delay="0.5s" />
        </div>

        <button className="mt-8 w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          Guardar Macro como "Cine Automático"
        </button>
      </div>
    </div>
  );
}

function MacroStep({ num, text, delay }: { num: number, text: string, delay: string }) {
  return (
    <div className="flex items-center relative z-10">
      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
        {num}
      </div>
      <div className="ml-4 flex-1 bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
        <span className="text-sm font-mono">{text}</span>
        <span className="text-xs text-neutral-500 bg-black/50 px-2 py-1 rounded-md">Espera: {delay}</span>
      </div>
    </div>
  );
}

function SecurityView({ logs }: any) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8">
        <h2 className="text-xl font-display font-medium mb-6">Base de Datos Facial</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="w-16 h-16 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="font-medium">Julio</p>
            <p className="text-xs text-neutral-400">Admin • 15 fotos</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-neutral-500 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center mb-2">
              <span className="text-2xl">+</span>
            </div>
            <p className="text-sm font-medium">Añadir Persona</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8">
         <h2 className="text-xl font-display font-medium mb-6">Alarma Perimetral</h2>
         <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
           <div className="flex items-center">
             <Shield className="w-6 h-6 text-red-400 mr-3" />
             <div>
               <p className="font-medium text-red-400">Sistema Armado</p>
               <p className="text-xs text-red-400/70">Sensores de movimiento activos</p>
             </div>
           </div>
           <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
             Desarmar
           </button>
         </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const [tvIp, setTvIp] = useState('192.168.80.90'); // Assuming similar subnet to camera
  const [pairingState, setPairingState] = useState<'idle' | 'connecting' | 'pin_required' | 'connected'>('idle');
  const [pin, setPin] = useState('');

  const handleConnectTv = () => {
    setPairingState('connecting');
    // Simulate finding the TV and asking for permission (Samsung usually asks for Allow on screen, not PIN, but older models use PIN)
    setTimeout(() => {
      setPairingState('pin_required');
    }, 2000);
  };

  const handleSubmitPin = () => {
    setPairingState('connecting');
    // Simulate successful pairing
    setTimeout(() => {
      setPairingState('connected');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-8">
        <h2 className="text-xl font-display font-medium mb-6">Conexiones de Red (Backend Propio)</h2>
        <p className="text-sm text-neutral-400 mb-6">
          Nuestra aplicación se conecta directamente a tus dispositivos en la red local mediante sus APIs nativas. No dependemos de software de terceros.
        </p>
        
        <div className="space-y-8">
          {/* Camera Settings */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center mb-4">
              <Camera className="w-5 h-5 text-indigo-400 mr-3" />
              <h3 className="font-medium">Cámara Principal</h3>
            </div>
            <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Ruta RTSP Guardada</label>
            <div className="flex gap-2">
              <input type="text" readOnly value="rtsp://Julio334:2030Julio@192.168.80.86:554/stream1" className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-neutral-300 font-mono outline-none" />
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">Editar</button>
            </div>
          </div>
          
          {/* TV Settings */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
            <div className="flex items-center mb-4">
              <Tv className="w-5 h-5 text-indigo-400 mr-3" />
              <h3 className="font-medium">Televisor Inteligente (Samsung Tizen)</h3>
            </div>
            
            <AnimatePresence mode="wait">
              {pairingState === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">IP Local del Televisor</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={tvIp}
                      onChange={(e) => setTvIp(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 font-mono" 
                    />
                    <button onClick={handleConnectTv} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                      Vincular TV
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-2">Puerto de conexión por defecto: 8002 (WSS)</p>
                </motion.div>
              )}

              {pairingState === 'connecting' && (
                <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-4">
                  <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                  <p className="text-sm text-neutral-400">Estableciendo conexión WebSocket con {tvIp}:8002...</p>
                </motion.div>
              )}

              {pairingState === 'pin_required' && (
                <motion.div key="pin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 text-center">
                  <Shield className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                  <h4 className="font-medium mb-2">Revisa la pantalla de tu Samsung TV</h4>
                  <p className="text-sm text-neutral-400 mb-6">Tu televisor debería estar mostrando un mensaje pidiendo permiso para que "AURA" se conecte, o un PIN de seguridad.</p>
                  
                  <div className="flex max-w-xs mx-auto gap-2">
                    <input 
                      type="text" 
                      placeholder="PIN (si lo pide)" 
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-center tracking-widest font-mono focus:outline-none focus:border-indigo-500" 
                    />
                    <button onClick={handleSubmitPin} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-colors">
                      Confirmar
                    </button>
                  </div>
                </motion.div>
              )}

              {pairingState === 'connected' && (
                <motion.div key="connected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-400">Samsung TV Vinculado Exitosamente</p>
                    <p className="text-xs text-emerald-400/70">Token de WebSocket guardado. Control total habilitado.</p>
                  </div>
                  <button onClick={() => setPairingState('idle')} className="ml-auto text-xs text-neutral-400 hover:text-white underline">Desvincular</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <span className="ml-3 font-medium hidden lg:block text-left">{label}</span>
    </button>
  );
}

function DeviceItem({ icon, name, status, active, highlight = false }: { icon: React.ReactNode, name: string, status: string, active: boolean, highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${highlight ? 'bg-[#E50914]/20 text-[#E50914]' : active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-neutral-800 text-neutral-500'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-neutral-500">{status}</p>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full ${highlight ? 'bg-[#E50914] shadow-[0_0_8px_rgba(229,9,20,0.8)]' : active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-neutral-600'}`} />
    </div>
  );
}

