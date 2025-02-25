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
import { useHistory, Redirect } from 'react-router-dom';
import { saveData, ApiResponse } from '../hooks/restAPIRequest';
import AlertOK from '../components/AlertOK';
import { useStudent } from '../context/StudentContext'
import { useAuth } from "../hooks/useAuthCookie";

const StudentAdd: React.FC = () => {

	const { token } = useAuth();

	if (!token) {
		return <Redirect to="/login" />
	}


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

	const checkForm = (name: string, value: any) => {
		if (value === null || !value) {
			setAlertMessage('Data ' + name + " tidak boleh kosong!");
			setShowAlert(true)
			return false
		}
		return true
	}

	const handleAddStudent = async () => {
		document.body.focus();

		const newStudent = { name, address, gender }

		if (!checkForm("Nama", newStudent.name)) {
			return
		}

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
			setAlertMessage('Ada Kesalahan: ' + error);
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
						onIonInput={(e) => setName(e.detail.value!)}
						type="text"
						placeholder="Masukkan Nama"
					/>
				</IonItem>
				<IonItem>
					<IonInput
						label="Alamat"
						labelPlacement="floating"
						value={address}
						onIonInput={(e) => setAddress(e.detail.value!)}
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
