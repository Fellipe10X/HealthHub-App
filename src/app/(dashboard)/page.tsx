"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import React, { useState, useRef, useEffect } from 'react';

// --- TIPOS ---
type Screen = 'login' | 'home' | 'summary' | 'exams' | 'medications' | 'allergies' | 'surgeries' | 'addMedication' | 'addAllergy' | 'addSurgery';
type NavigationProps = {
    navigateTo: (screen: Screen) => void;
};
type ScreenProps = NavigationProps & {
    setNotification: (message: string) => void;
};


// --- ÍCONES COMO COMPONENTES ---
const PlusIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5v14"/><path d="M5 12h14"/></svg>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.153,44,30.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
);

const MedicalDocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18h-1v-5h2v1"/><path d="M12 12h.01"/></svg>
);

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
);

const AiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.5-.1-.96-.6-.96-1.12V1.25a.25.25 0 0 1 .25-.25Z"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="M18 18a1.5 1.5 0 0 0-1.06-.44H16c-.55 0-1-.45-1-1v-1c0-1.1.9-2 2-2h.09a1.91 1.91 0 0 1 1.87 2.22c-.1.82-.74 1.46-1.56 1.56A1.5 1.5 0 0 0 18 18Z"/></svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><polyline points="15 18 9 12 15 6"></polyline></svg>
);

const ForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const ExamsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);

const MedicationsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.2 11.6c.1.4.2.8.2 1.2a8 8 0 1 1-16 0c0-.4.1-.8.2-1.2"/><path d="M12 2v4"/><path d="m4.9 4.9 2.8 2.8"/><path d="M2 12h4"/><path d="m4.9 19.1 2.8-2.8"/><path d="M12 22v-4"/><path d="m19.1 19.1-2.8-2.8"/><path d="M22 12h-4"/><path d="m19.1 4.9-2.8 2.8"/></svg>
);

const AllergiesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

const SurgeriesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

const TomographyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" y2="21"></line><line x1="15" y1="3" y2="21"></line><line x1="3" y1="9" y2="21"></line><line x1="3" y1="15" y2="21"></line></svg>
);

const UrineTestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-4"/><path d="M12 11v-1"/></svg>
);

const XRayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><path d="m18 17-5-5-5 5"/><path d="m6 7 5 5 5-5"/></svg>
);

// Comentei essa parte do login pois a autenticação agora é feita pelo Clerk, entao nao precisamos mais dessa parte e quando o usuario e logado ele vai direto pra HomeScreen, alterei isso la no switch case tambem


// // --- TELA DE LOGIN ---
// const LoginScreen: React.FC<NavigationProps> = ({ navigateTo }) => {
//     return (
//         <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-8">
//             <div className="w-full max-w-sm">
//                 <div className="flex items-center justify-center mb-10">
//                     <PlusIcon className="w-8 h-8 text-teal-400" />
//                     <h1 className="text-3xl font-bold ml-2">HealthHub</h1>
//                 </div>

//                 <div className="bg-slate-800 p-8 rounded-2xl shadow-lg">
//                     <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
//                     <form onSubmit={(e) => { e.preventDefault(); navigateTo('home'); }}>
//                         <div className="mb-4">
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
//                             <input type="email" id="email" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="seuemail@exemplo.com" defaultValue="ana.silva@email.com" required />
//                         </div>
//                         <div className="mb-6">
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
//                             <input type="password" id="password" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" defaultValue="********" required />
//                             <a href="#" className="text-xs text-teal-400 hover:underline mt-2 block text-right">Esqueceu a senha?</a>
//                         </div>
//                         <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
//                             Entrar
//                         </button>
//                     </form>

//                     <div className="my-6 flex items-center">
//                         <hr className="w-full border-slate-600" />
//                         <span className="px-2 text-xs text-slate-400">ou</span>
//                         <hr className="w-full border-slate-600" />
//                     </div>

//                     <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-300" onClick={() => navigateTo('home')}>
//                         <GoogleIcon />
//                         Entrar com Google
//                     </button>
//                 </div>

//                  <p className="text-center text-sm text-slate-400 mt-8">
//                     Não tem uma conta? <a href="#" className="font-semibold text-teal-400 hover:underline">Cadastre-se</a>
//                 </p>
//             </div>
//         </div>
//     );
// };

// --- TELA HOME ---
// adicionei a const de user para puxar o usuario logado pelo Clerk, conseguindo assim puxar seu nome e exibir na tela juntamente com o icone de perfil (UserButton)
const HomeScreen: React.FC<ScreenProps> = ({ navigateTo }) => {
    const { user, isLoaded } = useUser();
    return (
        <div className="bg-gradient-to-b from-teal-50 via-cyan-50 to-white min-h-screen p-6">
            <header className="flex justify-between items-center mb-8">
                 <div className="flex items-center">
                    <PlusIcon className="w-6 h-6 text-teal-500"/>
                    <h1 className="text-xl font-bold text-slate-800 ml-1">HealthHub</h1>
                </div>
                <UserButton />
            </header>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                    Olá {isLoaded && user ? user.firstName : 'Usuário'}!
                </h2>
                <p className="text-slate-500">Bem-vinda de volta.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
                <p className="text-sm font-medium text-slate-500 mb-4">Último exame médico</p>
                <div className="flex items-center mb-6">
                    <div className="bg-teal-100 text-teal-600 p-3 rounded-lg mr-4">
                        <MedicalDocumentIcon />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">Exame de Sangue</p>
                        <p className="text-sm text-slate-500">20 de Março, 2024</p>
                    </div>
                </div>
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300" onClick={() => navigateTo('exams')}>
                    Carregar Novo Exame
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="bg-white p-4 rounded-2xl shadow-md text-left hover:bg-gray-50 transition" onClick={() => navigateTo('summary')}>
                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg inline-block mb-3">
                       <FolderIcon />
                    </div>
                    <p className="font-semibold text-slate-800">Histórico Médico</p>
                </button>
                 <button className="bg-white p-4 rounded-2xl shadow-md text-left hover:bg-gray-50 transition">
                    <div className="bg-rose-100 text-rose-600 p-2 rounded-lg inline-block mb-3">
                       <AiIcon />
                    </div>
                    <p className="font-semibold text-slate-800">Análise de Sintomas (IA)</p>
                </button>
                 <button className="bg-white p-4 rounded-2xl shadow-md text-left hover:bg-gray-50 transition">
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-lg inline-block mb-3">
                       <ShareIcon />
                    </div>
                    <p className="font-semibold text-slate-800">Compartilhar com Médico</p>
                </button>
                <button className="bg-white p-4 rounded-2xl shadow-md text-left hover:bg-gray-50 transition" onClick={() => navigateTo('login')}>
                    <div className="bg-slate-100 text-slate-600 p-2 rounded-lg inline-block mb-3">
                       <LogoutIcon />
                    </div>
                    <p className="font-semibold text-slate-800">Sair</p>
                </button>
            </div>
        </div>
    );
};

// --- TELA DE RESUMO DE SAÚDE ---
const SummaryScreen: React.FC<ScreenProps> = ({ navigateTo }) => {
    return (
        <div className="bg-gradient-to-b from-teal-100 to-cyan-100 min-h-screen p-6">
            <header className="flex items-center mb-8 relative">
                <button onClick={() => navigateTo('home')} className="absolute left-0">
                   <BackIcon />
                </button>
                <h1 className="text-3xl font-bold text-slate-800 text-center w-full">Resumo de Saúde</h1>
            </header>

            <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-white transition" onClick={() => navigateTo('exams')}>
                    <div className="flex items-center">
                        <div className="bg-teal-100 text-teal-600 p-3 rounded-lg mr-4">
                           <ExamsIcon />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-lg">Exames</p>
                            <p className="text-sm text-slate-500">Exame de Sangue - 20/03/24</p>
                        </div>
                    </div>
                    <ForwardIcon />
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-white transition" onClick={() => navigateTo('medications')}>
                    <div className="flex items-center">
                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4">
                            <MedicationsIcon />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-lg">Medicamentos</p>
                            <p className="text-sm text-slate-500">Lisinopril 10 mg</p>
                        </div>
                    </div>
                    <ForwardIcon />
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-white transition" onClick={() => navigateTo('allergies')}>
                    <div className="flex items-center">
                        <div className="bg-rose-100 text-rose-600 p-3 rounded-lg mr-4">
                           <AllergiesIcon />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-lg">Alergias</p>
                            <p className="text-sm text-slate-500">Nenhuma alergia conhecida</p>
                        </div>
                    </div>
                    <ForwardIcon />
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-white transition" onClick={() => navigateTo('surgeries')}>
                    <div className="flex items-center">
                        <div className="bg-sky-100 text-sky-600 p-3 rounded-lg mr-4">
                            <SurgeriesIcon />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-lg">Cirurgias</p>
                            <p className="text-sm text-slate-500">Apendicectomia - 2018</p>
                        </div>
                    </div>
                    <ForwardIcon />
                </div>
            </div>
        </div>
    );
};

// --- TELA DE EXAMES ---
const ExamsScreen: React.FC<ScreenProps> = ({ navigateTo, setNotification }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Arquivo selecionado:", file.name);
            setNotification(`Arquivo "${file.name}" selecionado!`);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-gradient-to-b from-teal-50 to-white min-h-screen">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <div className="p-6">
                <header className="flex items-center mb-8 relative">
                    <button onClick={() => navigateTo('summary')} className="absolute left-0">
                       <BackIcon />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 text-center w-full">Exames</h1>
                </header>
                
                <div className="space-y-4 pb-24">
                    <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex items-center">
                            <div className="bg-teal-100 text-teal-600 p-3 rounded-lg mr-4">
                                <MedicalDocumentIcon />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Exame de Sangue</p>
                                <p className="text-sm text-slate-500">20 de Março, 2024</p>
                            </div>
                        </div>
                        <ForwardIcon />
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex items-center">
                            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4">
                               <TomographyIcon />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Tomografia</p>
                                <p className="text-sm text-slate-500">5 de Fevereiro, 2024</p>
                            </div>
                        </div>
                        <ForwardIcon />
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex items-center">
                            <div className="bg-amber-100 text-amber-600 p-3 rounded-lg mr-4">
                                <UrineTestIcon />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Exame de Urina</p>
                                <p className="text-sm text-slate-500">12 de Janeiro, 2024</p>
                            </div>
                        </div>
                        <ForwardIcon />
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex items-center">
                            <div className="bg-rose-100 text-rose-600 p-3 rounded-lg mr-4">
                               <XRayIcon />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Raio-X</p>
                                <p className="text-sm text-slate-500">30 de Outubro, 2023</p>
                            </div>
                        </div>
                        <ForwardIcon />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/80">
                 <button onClick={handleUploadClick} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-teal-500/30 transition duration-300">
                    + Carregar Novo Exame
                </button>
            </div>
        </div>
    );
};

// --- TELA DE MEDICAMENTOS ---
const MedicationsScreen: React.FC<ScreenProps> = ({ navigateTo }) => {
    return (
        <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
            <div className="p-6">
                <header className="flex items-center mb-8 relative">
                    <button onClick={() => navigateTo('summary')} className="absolute left-0">
                       <BackIcon />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 text-center w-full">Medicamentos</h1>
                </header>
                
                <div className="space-y-4 pb-24">
                    <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex items-center">
                            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4">
                                <MedicationsIcon />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Lisinopril</p>
                                <p className="text-sm text-slate-500">10 mg, uma vez ao dia</p>
                            </div>
                        </div>
                        <ForwardIcon />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/80">
                 <button onClick={() => navigateTo('addMedication')} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition duration-300">
                    + Adicionar Medicamento
                </button>
            </div>
        </div>
    );
};


// --- TELA DE ADICIONAR MEDICAMENTO ---
const AddMedicationScreen: React.FC<ScreenProps> = ({ navigateTo, setNotification }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setNotification("Medicamento salvo com sucesso!");
        navigateTo('medications');
    };

    return (
        <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
            <div className="p-6">
                <header className="flex items-center mb-8 relative">
                    <button onClick={() => navigateTo('medications')} className="absolute left-0">
                        <BackIcon />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 text-center w-full">Novo Medicamento</h1>
                </header>
                
                <form onSubmit={handleSubmit} className="space-y-6 pb-24">
                    <div>
                        <label htmlFor="medName" className="block text-sm font-medium text-slate-700 mb-1">Nome do Medicamento</label>
                        <input type="text" id="medName" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ex: Paracetamol" required />
                    </div>
                     <div>
                        <label htmlFor="medDosage" className="block text-sm font-medium text-slate-700 mb-1">Dosagem</label>
                        <input type="text" id="medDosage" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ex: 750mg" />
                    </div>
                    <div>
                        <label htmlFor="medFrequency" className="block text-sm font-medium text-slate-700 mb-1">Frequência</label>
                        <input type="text" id="medFrequency" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ex: A cada 8 horas" />
                    </div>
                     <div>
                        <label htmlFor="medNotes" className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                        <textarea id="medNotes" rows={3} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ex: Tomar se houver dor ou febre."></textarea>
                    </div>
                </form>
            </div>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/80">
                 <button onClick={handleSubmit} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition duration-300">
                    Salvar Medicamento
                </button>
            </div>
        </div>
    );
};


// --- TELA DE ALERGIAS ---
const AllergiesScreen: React.FC<ScreenProps> = ({ navigateTo }) => {
    return (
        <div className="bg-gradient-to-b from-rose-50 to-white min-h-screen">
            <div className="p-6">
                <header className="flex items-center mb-8 relative">
                    <button onClick={() => navigateTo('summary')} className="absolute left-0">
                       <BackIcon />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 text-center w-full">Alergias</h1>
                </header>
                
                <div className="space-y-4 pb-24">
                     <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                        <p className="text-slate-600">Nenhuma alergia conhecida registrada.</p>
                        <p className="text-sm text-slate-400 mt-1">Adicione alergias para manter seu histórico completo.</p>
                     </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/80">
                 <button onClick={() => navigateTo('addAllergy')} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/30 transition duration-300">
                    + Adicionar Alergia
                </button>
            </div>
        </div>
    );
};

// --- TELA DE ADICIONAR ALERGIA ---
const AddAllergyScreen: React.FC<ScreenProps> = ({ navigateTo, setNotification }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setNotification("Alergia salva com sucesso!");
        navigateTo('allergies');
    };

    return (
        <div className="bg-gradient-to-b from-rose-50 to-white min-h-screen">
            <div className="p-6">
                <header className="flex items-center mb-8 relative">
                    <button onClick={() => navigateTo('allergies')} className="absolute left-0">
                        <BackIcon />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 text-center w-full">Nova Alergia</h1>
                </header>
                
                <form onSubmit={handleSubmit} className="space-y-6 pb-24">
                    <div>
                        <label htmlFor="allergyName" className="block text-sm font-medium text-slate-700 mb-1">Nome da Alergia</label>
                        <input type="text" id="allergyName" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500" placeholder="Ex: Penicilina, Camarão" required />
                    </div>
                     <div>
                        <label htmlFor="allergySeverity" className="block text-sm font-medium text-slate-700 mb-1">Gravidade</label>
                        <select id="allergySeverity" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500">
                            <option>Leve</option>
                            <option>Moderada</option>
                            <option>Grave</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="allergySymptoms" className="block text-sm font-medium text-slate-700 mb-1">Sintomas / Reações</label>
                        <textarea id="allergySymptoms" rows={3} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500" placeholder="Ex: Urticária, inchaço, dificuldade para respirar."></textarea>
                    </div>
                </form>
            </div>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/80">
                 <button onClick={handleSubmit} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/30 transition duration-300">
                    Salvar Alergia
                </button>
            </div>
        </div>
    );
};


// --- TELA DE CIRURGIAS ---
const SurgeriesScreen: React.FC<ScreenProps> = ({ navigateTo }) => {
    return (
        <div className="bg-gradient-to-b from-sky-50 to-white min-h-screen">
            <div className="p-6">
                <header className="flex items-center mb-8 relative">
                    <button onClick={() => navigateTo('summary')} className="absolute left-0">
                       <BackIcon />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 text-center w-full">Cirurgias</h1>
                </header>
                
                <div className="space-y-4 pb-24">
                     <div className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition">
                        <div className="flex items-center">
                            <div className="bg-sky-100 text-sky-600 p-3 rounded-lg mr-4">
                                <SurgeriesIcon />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">Apendicectomia</p>
                                <p className="text-sm text-slate-500">15 de Junho, 2018</p>
                            </div>
                        </div>
                        <ForwardIcon />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/80">
                 <button onClick={() => navigateTo('addSurgery')} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-sky-500/30 transition duration-300">
                    + Adicionar Cirurgia
                </button>
            </div>
        </div>
    );
};


// --- TELA DE ADICIONAR CIRURGIA ---
const AddSurgeryScreen: React.FC<ScreenProps> = ({ navigateTo, setNotification }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setNotification("Cirurgia salva com sucesso!");
        navigateTo('surgeries');
    };

    return (
        <div className="bg-gradient-to-b from-sky-50 to-white min-h-screen">
            <div className="p-6">
                <header className="flex items-center mb-8 relative">
                    <button onClick={() => navigateTo('surgeries')} className="absolute left-0">
                        <BackIcon />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 text-center w-full">Nova Cirurgia</h1>
                </header>
                
                <form onSubmit={handleSubmit} className="space-y-6 pb-24">
                    <div>
                        <label htmlFor="surgeryName" className="block text-sm font-medium text-slate-700 mb-1">Nome do Procedimento</label>
                        <input type="text" id="surgeryName" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500" placeholder="Ex: Apendicectomia" required />
                    </div>
                     <div>
                        <label htmlFor="surgeryDate" className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                        <input type="date" id="surgeryDate" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div>
                        <label htmlFor="surgeryTime" className="block text-sm font-medium text-slate-700 mb-1">Horário</label>
                        <input type="time" id="surgeryTime" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                     <div>
                        <label htmlFor="surgeryDoctor" className="block text-sm font-medium text-slate-700 mb-1">Médico / Hospital</label>
                        <input type="text" id="surgeryDoctor" className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500" placeholder="Ex: Dr. João / Hospital Central" />
                    </div>
                     <div>
                        <label htmlFor="surgeryNotes" className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                        <textarea id="surgeryNotes" rows={3} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500" placeholder="Ex: Procedimento ocorreu sem complicações."></textarea>
                    </div>
                </form>
            </div>

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/80">
                 <button onClick={handleSubmit} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-sky-500/30 transition duration-300">
                    Salvar Cirurgia
                </button>
            </div>
        </div>
    );
};


// --- COMPONENTE DE NOTIFICAÇÃO ---
const Notification = ({ message, onClose }: { message: string, onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Fecha automaticamente após 3 segundos

        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white py-3 px-5 rounded-lg shadow-xl animate-bounce-in">
             <style>{`
                @keyframes bounce-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.5) translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
                }
            `}</style>
            <p>{message}</p>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL (APP) ---
const App = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('login');
    const [notification, setNotification] = useState<string | null>(null);

    const showNotification = (message: string) => {
        setNotification(message);
    };
// Nesse switch case eu mudei para ele entrar direto na home screen ja que o login agora e feito pelo Clerk
    const renderScreen = () => {
        const props = {
            navigateTo: setCurrentScreen,
            setNotification: showNotification,
        };
        switch (currentScreen) {
            case 'home':
                return <HomeScreen {...props} />;
            case 'summary':
                return <SummaryScreen {...props} />;
            case 'exams':
                return <ExamsScreen {...props} />;
            case 'medications':
                return <MedicationsScreen {...props} />;
            case 'allergies':
                return <AllergiesScreen {...props} />;
            case 'surgeries':
                return <SurgeriesScreen {...props} />;
            case 'addMedication':
                return <AddMedicationScreen {...props} />;
            case 'addAllergy':
                return <AddAllergyScreen {...props} />;
            case 'addSurgery':
                return <AddSurgeryScreen {...props} />;
            case 'login':
            default:
                return <HomeScreen navigateTo={setCurrentScreen} setNotification={showNotification} />;
        }
    };

    return (
        <div className="bg-gray-100 font-sans">
            <div className="max-w-md mx-auto min-h-screen shadow-2xl relative">
                {renderScreen()}
                {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            </div>
        </div>
    );
};

export default App;
