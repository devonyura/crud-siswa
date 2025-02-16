import { useState, useRef } from 'react'
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
} from '@ionic/react'
import { add } from 'ionicons/icons'
import { saveData } from '../hooks/restAPIRequest'
import AlertOK from '../components/AlertOK'

interface ApiResponse {
	success: boolean
	data?: any
	error?: string
}

const AddStudentModal = ({ fetchStudents }: { fetchStudents: () => void }) => {
  
  const modal = useRef<HTMLIonModalElement>(null);
  
  // persiapan semua data yang berubah realtime (pakainya useState)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [gender, setGender] = useState('L')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

    // Fungsi untuk mereset form
	const resetForm = () => {
		setName('')
		setAddress('')
		setGender('L')
	};

  async function handleAddStudent() {
    // menyiapkan/menyusun data yang ingin dikirim;
    const newStudent = {
      nama: name,
      alamat: address,
      gender
    };   

    saveData(newStudent)
      .then((result : ApiResponse) => {
        if (result.success) {
          setAlertMessage('Murid Berhasil Ditambah')
          fetchStudents()
          // console.log("Gagal menambahkan siswa:", result.data);
        } else {
          // console.log("Gagal menambahkan siswa:", result.error);
          setAlertMessage("Gagal menambah murid, pastikan data sesuai")
        }
      })
      .catch((err) => console.log("Kesalahan:", err))

      setShowAlert(true)
      modal.current?.dismiss()
      resetForm()
  }

  return (
  <>
    <IonFab vertical="bottom" horizontal="center" slot="fixed">
      <IonFabButton id="open-modal">
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>

    <IonModal ref={modal} trigger="open-modal" onDidPresent={resetForm}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => modal.current?.dismiss()}>Batal</IonButton>
          </IonButtons>
          <IonTitle>Tambah Siswa</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={()=>{handleAddStudent()}}>
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
            value={address}
            onIonChange={(e) => setAddress(e.detail.value!)}
            type="text"
            placeholder="Masukkan Alamat"
          />
        </IonItem>
        <IonItem>
          <IonLabel id='gender'>Gender</IonLabel>
          <IonRadioGroup value={gender} onIonChange={(e) => setGender(e.detail.value)}>
            <IonRadio value="L">Pria</IonRadio>
            <br/>
            <IonRadio value="P">Wanita</IonRadio>
          </IonRadioGroup>
        </IonItem>
      </IonContent>
    </IonModal>

    <AlertOK isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header={alertMessage} />


  </>
  );
}

export default AddStudentModal