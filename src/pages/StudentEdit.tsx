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
import { useHistory, useParams } from 'react-router-dom';
import { getDataById, updateData } from '../hooks/restAPIRequest';
import AlertOK from '../components/AlertOK';
import {useStudent} from '../context/StudentContext'


const StudentEdit: React.FC = () => {
	const history = useHistory();
  const {updated, setUpdated} = useStudent();

	const { id } = useParams<{ id: string }>();

	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [gender, setGender] = useState('L');
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				const student = await getDataById(id);
				if (student) {
					setName(student.nama);
					setAddress(student.alamat);
					setGender(student.gender);
				}
			} catch (error) {
				setAlertMessage('Gagal mengambil data siswa.');
				setShowAlert(true);
			}
		};
		fetchStudent();
	}, [id]);

	const handleEditStudent = async () => {
    document.body.focus(); 
    
		const updatedStudent = { nama: name, alamat: address, gender };

		try {
			const result = await updateData(id, updatedStudent);

			if (result.success) {
				setAlertMessage('Data siswa berhasil diperbarui');
        setUpdated(true);
				history.push('/student-list');
			} else {
				setAlertMessage('Gagal mengupdate data siswa, pastikan data valid');
			}
		} catch (error) {
			setAlertMessage('Ada Kesalahan: ' + error);
		}

		setShowAlert(true);
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => history.goBack()}>Batal</IonButton>
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

export default StudentEdit;
