export interface SurgeryType {
  id: string;
  name: string;
  category: string;
  description?: string;
  commonAliases?: string[];
  icon: string;
}

export const STANDARDIZED_SURGERY_TYPES: SurgeryType[] = [
  // Cardiac & Cardiovascular Surgery
  {
    id: 'cabg',
    name: 'Coronary Artery Bypass Grafting (CABG)',
    category: 'Cardiac & Cardiovascular',
    description: 'Surgical procedure to improve blood flow to the heart',
    commonAliases: ['Heart Bypass', 'CABG', 'Coronary Bypass', 'Heart Surgery'],
    icon: '🫀'
  },
  {
    id: 'valve-replacement',
    name: 'Heart Valve Replacement',
    category: 'Cardiac & Cardiovascular',
    description: 'Surgical replacement of damaged heart valves',
    commonAliases: ['Valve Surgery', 'Heart Valve Surgery', 'Valve Replacement'],
    icon: '🫀'
  },
  {
    id: 'angioplasty',
    name: 'Coronary Angioplasty',
    category: 'Cardiac & Cardiovascular',
    description: 'Procedure to open blocked coronary arteries',
    commonAliases: ['Angioplasty', 'Stent Placement', 'Coronary Stent'],
    icon: '🫀'
  },
  {
    id: 'aortic-aneurysm-repair',
    name: 'Aortic Aneurysm Repair',
    category: 'Cardiac & Cardiovascular',
    description: 'Surgical repair of enlarged aorta',
    commonAliases: ['Aorta Surgery', 'Aneurysm Repair'],
    icon: '🫀'
  },
  {
    id: 'pacemaker-implantation',
    name: 'Pacemaker Implantation',
    category: 'Cardiac & Cardiovascular',
    description: 'Surgical placement of cardiac pacemaker device',
    commonAliases: ['Pacemaker Surgery', 'Cardiac Device Implantation'],
    icon: '🫀'
  },
  {
    id: 'cardiac-ablation',
    name: 'Cardiac Ablation',
    category: 'Cardiac & Cardiovascular',
    description: 'Procedure to treat heart rhythm disorders',
    commonAliases: ['Ablation Surgery', 'Heart Rhythm Surgery'],
    icon: '🫀'
  },

  // Neurosurgery
  {
    id: 'craniotomy',
    name: 'Craniotomy',
    category: 'Neurosurgery',
    description: 'Surgical opening of the skull to access the brain',
    commonAliases: ['Brain Surgery', 'Skull Surgery', 'Neurosurgery'],
    icon: '🧠'
  },
  {
    id: 'spinal-fusion',
    name: 'Spinal Fusion',
    category: 'Neurosurgery',
    description: 'Surgical procedure to join two or more vertebrae',
    commonAliases: ['Spine Fusion', 'Back Fusion', 'Vertebral Fusion'],
    icon: '🧠'
  },
  {
    id: 'laminectomy',
    name: 'Laminectomy',
    category: 'Neurosurgery',
    description: 'Surgical removal of part of the vertebral bone',
    commonAliases: ['Spine Decompression', 'Laminectomy Surgery'],
    icon: '🧠'
  },
  {
    id: 'deep-brain-stimulation',
    name: 'Deep Brain Stimulation (DBS)',
    category: 'Neurosurgery',
    description: 'Surgical implantation of electrodes in the brain for movement disorders',
    commonAliases: ['DBS Surgery', 'Brain Stimulation', 'Parkinson\'s Surgery'],
    icon: '🧠'
  },
  {
    id: 'shunt-placement',
    name: 'Ventriculoperitoneal Shunt',
    category: 'Neurosurgery',
    description: 'Surgical placement of shunt to drain excess cerebrospinal fluid',
    commonAliases: ['Brain Shunt', 'VP Shunt', 'Hydrocephalus Surgery'],
    icon: '🧠'
  },

  // Ophthalmology
  {
    id: 'cataract-extraction',
    name: 'Cataract Extraction',
    category: 'Ophthalmology',
    description: 'Surgical removal of cloudy lens from the eye',
    commonAliases: ['Cataract Surgery', 'Lens Extraction', 'Eye Surgery'],
    icon: '👁️'
  },
  {
    id: 'laser-eye-surgery',
    name: 'Laser Eye Surgery (LASIK)',
    category: 'Ophthalmology',
    description: 'Laser vision correction surgery',
    commonAliases: ['LASIK', 'Laser Vision Correction', 'Refractive Surgery'],
    icon: '👁️'
  },
  {
    id: 'retinal-detachment-repair',
    name: 'Retinal Detachment Repair',
    category: 'Ophthalmology',
    description: 'Surgical repair of detached retina',
    commonAliases: ['Retinal Surgery', 'Retina Repair'],
    icon: '👁️'
  },
  {
    id: 'glaucoma-surgery',
    name: 'Glaucoma Surgery',
    category: 'Ophthalmology',
    description: 'Surgical procedures to reduce eye pressure',
    commonAliases: ['Glaucoma Treatment', 'Eye Pressure Surgery'],
    icon: '👁️'
  },

  // General Surgery
  {
    id: 'appendectomy',
    name: 'Appendectomy',
    category: 'General Surgery',
    description: 'Surgical removal of the appendix',
    commonAliases: ['Appendix Removal', 'Appendectomy Surgery'],
    icon: '🩺'
  },
  {
    id: 'hernia-repair',
    name: 'Hernia Repair',
    category: 'General Surgery',
    description: 'Surgical repair of abdominal wall hernia',
    commonAliases: ['Hernia Surgery', 'Abdominal Hernia Repair'],
    icon: '🩺'
  },
  {
    id: 'cholecystectomy',
    name: 'Cholecystectomy',
    category: 'General Surgery',
    description: 'Surgical removal of the gallbladder',
    commonAliases: ['Gallbladder Removal', 'Gallbladder Surgery'],
    icon: '🩺'
  },
  {
    id: 'gastrectomy',
    name: 'Gastrectomy',
    category: 'General Surgery',
    description: 'Partial or complete removal of the stomach',
    commonAliases: ['Stomach Removal', 'Stomach Surgery'],
    icon: '🩺'
  },
  {
    id: 'colectomy',
    name: 'Colectomy',
    category: 'General Surgery',
    description: 'Surgical removal of part or all of the colon',
    commonAliases: ['Colon Surgery', 'Bowel Surgery'],
    icon: '🩺'
  },
  {
    id: 'splenectomy',
    name: 'Splenectomy',
    category: 'General Surgery',
    description: 'Surgical removal of the spleen',
    commonAliases: ['Spleen Removal', 'Spleen Surgery'],
    icon: '🩺'
  },

  // Orthopedic Surgery
  {
    id: 'total-hip-replacement',
    name: 'Total Hip Replacement',
    category: 'Orthopedic Surgery',
    description: 'Surgical replacement of damaged hip joint',
    commonAliases: ['Hip Replacement', 'Hip Arthroplasty', 'Hip Surgery'],
    icon: '🦴'
  },
  {
    id: 'total-knee-replacement',
    name: 'Total Knee Replacement',
    category: 'Orthopedic Surgery',
    description: 'Surgical replacement of damaged knee joint',
    commonAliases: ['Knee Replacement', 'Knee Arthroplasty', 'Knee Surgery'],
    icon: '🦴'
  },
  {
    id: 'knee-arthroscopy',
    name: 'Knee Arthroscopy',
    category: 'Orthopedic Surgery',
    description: 'Minimally invasive knee joint examination and treatment',
    commonAliases: ['Knee Scope', 'Arthroscopic Knee Surgery'],
    icon: '🦴'
  },
  {
    id: 'shoulder-surgery',
    name: 'Shoulder Surgery',
    category: 'Orthopedic Surgery',
    description: 'Various surgical procedures on the shoulder joint',
    commonAliases: ['Shoulder Repair', 'Shoulder Arthroscopy'],
    icon: '🦴'
  },
  {
    id: 'ankle-fusion',
    name: 'Ankle Fusion',
    category: 'Orthopedic Surgery',
    description: 'Surgical fusion of ankle joint to relieve pain',
    commonAliases: ['Ankle Arthrodesis', 'Ankle Surgery'],
    icon: '🦴'
  },
  {
    id: 'spinal-instrumentation',
    name: 'Spinal Instrumentation',
    category: 'Orthopedic Surgery',
    description: 'Surgical placement of hardware to stabilize spine',
    commonAliases: ['Spine Hardware', 'Spinal Stabilization'],
    icon: '🦴'
  },

  // Thoracic Surgery
  {
    id: 'lobectomy',
    name: 'Lobectomy (Lung Surgery)',
    category: 'Thoracic Surgery',
    description: 'Surgical removal of a lobe of the lung',
    commonAliases: ['Lung Surgery', 'Lung Lobectomy', 'Thoracic Surgery'],
    icon: '🫁'
  },
  {
    id: 'pneumonectomy',
    name: 'Pneumonectomy',
    category: 'Thoracic Surgery',
    description: 'Surgical removal of an entire lung',
    commonAliases: ['Lung Removal', 'Complete Lung Surgery'],
    icon: '🫁'
  },
  {
    id: 'mediastinoscopy',
    name: 'Mediastinoscopy',
    category: 'Thoracic Surgery',
    description: 'Examination of the space between the lungs',
    commonAliases: ['Chest Examination', 'Mediastinal Surgery'],
    icon: '🫁'
  },
  {
    id: 'esophagectomy',
    name: 'Esophagectomy',
    category: 'Thoracic Surgery',
    description: 'Surgical removal of part or all of the esophagus',
    commonAliases: ['Esophagus Removal', 'Esophageal Surgery'],
    icon: '🫁'
  },

  // Urology
  {
    id: 'prostatectomy',
    name: 'Prostatectomy',
    category: 'Urology',
    description: 'Surgical removal of the prostate gland',
    commonAliases: ['Prostate Removal', 'Prostate Surgery'],
    icon: '🧍‍♂️'
  },
  {
    id: 'nephrectomy',
    name: 'Nephrectomy',
    category: 'Urology',
    description: 'Surgical removal of a kidney',
    commonAliases: ['Kidney Removal', 'Kidney Surgery'],
    icon: '🧍‍♂️'
  },
  {
    id: 'cystectomy',
    name: 'Cystectomy',
    category: 'Urology',
    description: 'Surgical removal of the bladder',
    commonAliases: ['Bladder Removal', 'Bladder Surgery'],
    icon: '🧍‍♂️'
  },
  {
    id: 'ureteroscopy',
    name: 'Ureteroscopy',
    category: 'Urology',
    description: 'Minimally invasive examination of the urinary tract',
    commonAliases: ['Urinary Tract Surgery', 'Ureter Surgery'],
    icon: '🧍‍♂️'
  },

  // Obstetrics & Gynecology
  {
    id: 'cesarean-section',
    name: 'Cesarean Section (C-Section)',
    category: 'Obstetrics & Gynecology',
    description: 'Surgical delivery of a baby through abdominal incision',
    commonAliases: ['C-Section', 'Cesarean Delivery', 'Abdominal Delivery'],
    icon: '🫄'
  },
  {
    id: 'hysterectomy',
    name: 'Hysterectomy',
    category: 'Obstetrics & Gynecology',
    description: 'Surgical removal of the uterus',
    commonAliases: ['Uterus Removal', 'Uterine Surgery'],
    icon: '🫄'
  },
  {
    id: 'tubal-ligation',
    name: 'Tubal Ligation',
    category: 'Obstetrics & Gynecology',
    description: 'Surgical sterilization procedure for women',
    commonAliases: ['Female Sterilization', 'Tubal Surgery'],
    icon: '🫄'
  },
  {
    id: 'myomectomy',
    name: 'Myomectomy',
    category: 'Obstetrics & Gynecology',
    description: 'Surgical removal of uterine fibroids',
    commonAliases: ['Fibroid Removal', 'Uterine Fibroid Surgery'],
    icon: '🫄'
  },

  // Plastic & Reconstructive Surgery
  {
    id: 'breast-reconstruction',
    name: 'Breast Reconstruction',
    category: 'Plastic & Reconstructive Surgery',
    description: 'Surgical reconstruction of the breast after mastectomy',
    commonAliases: ['Breast Surgery', 'Mastectomy Reconstruction'],
    icon: '🧵'
  },
  {
    id: 'skin-graft',
    name: 'Skin Graft',
    category: 'Plastic & Reconstructive Surgery',
    description: 'Surgical transplantation of skin from one area to another',
    commonAliases: ['Skin Transplantation', 'Graft Surgery'],
    icon: '🧵'
  },
  {
    id: 'rhinoplasty',
    name: 'Rhinoplasty',
    category: 'Plastic & Reconstructive Surgery',
    description: 'Surgical reshaping of the nose',
    commonAliases: ['Nose Job', 'Nose Surgery'],
    icon: '🧵'
  },
  {
    id: 'blepharoplasty',
    name: 'Blepharoplasty',
    category: 'Plastic & Reconstructive Surgery',
    description: 'Surgical correction of drooping eyelids',
    commonAliases: ['Eyelid Surgery', 'Eye Lift'],
    icon: '🧵'
  },

  // Vascular Surgery
  {
    id: 'carotid-endarterectomy',
    name: 'Carotid Endarterectomy',
    category: 'Vascular Surgery',
    description: 'Surgical removal of plaque from carotid arteries',
    commonAliases: ['Carotid Surgery', 'Neck Artery Surgery'],
    icon: '🩸'
  },
  {
    id: 'peripheral-bypass',
    name: 'Peripheral Bypass',
    category: 'Vascular Surgery',
    description: 'Surgical bypass of blocked blood vessels in legs',
    commonAliases: ['Leg Bypass', 'Peripheral Vascular Surgery'],
    icon: '🩸'
  },
  {
    id: 'varicose-vein-surgery',
    name: 'Varicose Vein Surgery',
    category: 'Vascular Surgery',
    description: 'Surgical treatment of enlarged veins',
    commonAliases: ['Vein Surgery', 'Varicose Vein Treatment'],
    icon: '🩸'
  },

  // ENT (Ear, Nose & Throat) Surgery
  {
    id: 'tonsillectomy',
    name: 'Tonsillectomy',
    category: 'ENT Surgery',
    description: 'Surgical removal of the tonsils',
    commonAliases: ['Tonsil Removal', 'Tonsil Surgery'],
    icon: '👂'
  },
  {
    id: 'adenoidectomy',
    name: 'Adenoidectomy',
    category: 'ENT Surgery',
    description: 'Surgical removal of the adenoids',
    commonAliases: ['Adenoid Removal', 'Adenoid Surgery'],
    icon: '👂'
  },
  {
    id: 'tympanoplasty',
    name: 'Tympanoplasty',
    category: 'ENT Surgery',
    description: 'Surgical repair of the eardrum',
    commonAliases: ['Eardrum Repair', 'Ear Surgery'],
    icon: '👂'
  },
  {
    id: 'septoplasty',
    name: 'Septoplasty',
    category: 'ENT Surgery',
    description: 'Surgical correction of deviated nasal septum',
    commonAliases: ['Nasal Septum Surgery', 'Nose Surgery'],
    icon: '👂'
  },

  // Pediatric Surgery
  {
    id: 'circumcision',
    name: 'Circumcision',
    category: 'Pediatric Surgery',
    description: 'Surgical removal of the foreskin',
    commonAliases: ['Foreskin Removal', 'Male Circumcision'],
    icon: '👶'
  },
  {
    id: 'inguinal-hernia-repair',
    name: 'Inguinal Hernia Repair',
    category: 'Pediatric Surgery',
    description: 'Surgical repair of groin hernia in children',
    commonAliases: ['Groin Hernia Repair', 'Pediatric Hernia'],
    icon: '👶'
  },
  {
    id: 'pyloromyotomy',
    name: 'Pyloromyotomy',
    category: 'Pediatric Surgery',
    description: 'Surgical treatment for pyloric stenosis',
    commonAliases: ['Pyloric Stenosis Surgery', 'Infant Stomach Surgery'],
    icon: '👶'
  },

  // Transplant Surgery
  {
    id: 'kidney-transplant',
    name: 'Kidney Transplant',
    category: 'Transplant Surgery',
    description: 'Surgical transplantation of a kidney from donor',
    commonAliases: ['Renal Transplant', 'Kidney Transplantation'],
    icon: '🔄'
  },
  {
    id: 'liver-transplant',
    name: 'Liver Transplant',
    category: 'Transplant Surgery',
    description: 'Surgical transplantation of a liver from donor',
    commonAliases: ['Hepatic Transplant', 'Liver Transplantation'],
    icon: '🔄'
  },
  {
    id: 'heart-transplant',
    name: 'Heart Transplant',
    category: 'Transplant Surgery',
    description: 'Surgical transplantation of a heart from donor',
    commonAliases: ['Cardiac Transplant', 'Heart Transplantation'],
    icon: '🔄'
  },
  {
    id: 'lung-transplant',
    name: 'Lung Transplant',
    category: 'Transplant Surgery',
    description: 'Surgical transplantation of lungs from donor',
    commonAliases: ['Pulmonary Transplant', 'Lung Transplantation'],
    icon: '🔄'
  },

  // Emergency Surgery
  {
    id: 'exploratory-laparotomy',
    name: 'Exploratory Laparotomy',
    category: 'Emergency Surgery',
    description: 'Emergency abdominal exploration for trauma or bleeding',
    commonAliases: ['Emergency Abdominal Surgery', 'Trauma Surgery'],
    icon: '🚨'
  },
  {
    id: 'thoracotomy',
    name: 'Thoracotomy',
    category: 'Emergency Surgery',
    description: 'Emergency chest surgery for trauma or bleeding',
    commonAliases: ['Emergency Chest Surgery', 'Trauma Thoracotomy'],
    icon: '🚨'
  },
  {
    id: 'craniotomy-emergency',
    name: 'Emergency Craniotomy',
    category: 'Emergency Surgery',
    description: 'Emergency brain surgery for trauma or bleeding',
    commonAliases: ['Emergency Brain Surgery', 'Trauma Craniotomy'],
    icon: '🚨'
  }
];

export const SURGERY_CATEGORIES = [
  'Cardiac & Cardiovascular',
  'Neurosurgery',
  'Ophthalmology',
  'General Surgery',
  'Orthopedic Surgery',
  'Thoracic Surgery',
  'Urology',
  'Obstetrics & Gynecology',
  'Plastic & Reconstructive Surgery',
  'Vascular Surgery',
  'ENT Surgery',
  'Pediatric Surgery',
  'Transplant Surgery',
  'Emergency Surgery'
];

export function getSurgeryTypesByCategory(category?: string): SurgeryType[] {
  if (!category) return STANDARDIZED_SURGERY_TYPES;
  return STANDARDIZED_SURGERY_TYPES.filter(type => type.category === category);
}

export function searchSurgeryTypes(query: string): SurgeryType[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return STANDARDIZED_SURGERY_TYPES;

  return STANDARDIZED_SURGERY_TYPES.filter(type => 
    type.name.toLowerCase().includes(lowerQuery) ||
    type.category.toLowerCase().includes(lowerQuery) ||
    type.commonAliases?.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
    type.description?.toLowerCase().includes(lowerQuery)
  );
}

export function getSurgeryTypeById(id: string): SurgeryType | undefined {
  return STANDARDIZED_SURGERY_TYPES.find(type => type.id === id);
}

export function getSurgeryTypeByName(name: string): SurgeryType | undefined {
  return STANDARDIZED_SURGERY_TYPES.find(type => 
    type.name.toLowerCase() === name.toLowerCase() ||
    type.commonAliases?.some(alias => alias.toLowerCase() === name.toLowerCase())
  );
}
