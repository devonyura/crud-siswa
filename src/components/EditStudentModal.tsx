import { useState, useRef, useEffect } from 'react';
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonInput,
  IonFab,
  IonFabButton,
  IonIcon,
  IonRadio,
  IonRadioGroup,
  IonLabel,
  IonAlert,
} from '@ionic/react';
import { updateData, Student } from '../hooks/restAPIRequest'
import AlertOK from '../components/AlertOK';



interface EditStudentModalProps {
	isOpen: boolean;
	onClose: () => void;
	student: Student | null;
	fetchStudents: () => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, student,  fetchStudents }) => {
  console.log(isOpen);
  const modal = useRef<HTMLIonModalElement>(null);
  
  // persiapan semua data yang berubah realtime (pakainya useState)
  const [name, setName] = useState('');
  const [addresss, setAddresss] = useState('');
  const [gender, setGender] = useState('L');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Fungsi untuk mereset form
	const resetForm = () => {
		setName('');
		setAddresss('');
		setGender('L');
	};

  // Mengisi form dengan data siswa saat modal dibuka
  useEffect(() => {
    if (student) {
      setName(student.nama);
      setAddresss(student.alamat);
      setGender(student.gender);
    }
  }, [student]);

  async function handleUpdateStudent() {
    if (!student) return;

    // menyiapkan/menyusun data yang ingin dikirim;
    const updatedStudent = {
      nama: name,
      alamat: addresss,
      gender
    };   
    console.log(updatedStudent);
    try {
			const result = await updateData(student.id, updatedStudent);
			if (result.success) {
				setAlertMessage('Data siswa berhasil diperbarui!');
				fetchStudents();
			} else {
				setAlertMessage('Gagal memperbarui data siswa');
			}
		} catch (error) {
			setAlertMessage('Terjadi kesalahan saat memperbarui data');
		}

      setShowAlert(true);
      modal.current?.dismiss();
      resetForm();
  }

  return (
  <>
    <IonModal isOpen={isOpen} onDidDismiss={onClose} ref={modal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>Batal</IonButton>
          </IonButtons>
          <IonTitle>Edit Siswa</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={handleUpdateStudent}>
              Simpan
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Nama"
            labelPlacement="floating"
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
            type="text"
            placeholder="Masukkan Nama"
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Alamat"
            labelPlacement="floating"
            value={addresss}
            onIonChange={(e) => setAddresss(e.detail.value ?? '')} // Pastikan tidak null
            type="text"
            placeholder="Masukkan Alamat"
          />
        </IonItem>
        <IonItem>
          <IonLabel>Gender</IonLabel>
          <IonRadioGroup value={gender} onIonChange={(e) => setGender(e.detail.value)}>
            <IonRadio value="L">Pria</IonRadio>
            <IonRadio value="P">Wanita</IonRadio>
          </IonRadioGroup>
        </IonItem>
      </IonContent>
    </IonModal>

    <AlertOK isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header={alertMessage} />

  </>
  );
}

export default EditStudentModal;