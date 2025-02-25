import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar, IonImg, IonInputPasswordToggle, IonSegment, IonToast, IonProgressBar, IonText } from '@ionic/react';
// import './LoginForm.css';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { loginRequest } from '../hooks/restAPIRequest';
import AlertOK from '../components/AlertOK';
import { useAuth } from "../hooks/useAuthCookie";
import { warning } from 'ionicons/icons';

interface LocationState {
	isTokenExpired?: boolean;
	dontRefresh?: boolean;
}

const LoginForm: React.FC = () => {

	const { login, token } = useAuth();
	const history = useHistory();
	const location = useLocation<LocationState>();
	const [isTokenExpired, setIsTokenExpired] = useState(location.state?.isTokenExpired || false);

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
				const token = result.data.token;
				login(token);
				setAlertMessage('Berhasil Login')
				setIsTokenExpired(false)
				history.push('/student-list')
			} else {
				setAlertMessage('Gagal Login, pastikan data sesuai')
			}

		} catch (error) {
			console.info(error);
			setAlertMessage('Username atau Password salah!');
		}

		setShowAlert(true);
		resetForm();
	}

	useEffect(() => {
		if (token) {
			history.replace("/student-list", { isTokenExpired: true })
		}
	}, [token, history, isTokenExpired]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Data Siswa APP</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonImg src="/icon.png" className="app-logo" alt="App Logo" />
				{isTokenExpired ? (
					<IonToast
						isOpen={true}
						message={isTokenExpired ? "Sessi habis. Silahkan Login Kembali!" : "Kamu Sudah Login!"}
						duration={6000} position='middle'
						swipeGesture="vertical"
						icon={warning}
						buttons={[
							{
								text: 'Dismiss',
								role: 'cancel',
							},
						]}
					></IonToast>
				) : ''
				}
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
