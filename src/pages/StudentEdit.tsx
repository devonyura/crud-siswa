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
import { useHistory, useLocation } from 'react-router-dom';
import { updateData } from '../hooks/restAPIRequest';
import AlertOK from '../components/AlertOK';

const StudentEdit: React.FC = () => {
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
			setName(studentData.nama);
			setAddress(studentData.alamat);
			setGender(studentData.gender);
		}
	}, [studentData]);

	const handleEditStudent = async () => {
		document.body.focus();
		const updatedStudent = { nama: name, alamat: address, gender };

		try {
			const result = await updateData(studentData.id, updatedStudent);
			if (result.success) {
				setAlertMessage('Data siswa berhasil diperbarui');
				history.push('/student-list');
			} else {
				setAlertMessage('Gagal mengupdate data siswa, pastikan data valid');
			}
		} catch (error) {
			setAlertMessage('Ada Kesalahan: ' + error);
		}

		setShowAlert(true);
	};

	const handleCancel = () => {
		history.goBack();
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
					<IonInput label="Alamat" labelPlacement="floating" value={address} onIonInput={(e) => setAddress(e.detail.value || '')} type="text" placeholder="Masukkan Alamat" />
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
