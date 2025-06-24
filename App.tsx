
import React, { useState, useCallback, useEffect } from 'react';
import { Person, PersonFormData, AppNotification, NotificationType, MemberType } from './types';
import PersonForm from './components/PersonForm';
import PersonTable from './components/PersonTable';
import NotificationArea from './components/NotificationArea';

// ###################################################################################
// # IMPORTANT : URL de votre script Google Apps.                                   #
// # Elle doit ressembler à : https://script.google.com/macros/s/VOTRE_ID_SCRIPT/exec #
// ###################################################################################
const BACKEND_API_URL = 'https://script.google.com/macros/s/AKfycbyCo2OJYyJHwVlLw0WEg7tuQun3oCfTqBxLTCZdnXOQRWHnnOS5EeD83uNgNI8lx9cN/exec'; 

const App: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addNotification = useCallback((message: React.ReactNode, type: NotificationType) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 7000); // Auto-dismiss after 7 seconds for potentially longer messages
  }, []);

  const handleSubmit = useCallback(async (formData: PersonFormData) => {
    setIsLoading(true);
    
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const personDataForBackend = {
      ...formData,
      dateSoumission: formattedDate,
    };

    try {
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        // MODIFICATION ICI: Changer Content-Type pour text/plain
        // Google Apps Script lira e.postData.contents qui sera la chaîne JSON.
        headers: {
           'Content-Type': 'text/plain', 
        },
        body: JSON.stringify(personDataForBackend), // Nous envoyons toujours une chaîne JSON
      });
      
      const resultText = await response.text();
      let result: any;
      try {
        result = JSON.parse(resultText);
      } catch (parseError) {
        console.error("Failed to parse backend response as JSON:", resultText);
        throw new Error("Réponse invalide du backend. Vérifiez les journaux Apps Script. Réponse brute: " + resultText.substring(0, 1000));
      }


      if (result.status !== 'success') {
        throw new Error(result.message || `Erreur du script backend: ${result.status || 'Statut inconnu'}`);
      }
      
      const newPerson: Person = {
        id: Date.now().toString(),
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        typeMembre: formData.typeMembre,
        dateSoumission: formattedDate,
      };
      setPersons(prevPersons => [newPerson, ...prevPersons]);
      
      let memberTypeMessage = '';
      if (newPerson.typeMembre) {
        memberTypeMessage = ` en tant que ${newPerson.typeMembre}`;
      }

      addNotification(
        <>
          <p className="font-semibold">Succès !</p>
          <p>Personne <span className="font-medium">{newPerson.prenom} {newPerson.nom}</span>{memberTypeMessage} ajoutée.</p>
          <p>{result.message || 'Données envoyées et traitées avec succès par Google Sheets.'}</p>
        </>,
        NotificationType.SUCCESS
      );

    } catch (error: any) {
      console.error('Erreur lors de la soumission au script Google Apps :', error);
      addNotification(
        <>
          <p className="font-semibold">Erreur !</p>
          <p>Impossible de soumettre les données : {error.message}</p>
          <p>Veuillez vérifier l'URL du script et les journaux d'exécution dans Google Apps Script.</p>
          {error.message && error.message.includes("NetworkError") && (
            <p className="text-xs mt-1">Conseil: Les NetworkErrors sont souvent liés à des problèmes CORS. Assurez-vous que votre script Apps est déployé pour autoriser l'accès à "Tous les utilisateurs".</p>
          )}
        </>,
        NotificationType.ERROR
      );
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    addNotification(
      <div className="text-sm">
        <p className="font-semibold mb-1">Note Importante :</p>
        <p>Cette application envoie les données à un script Google Apps.</p>
        <p>Assurez-vous que l'URL <code className="bg-slate-200 text-slate-700 px-1 rounded">BACKEND_API_URL</code> dans <code className="bg-slate-200 text-slate-700 px-1 rounded">App.tsx</code> est correcte et pointe vers votre script déployé.</p>
      </div>,
      NotificationType.INFO
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuter une seule fois au montage

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
          Système d'Entrée de Personnes
        </h1>
        <p className="mt-2 text-lg text-slate-300">
          Capturez et traitez les détails des personnes via Google Sheets.
        </p>
      </header>
      
      <NotificationArea notifications={notifications} onDismiss={id => setNotifications(prev => prev.filter(n => n.id !== id))} />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">Ajouter une Nouvelle Personne</h2>
          <PersonForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-6">Personnes Entrées (Affichage local)</h2>
          {persons.length > 0 ? (
            <PersonTable persons={persons} />
          ) : (
            <div className="text-center text-slate-500 py-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-slate-400 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">Aucune personne soumise pour le moment.</p>
              <p className="text-sm">Les données apparaîtront ici après une soumission réussie à Google Sheets.</p>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-12 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} Application d'Entrée de Personnes. Tous droits réservés (conceptuellement).</p>
        <p>Cette application communique avec un script Google Apps lié à Google Sheets.</p>
      </footer>
    </div>
  );
};

export default App;
