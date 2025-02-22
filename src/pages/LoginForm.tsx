import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar, IonImg, IonInputPasswordToggle, IonSegment } from '@ionic/react';
// import './LoginForm.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginRequest } from '../hooks/restAPIRequest';
import AlertOK from '../components/AlertOK';


const LoginForm: React.FC = () => {

	const history = useHistory();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');

	const resetForm = () => {
		setUsername('');
		setPassword('');
	};

	const checkForm = (name: string, value: any) => {
		if (value === null || !value) {
			setAlertMessage('Data ' + name + " tidak boleh kosong!");
			setShowAlert(true)
			return false
		}
		return true
	}

	const handleLogin = async () => {

		const authData = { username, password }

		if (!checkForm("Username", authData.username) || !checkForm("Password", authData.password)) {
			return
		}

		try {

			const result = await loginRequest(authData)

			if (result.success) {
				setAlertMessage('Berhasil Login')
				history.push('/student-list')
			} else {
				setAlertMessage('Gagal Login, pastikan data sesuai')
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
					<IonTitle>Data Siswa APP</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonImg src="/icon.png" className="app-logo" alt="App Logo" />
				<IonSegment className="login-container">
					<IonItem>
						<IonInput
							label="Username"
							placeholder="Masukkan Username"
							value={username}
							onIonInput={(e) => setUsername(e.detail.value!)}
						/>
					</IonItem>
					<IonItem>
						<IonInput
							label="Password"
							placeholder="Masukkan Password"
							value={password}
							onIonInput={(e) => setPassword(e.detail.value!)}
							type="password"
						>
							<IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
						</IonInput>

					</IonItem>
					<IonButton expand="full" className="login-button" onClick={handleLogin}>Login</IonButton>
				</IonSegment>
			</IonContent>
			<AlertOK isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header={alertMessage} />
		</IonPage>
	);
};

export default LoginForm;
