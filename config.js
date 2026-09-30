/* =====================================================================
   PROGRAMME PADEL — configuration de l'application (à remplir une fois)
   ---------------------------------------------------------------------
   Pour activer les comptes (sauvegarde en ligne, plusieurs appareils),
   le partage avec un coach et les notifications pour TOUS les
   utilisateurs, renseigne ici ton projet Supabase :
     supabaseUrl     : Project Settings > API > Project URL
     supabaseAnonKey : Project Settings > API Keys > clé « anon public »
   Laisse vide pour une app 100 % locale (données sur le téléphone).
   Ne mets JAMAIS la clé « service_role » ici.
   ===================================================================== */
const APP_CONFIG = {
  name: "Programme Padel",
  supabaseUrl: "https://utylcckmpjnfxrnqcaes.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0eWxjY2ttcGpuZnhybnFjYWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2OTQwODgsImV4cCI6MjEwNjI3MDA4OH0.kW15AHMl8EHkYWpY18b5TXQBiFrOKPeuHVZNL83T4_o",
  contactEmail: "pierreorriols04@gmail.com",      // adresse de contact affichée dans l'app (obligatoire pour une app publique)
  owner: "Orriols Pierre",             // éditeur : ton nom ou le nom de ton entreprise (mentions légales)
  ownerAddress: "",      // facultatif : adresse postale de l'éditeur
  ownerId: "",           // facultatif : SIRET si tu publies en tant qu'entreprise
  dataRegion: "Union européenne",  // région de ton projet Supabase (Project Settings > General)
  legalDate: "30 septembre 2026",  // date de mise à jour de la politique de confidentialité
  adminNote: ""          // (réservé)
};
