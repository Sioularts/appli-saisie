import React from 'react';
import { Person } from '../types';

interface PersonTableProps {
  persons: Person[];
}

const PersonTable: React.FC<PersonTableProps> = ({ persons }) => {
  if (persons.length === 0) {
    return <p className="text-center text-slate-500">Aucune personne n'a encore été ajoutée.</p>;
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full divide-y divide-slate-200 bg-white">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prénom</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Téléphone</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type Membre</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Soumission</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {persons.map((person) => (
            <tr key={person.id} className="hover:bg-slate-50 transition-colors duration-150">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{person.prenom}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-800">{person.nom}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-800">{person.email}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-800">{person.telephone || '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-800">{person.typeMembre || '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-800">{person.dateSoumission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonTable;