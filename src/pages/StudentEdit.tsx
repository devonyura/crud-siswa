import { useEffect, useState } from 'react';
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
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { updateData } from '../hooks/restAPIRequest';
import AlertOK from '../components/AlertOK';
import { useAuth } from "../hooks/useAuthCookie";

const StudentEdit: React.FC = () => {

	const { token } = useAuth();

	if (!token) {
		return <Redirect to="/login" />
	}


	const [alertMessage, setAlertMessage] = useState('');
	const [showAlert, setShowAlert] = useState(false);

	const location = useLocation<{ student: any }>();
	const history = useHistory();
	const studentData = location.state?.student || null;

	useEffect(() => {
		if (!studentData) {
			history.replace('/student-list');
		}
	}, [studentData, history]);

	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [gender, setGender] = useState('L');

	useEffect(() => {
		if (studentData) {
			setName(studentData.name);
			setAddress(studentData.address);
			setGender(studentData.gender);
		}
	}, [studentData]);

	const checkForm = (name: string, value: any) => {
		if (value === null || !value) {
			setAlertMessage('Data ' + name + " tidak boleh kosong!");
			setShowAlert(true)
			return false
		}
		return true
	}

	const handleEditStudent = async () => {
		const updatedStudent = { name, address, gender };

		if (!checkForm("Nama", updatedStudent.name)) {
			return
		}

		try {
			const result = await updateData(studentData.id, updatedStudent);
			if (result.success) {
				setAlertMessage('Data siswa berhasil diperbarui');
				history.push('/student-list');
			} else {
				setAlertMessage('Gagal mengupdate data siswa, pastikan data valid');
			}
		} catch (error: any) {
			console.log(error);
			setAlertMessage('Ada Kesalahan: ' + error.error);
		}

		setShowAlert(true);
	};

	const handleCancel = () => {
		history.push("/student-list", { dontRefresh: true });
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={handleCancel}>Batal</IonButton>
					</IonButtons>
					<IonTitle>Edit Siswa</IonTitle>
					<IonButtons slot="end">
						<IonButton strong={true} onClick={handleEditStudent}>
							Simpan
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonItem>
					<IonInput label="Nama" labelPlacement="floating" value={name} onIonInput={(e) => setName(e.detail.value || '')} type="text" placeholder="Masukkan Nama" />
				</IonItem>
				<IonItem>
					<IonInput label="Address" labelPlacement="floating" value={address} onIonInput={(e) => setAddress(e.detail.value || '')} type="text" placeholder="Masukkan Alamat" />
				</IonItem>
				<IonItem>
					<IonLabel id="gender">Gender</IonLabel>
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

export default StudentEdit;
