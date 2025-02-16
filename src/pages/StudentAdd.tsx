import { useState } from 'react';
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonContent,
	IonItem,
	IonInput,
	IonRadioGroup,
	IonRadio,
	IonLabel,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { saveData, ApiResponse } from '../hooks/restAPIRequest';
import AlertOK from '../components/AlertOK';
import { useStudent } from '../context/StudentContext'

const StudentAdd: React.FC = () => {
	const history = useHistory();
  const { updated, setUpdated } = useStudent();

	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [gender, setGender] = useState('L');
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');

	const resetForm = () => {
		setName('');
		setAddress('');
		setGender('L');
	};

	const handleAddStudent = async () => {
    document.body.focus(); 
    
		const newStudent = { nama: name, alamat: address, gender}

    try {

      const result = await saveData(newStudent)
    
      if (result.success) {
        setAlertMessage('Murid Berhasil Ditambah')
        setUpdated(true);
        history.push('/student-list')
      } else {
        setAlertMessage('Gagal menambah murid, pastikan data sesuai')
      }
     
    } catch (error) {
      setAlertMessage('Ada Kesalahan: '+error);
    }

		setShowAlert(true);
		resetForm();
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => history.goBack()}>Batal</IonButton>
					</IonButtons>
					<IonTitle>Tambah Siswa</IonTitle>
					<IonButtons slot="end">
						<IonButton strong={true} onClick={handleAddStudent}>
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
						<br />
						<IonRadio value="P">Wanita</IonRadio>
					</IonRadioGroup>
				</IonItem>
			</IonContent>

			<AlertOK isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header={alertMessage} />
		</IonPage>
	);
};

export default StudentAdd;
