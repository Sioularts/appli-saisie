import React, { useState, useEffect } from 'react';
import { PersonFormData, MemberType } from '../types';

interface PersonFormProps {
  onSubmit: (formData: PersonFormData) => void;
  isLoading: boolean;
}

const InputField: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  Icon?: React.ElementType;
}> = ({ id, label, type = "text", value, onChange, placeholder, error, required, Icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`block w-full rounded-md border-0 py-2.5 pr-3 text-slate-900 ring-1 ring-inset ${error ? 'ring-red-500 focus:ring-red-600' : 'ring-slate-300 focus:ring-emerald-500'} placeholder:text-slate-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${Icon ? 'pl-10' : 'pl-3'}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600" id={`${id}-error`}>{error}</p>}
  </div>
);

const SelectField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  Icon?: React.ElementType;
  children: React.ReactNode;
}> = ({ id, label, value, onChange, error, required, Icon, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative rounded-md shadow-sm">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
      )}
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`block w-full rounded-md border-0 py-2.5 pr-10 text-slate-900 ring-1 ring-inset ${error ? 'ring-red-500 focus:ring-red-600' : 'ring-slate-300 focus:ring-emerald-500'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${Icon ? 'pl-10' : 'pl-3'}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {children}
      </select>
    </div>
    {error && <p className="mt-1 text-xs text-red-600" id={`${id}-error`}>{error}</p>}
  </div>
);


const PersonForm: React.FC<PersonFormProps> = ({ onSubmit, isLoading }) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [typeMembre, setTypeMembre] = useState<MemberType | string>('');
  const [dateDuJour, setDateDuJour] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof PersonFormData | 'form' | 'typeMembre', string>>>({});

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-CA'); // YYYY-MM-DD
    setDateDuJour(formattedDate);
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PersonFormData | 'form' | 'typeMembre', string>> = {};
    if (!nom.trim()) newErrors.nom = 'Le nom est requis.';
    if (!prenom.trim()) newErrors.prenom = 'Le prénom est requis.';
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Le format de l\'email est invalide.';
    }
    // TypeMembre is optional, so no validation error if empty unless made required
    // if (!typeMembre) newErrors.typeMembre = 'Le type de membre est requis.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ nom, prenom, email, telephone, typeMembre: typeMembre || undefined });
      // Reset form fields
      setNom('');
      setPrenom('');
      setEmail('');
      setTelephone('');
      setTypeMembre('');
      setErrors({});
    }
  };
  
  const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
  const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
  const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
    </svg>
  );
  const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-100 p-3 rounded-lg shadow">
        <p className="text-sm font-medium text-slate-600">
          Date du Jour (Submission Date): <span className="font-semibold text-emerald-600">{dateDuJour}</span>
        </p>
        <p className="text-xs text-slate-500">This date will be recorded upon submission.</p>
      </div>

      <InputField
        id="prenom"
        label="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        placeholder="Ex: Jean"
        error={errors.prenom}
        required
        Icon={UserIcon}
      />
      <InputField
        id="nom"
        label="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Ex: Dupont"
        error={errors.nom}
        required
        Icon={UserIcon}
      />
      <InputField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Ex: jean.dupont@example.com"
        error={errors.email}
        required
        Icon={EnvelopeIcon}
      />
      <InputField
        id="telephone"
        label="Téléphone (Optionnel)"
        type="tel"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
        placeholder="Ex: 0612345678"
        Icon={PhoneIcon}
      />
      <SelectField
        id="typeMembre"
        label="Type de Membre (Optionnel)"
        value={typeMembre}
        onChange={(e) => setTypeMembre(e.target.value as MemberType | string)}
        error={errors.typeMembre}
        Icon={TagIcon}
      >
        <option value="">-- Choisissez un type --</option>
        {Object.values(MemberType).map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </SelectField>
      
      {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center items-center rounded-md bg-emerald-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Valider la Saisie'
          )}
        </button>
      </div>
    </form>
  );
};

export default PersonForm;